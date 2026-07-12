import { z } from 'zod';
import { prisma } from '../libraries/prisma';
import { ApiError } from '../middleware/error';

export const campaignCreateSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  description: z.string().optional(),
  goalAmount: z.number().positive('Goal amount must be greater than 0'),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)).optional()
});

export class CampaignService {
  static async create(orgId: string, data: z.infer<typeof campaignCreateSchema>) {
    const validated = campaignCreateSchema.parse(data);

    return prisma.campaign.create({
      data: {
        organizationId: orgId,
        name: validated.name,
        description: validated.description,
        goalAmount: validated.goalAmount,
        startDate: validated.startDate,
        endDate: validated.endDate,
        status: 'ACTIVE'
      }
    });
  }

  static async list(orgId: string) {
    return prisma.campaign.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null
      },
      include: {
        goals: true,
        _count: {
          select: { donations: true, members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(orgId: string, id: string) {
    const campaign = await prisma.campaign.findFirst({
      where: { id, organizationId: orgId, deletedAt: null },
      include: {
        goals: true,
        donations: {
          include: { donor: true }
        }
      }
    });

    if (!campaign) throw new ApiError(404, 'Campaign not found');
    return campaign;
  }
}
