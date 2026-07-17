import { z } from 'zod';
import { prisma } from '../libraries/prisma';
import { ApiError } from '../middleware/error';

export const donorCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  fatherName: z.string().optional(),
  gender: z.string().optional(),
  dob: z.string().transform((val) => val ? new Date(val) : undefined).optional(),
  phone: z.string().min(10, 'Valid phone number required'),
  whatsApp: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  occupation: z.string().optional(),
  category: z.enum(['GENERAL', 'PREMIUM', 'WIDOW', 'ORPHAN', 'POOR']).default('GENERAL'),
  donationPlan: z.enum(['MONTHLY', 'YEARLY', 'ONE_OFF']).default('MONTHLY'),
  location: z.string().optional(),
  unitId: z.string().optional(),
  classId: z.string().optional(),
  forceCreate: z.boolean().optional()
});

export class DonorService {
  static async checkDuplicate(phone: string, email?: string) {
    // Exact match checks
    const normalizedPhone = phone.trim().replace(/\s+/g, '');
    const normalizedEmail = email?.trim().toLowerCase();

    const matches = await prisma.donor.findMany({
      where: {
        OR: [
          { phone: normalizedPhone },
          normalizedEmail ? { email: normalizedEmail } : {}
        ]
      }
    });

    return matches.length > 0 ? matches : null;
  }

  static async create(orgId: string, data: z.infer<typeof donorCreateSchema>) {
    const validated = donorCreateSchema.parse(data);

    // Normalize entries
    const normPhone = validated.phone.trim().replace(/\s+/g, '');
    const normEmail = validated.email?.trim().toLowerCase();

    // Check duplicates
    if (!validated.forceCreate) {
      const duplicates = await this.checkDuplicate(normPhone, normEmail);
      if (duplicates && duplicates.length > 0) {
        throw new ApiError(409, `Potential duplicate donor profile discovered. Matches ID: ${duplicates[0].uniqueId}`);
      }
    }

    // Generate unique indexable hash (append timestamp if forced to avoid Prisma unique constraint error)
    const uniqueHash = validated.forceCreate 
      ? `${normPhone}-${normEmail || 'none'}-${Date.now()}`
      : `${normPhone}-${normEmail || 'none'}`;

    // Auto-generate Unique ID format (TOH-D-XXXXXX)
    const count = await prisma.donor.count();
    const uniqueId = `TOH-D-${String(count + 1).padStart(6, '0')}`;

    return prisma.donor.create({
      data: {
        organizationId: orgId,
        uniqueId,
        name: validated.name,
        fatherName: validated.fatherName,
        gender: validated.gender,
        dob: validated.dob,
        phone: normPhone,
        whatsApp: validated.whatsApp || normPhone,
        email: normEmail,
        occupation: validated.occupation,
        category: validated.category,
        donationPlan: validated.donationPlan,
        location: validated.location,
        uniqueHash,
        unitId: validated.unitId,
        classId: validated.classId,
        status: 'ACTIVE'
      }
    });
  }

  static async list(orgId: string, page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      organizationId: orgId,
      deletedAt: null
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { uniqueId: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.donor.count({ where })
    ]);

    return { donors, total, page, pages: Math.ceil(total / limit) };
  }

  static async merge(orgId: string, sourceId: string, targetId: string, reason?: string) {
    return prisma.$transaction(async (tx) => {
      const source = await tx.donor.findUnique({ where: { id: sourceId } });
      const target = await tx.donor.findUnique({ where: { id: targetId } });

      if (!source || !target || source.organizationId !== orgId || target.organizationId !== orgId) {
        throw new ApiError(404, 'Source or target donor profile not found');
      }

      // Re-assign all source donations to target donor
      await tx.donation.updateMany({
        where: { donorId: sourceId },
        data: { donorId: targetId }
      });

      // Update source status to MERGED
      await tx.donor.update({
        where: { id: sourceId },
        data: { status: 'MERGED', deletedAt: new Date() }
      });

      // Create log entry
      return tx.donorMerge.create({
        data: {
          mergedFromId: sourceId,
          mergedToId: targetId,
          reason
        }
      });
    });
  }
}
