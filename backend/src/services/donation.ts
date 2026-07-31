import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../libraries/prisma';
import { ApiError } from '../middleware/error';
import { config } from '../config';

export const donationCreateSchema = z.object({
  donorId: z.string(),
  campaignId: z.string().optional(),
  donationType: z.enum(['GENERAL', 'MONTHLY', 'ZAKAT', 'SADAQAH', 'EMERGENCY', 'EDUCATION']).default('GENERAL'),
  amount: z.number().positive('Donation amount must be greater than 0'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'CHEQUE', 'WALLET']).default('CASH')
});

export const verifySchema = z.object({
  action: z.enum(['APPROVED', 'REJECTED', 'HOLD']),
  comments: z.string().optional()
});

export class DonationService {
  static async create(userId: string, orgId: string, role: string, data: z.infer<typeof donationCreateSchema>) {
    const validated = donationCreateSchema.parse(data);

    // Verify donor details
    const donor = await prisma.donor.findUnique({ where: { id: validated.donorId } });
    if (!donor || donor.organizationId !== orgId) throw new ApiError(404, 'Donor profile not found');

    // Retrieve default payment method ID
    let method = await prisma.paymentMethod.findUnique({ where: { name: validated.paymentMethod } });
    if (!method) {
      method = await prisma.paymentMethod.create({ data: { name: validated.paymentMethod } });
    }

    return prisma.$transaction(async (tx) => {
      // 1. Log the Donation Entry
      const donation = await tx.donation.create({
        data: {
          donorId: validated.donorId,
          campaignId: validated.campaignId,
          donationType: validated.donationType,
          frequency: 'ONE_OFF',
          amount: validated.amount,
          status: 'PENDING',
          notes: validated.notes
        }
      });

      // 2. Log workflow submission status
      await tx.workflowLog.create({
        data: {
          donationId: donation.id,
          actorRole: role,
          actorId: userId,
          action: 'SUBMITTED',
          comments: 'Initial entry'
        }
      });

      // 3. Create payment record (pending success status)
      await tx.payment.create({
        data: {
          donationId: donation.id,
          paymentMethodId: method.id,
          amount: validated.amount,
          status: 'PENDING'
        }
      });

      // 4. Update campaign collection metric if attached
      if (validated.campaignId) {
        await tx.campaign.update({
          where: { id: validated.campaignId },
          data: { collectedAmount: { increment: validated.amount } }
        });
      }

      return donation;
    });
  }

  static async verify(userId: string, orgId: string, role: string, donationId: string, data: z.infer<typeof verifySchema>) {
    const validated = verifySchema.parse(data);

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { payments: true }
    });

    if (!donation) throw new ApiError(404, 'Donation record not found');

    return prisma.$transaction(async (tx) => {
      // Log the action to workflow
      await tx.workflowLog.create({
        data: {
          donationId,
          actorRole: role,
          actorId: userId,
          action: validated.action,
          comments: validated.comments
        }
      });

      let updatedStatus = donation.status;
      if (validated.action === 'APPROVED') {
        // In a complete flow, we advance status based on role. 
        // For simplicity: Admin & Leader approvals transition it to VERIFIED
        updatedStatus = 'VERIFIED';
        
        // Update payments status to SUCCESS
        await tx.payment.updateMany({
          where: { donationId },
          data: { status: 'SUCCESS', paidAt: new Date() }
        });

        // Auto-generate Smart Digital Receipt
        const currentYear = new Date().getFullYear();
        const count = await tx.receipt.count({
          where: {
            createdAt: {
              gte: new Date(currentYear, 0, 1)
            }
          }
        });
        const receiptNumber = `TOH-${currentYear}-${String(count + 1).padStart(6, '0')}`;

        // Create Cryptographic digital signature hash
        const dataToSign = `${donationId}-${donation.amount}-${donation.donorId}-${Date.now()}`;
        const digitalSignature = crypto.createHmac('sha256', config.jwt.secret).update(dataToSign).digest('hex');

        await tx.receipt.create({
          data: {
            organizationId: orgId,
            donationId,
            receiptNumber,
            digitalSignature
          }
        });
      } else if (validated.action === 'REJECTED') {
        updatedStatus = 'REJECTED';
        await tx.payment.updateMany({
          where: { donationId },
          data: { status: 'FAILED' }
        });
      }

      return tx.donation.update({
        where: { id: donationId },
        data: { status: updatedStatus }
      });
    });
  }

  static async getVerificationQueue(orgId: string) {
    return prisma.donation.findMany({
      where: {
        status: 'PENDING',
        donor: { organizationId: orgId }
      },
      include: {
        donor: true,
        campaign: true,
        payments: {
          include: { paymentMethod: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async getAll(orgId: string) {
    return prisma.donation.findMany({
      where: {
        donor: { organizationId: orgId }
      },
      include: {
        donor: true,
        campaign: true,
        payments: {
          include: { paymentMethod: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async delete(orgId: string, id: string) {
    let donation = await prisma.donation.findUnique({
      where: { id },
      include: { donor: true }
    });

    if (!donation) {
      const receipt = await prisma.receipt.findFirst({
        where: { receiptNumber: id },
        include: { donation: { include: { donor: true } } }
      });
      if (receipt?.donation) {
        donation = receipt.donation;
      }
    }

    if (!donation || (donation.donor && donation.donor.organizationId !== orgId)) {
      return { message: 'Donation not found or already removed' };
    }

    const realDonationId = donation.id;
    const realDonorId = donation.donorId;

    return prisma.$transaction(async (tx) => {
      // 1. Delete associated workflow logs
      await tx.workflowLog.deleteMany({ where: { donationId: realDonationId } });
      
      // 2. Delete associated payments
      await tx.payment.deleteMany({ where: { donationId: realDonationId } });
      
      // 3. Delete associated receipts
      await tx.receipt.deleteMany({ where: { donationId: realDonationId } });
      
      // 4. Update campaign collection metric if attached
      if (donation.campaignId && donation.status === 'VERIFIED') {
        await tx.campaign.update({
          where: { id: donation.campaignId },
          data: { collectedAmount: { decrement: donation.amount } }
        });
      }
      
      // 5. Delete donation itself
      const deletedDonation = await tx.donation.delete({ where: { id: realDonationId } });

      // 6. If no other donations remain for this donor, delete donor profile from database as well!
      if (realDonorId) {
        const remainingDonationsCount = await tx.donation.count({
          where: { donorId: realDonorId }
        });
        if (remainingDonationsCount === 0) {
          await tx.donorMerge.deleteMany({
            where: { OR: [{ mergedFromId: realDonorId }, { mergedToId: realDonorId }] }
          });
          await tx.donor.delete({ where: { id: realDonorId } }).catch(() => {});
        }
      }

      return deletedDonation;
    });
  }
}
