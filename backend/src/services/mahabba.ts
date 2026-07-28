import { z } from 'zod';
import { prisma } from '../libraries/prisma';
import { ApiError } from '../middleware/error';

const MONTHS_ORDER = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

function generateReceiptNo(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MHB-${year}-${rand}`;
}

function parseMonths(monthsStr: string): string[] {
  return monthsStr.split(',').map(m => m.trim()).filter(Boolean);
}

function extractPlanRate(plan: string): number | null {
  const match = plan.match(/(\d+)\/?\s*month/i);
  return match ? parseInt(match[1], 10) : null;
}

export const donationCreateSchema = z.object({
  donorName: z.string().min(1),
  donorPhone: z.string().optional(),
  donorWhatsApp: z.string().optional(),
  donorAddress: z.string().optional(),
  amount: z.number().positive(),
  donationMonth: z.string().min(1),
  monthPlan: z.string().optional(),
  status: z.enum(['Received', 'Pending']).default('Received'),
  campaignerName: z.string().optional(),
  campaignerClass: z.string().optional(),
  volunteerId: z.string().optional()
});

export const donationRenewSchema = z.object({
  donorName: z.string().min(1),
  donorPhone: z.string().optional(),
  donorWhatsApp: z.string().optional(),
  donorAddress: z.string().optional(),
  amount: z.number().positive(),
  donationMonth: z.string().min(1),
  monthPlan: z.string().optional(),
  status: z.enum(['Received', 'Pending']).default('Received'),
  campaignerName: z.string().optional(),
  campaignerClass: z.string().optional(),
  volunteerId: z.string().optional()
});

export class MahabbaDonationService {
  static async create(orgId: string, data: z.infer<typeof donationCreateSchema>) {
    const validated = donationCreateSchema.parse(data);
    const months = parseMonths(validated.donationMonth);
    const receiptNo = generateReceiptNo();

    const donorKey = (validated.donorName + (validated.donorPhone || '')).toLowerCase().replace(/\s+/g, '');

    const existingDonation = await prisma.donation.findFirst({
      where: {
        campaignerName: validated.campaignerName,
        OR: [
          { receiptNo: { not: null } },
          { notes: { contains: donorKey } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    if (existingDonation) {
      const newAmount = validated.amount;
      const existingMonths = parseMonths(existingDonation.donationMonth || '');
      const mergedMonths = [...new Set([...existingMonths, ...months])].join(', ');
      
      const donation = await prisma.donation.update({
        where: { id: existingDonation.id },
        data: {
          amount: { increment: newAmount },
          donationMonth: mergedMonths,
          notes: `Updated: ${validated.donorName}, ${validated.donorPhone || ''}, ${validated.donorAddress || ''}`,
          campaignerName: validated.campaignerName || existingDonation.campaignerName,
          campaignerClass: validated.campaignerClass || existingDonation.campaignerClass,
        }
      });

      const donor = await prisma.donor.findUnique({ where: { id: donation.donorId } });

      return { donation, donor, isExisting: true };
    }

    const donorUniqueId = `TOH-D-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const donor = await prisma.donor.create({
      data: {
        organizationId: orgId,
        uniqueId: donorUniqueId,
        name: validated.donorName,
        phone: validated.donorPhone || '',
        whatsApp: validated.donorWhatsApp,
        location: validated.donorAddress,
        uniqueHash: donorKey,
        status: 'ACTIVE'
      }
    });

    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        donationType: 'GENERAL',
        frequency: 'MONTHLY',
        amount: validated.amount,
        status: validated.status === 'Received' ? 'PENDING' : 'PENDING',
        donationMonth: validated.donationMonth,
        monthPlan: validated.monthPlan,
        isVerified: false,
        initialAmount: validated.amount,
        campaignerName: validated.campaignerName,
        campaignerClass: validated.campaignerClass,
        receiptNo,
        notes: `${validated.donorName}, ${validated.donorPhone || ''}, ${validated.donorAddress || ''}`
      }
    });

    return { donation, donor, isExisting: false };
  }

  static async renew(orgId: string, data: z.infer<typeof donationRenewSchema>) {
    const validated = donationRenewSchema.parse(data);
    const receiptNo = generateReceiptNo();

    const donorKey = (validated.donorName + (validated.donorPhone || '')).toLowerCase().replace(/\s+/g, '');

    let donor = await prisma.donor.findFirst({
      where: { uniqueHash: donorKey, organizationId: orgId }
    });

    if (!donor) {
      const phoneMatch = validated.donorPhone
        ? await prisma.donor.findFirst({ where: { phone: validated.donorPhone, organizationId: orgId } })
        : null;
      if (phoneMatch) donor = phoneMatch;
    }

    if (!donor) {
      const donorUniqueId = `TOH-D-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      donor = await prisma.donor.create({
        data: {
          organizationId: orgId,
          uniqueId: donorUniqueId,
          name: validated.donorName,
          phone: validated.donorPhone || '',
          whatsApp: validated.donorWhatsApp,
          location: validated.donorAddress,
          uniqueHash: donorKey,
          status: 'ACTIVE'
        }
      });
    }

    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        donationType: 'GENERAL',
        frequency: 'MONTHLY',
        amount: validated.amount,
        status: validated.status === 'Received' ? 'PENDING' : 'PENDING',
        donationMonth: validated.donationMonth,
        monthPlan: validated.monthPlan,
        isVerified: false,
        initialAmount: validated.amount,
        campaignerName: validated.campaignerName,
        campaignerClass: validated.campaignerClass,
        receiptNo,
        notes: `${validated.donorName}, ${validated.donorPhone || ''}, ${validated.donorAddress || ''}`
      }
    });

    const allDonations = await prisma.donation.findMany({
      where: { donorId: donor.id, deletedAt: null },
      select: { amount: true, donationMonth: true }
    });

    const totalAmount = allDonations.reduce((sum, d) => sum + Number(d.amount), 0);
    const allMonths = [...new Set(allDonations.flatMap(d => parseMonths(d.donationMonth || '')))];

    return { donation, donor, totalAmount, combinedMonths: allMonths.join(', ') };
  }

  static async loadClassDonors(orgId: string, className: string) {
    const donations = await prisma.donation.findMany({
      where: {
        donor: { organizationId: orgId },
        campaignerClass: className,
        deletedAt: null
      },
      include: { donor: true },
      orderBy: { createdAt: 'desc' }
    });

    const grouped = new Map<string, any[]>();
    for (const d of donations) {
      const key = (d.donor.name + d.donor.phone).toLowerCase().replace(/\s+/g, '');
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(d);
    }

    const result: any[] = [];
    for (const [key, rows] of grouped) {
      const first = rows[0];
      const months: Record<string, any> = {};
      for (const m of MONTHS_ORDER) {
        const coveringTx = rows.find(r => parseMonths(r.donationMonth || '').includes(m));
        if (coveringTx) {
          const txMonths = parseMonths(coveringTx.donationMonth || '');
          const txAmount = Number(coveringTx.amount);
          const planRate = coveringTx.monthPlan ? extractPlanRate(coveringTx.monthPlan) : null;
          let monthAmount: number;

          if (planRate && txAmount > planRate * txMonths.length) {
            const lastMonth = txMonths[txMonths.length - 1];
            if (m === lastMonth) {
              monthAmount = txAmount - planRate * (txMonths.length - 1);
            } else {
              monthAmount = planRate;
            }
          } else {
            monthAmount = Math.round(txAmount / txMonths.length);
          }

          const verifiedMonths = parseMonths(coveringTx.verifiedMonths || '');
          months[m] = {
            amount: monthAmount,
            receiptNo: coveringTx.receiptNo,
            donationId: coveringTx.id,
            donationDate: coveringTx.createdAt,
            isVerified: verifiedMonths.includes(m),
            isPaid: true
          };
        } else {
          months[m] = { amount: 0, isPaid: false, isVerified: false };
        }
      }

      const totalCollected = rows.reduce((sum, r) => sum + Number(r.amount), 0);

      result.push({
        donor: first.donor,
        transactions: rows,
        months,
        totalCollected,
        monthPlan: first.monthPlan || '',
        campaignerName: first.campaignerName || '',
        campaignerClass: first.campaignerClass || ''
      });
    }

    result.sort((a, b) => (b.donor?.createdAt?.getTime() || 0) - (a.donor?.createdAt?.getTime() || 0));

    return result;
  }

  static async loadAdminDonors(orgId: string) {
    const donations = await prisma.donation.findMany({
      where: {
        donor: { organizationId: orgId },
        deletedAt: null
      },
      include: { donor: true },
      orderBy: { createdAt: 'desc' }
    });

    const grouped = new Map<string, any[]>();
    for (const d of donations) {
      const key = (d.donor.name + d.donor.phone).toLowerCase().replace(/\s+/g, '');
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(d);
    }

    const result: any[] = [];
    for (const [key, rows] of grouped) {
      const first = rows[0];
      const months: Record<string, any> = {};
      for (const m of MONTHS_ORDER) {
        const coveringTx = rows.find(r => parseMonths(r.donationMonth || '').includes(m));
        if (coveringTx) {
          const txMonths = parseMonths(coveringTx.donationMonth || '');
          const txAmount = Number(coveringTx.amount);
          const planRate = coveringTx.monthPlan ? extractPlanRate(coveringTx.monthPlan) : null;
          let monthAmount: number;

          if (planRate && txAmount > planRate * txMonths.length) {
            const lastMonth = txMonths[txMonths.length - 1];
            monthAmount = m === lastMonth ? txAmount - planRate * (txMonths.length - 1) : planRate;
          } else {
            monthAmount = Math.round(txAmount / txMonths.length);
          }

          const verifiedMonths = parseMonths(coveringTx.verifiedMonths || '');
          months[m] = {
            amount: monthAmount,
            receiptNo: coveringTx.receiptNo,
            donationId: coveringTx.id,
            donationDate: coveringTx.createdAt,
            isVerified: verifiedMonths.includes(m),
            isPaid: true
          };
        } else {
          months[m] = { amount: 0, isPaid: false, isVerified: false };
        }
      }

      result.push({
        donor: first.donor,
        transactions: rows,
        months,
        totalCollected: rows.reduce((sum, r) => sum + Number(r.amount), 0),
        monthPlan: first.monthPlan || '',
        campaignerName: first.campaignerName || '',
        campaignerClass: first.campaignerClass || ''
      });
    }

    return result;
  }

  static async verifyMonth(orgId: string, donationId: string, month: string) {
    const donation = await prisma.donation.findFirst({
      where: { id: donationId, donor: { organizationId: orgId } }
    });
    if (!donation) throw new ApiError(404, 'Donation not found');

    const verified = parseMonths(donation.verifiedMonths || '');
    if (!verified.includes(month)) {
      verified.push(month);
    }
    const verifiedMonthsStr = verified.join(',');

    return prisma.donation.update({
      where: { id: donationId },
      data: {
        verifiedMonths: verifiedMonthsStr,
        isVerified: verified.length > 0
      }
    });
  }

  static async unverifyMonth(orgId: string, donationId: string, month: string) {
    const donation = await prisma.donation.findFirst({
      where: { id: donationId, donor: { organizationId: orgId } }
    });
    if (!donation) throw new ApiError(404, 'Donation not found');

    const verified = parseMonths(donation.verifiedMonths || '').filter(m => m !== month);
    const verifiedMonthsStr = verified.join(',');

    return prisma.donation.update({
      where: { id: donationId },
      data: {
        verifiedMonths: verifiedMonthsStr,
        isVerified: verified.length > 0
      }
    });
  }

  static async getDonationByReceipt(receiptNo: string) {
    return prisma.donation.findFirst({
      where: { receiptNo },
      include: { donor: true }
    });
  }
}

export const classHandoverCreateSchema = z.object({
  className: z.string().min(1),
  handoverMonth: z.string().min(1),
  leaderName: z.string().min(1),
  leaderPhone: z.string().optional(),
  amount: z.number().positive(),
  adminName: z.string().optional(),
  notes: z.string().optional()
});

export class ClassHandoverService {
  static async create(orgId: string, data: z.infer<typeof classHandoverCreateSchema>) {
    const validated = classHandoverCreateSchema.parse(data);
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const receiptNo = `HND-${year}-${rand}`;

    return prisma.classHandover.create({
      data: {
        organizationId: orgId,
        className: validated.className,
        handoverMonth: validated.handoverMonth,
        leaderName: validated.leaderName,
        leaderPhone: validated.leaderPhone,
        amount: validated.amount,
        adminName: validated.adminName,
        receiptNo,
        notes: validated.notes
      }
    });
  }

  static async list(orgId: string) {
    return prisma.classHandover.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
