import { Request, Response } from 'express';
import { prisma } from '../libraries/prisma';

export class DeveloperController {
  
  // Factory Reset Database
  async factoryReset(req: Request, res: Response) {
    try {
      await prisma.payment.deleteMany();
      await prisma.receipt.deleteMany();
      await prisma.workflowLog.deleteMany();
      await prisma.donation.deleteMany();
      await prisma.donor.deleteMany();
      await prisma.campaign.updateMany({
        data: {
          collectedAmount: 0
        }
      });
      
      res.status(200).json({ message: 'Database reset successful' });
    } catch (error) {
      console.error('Factory Reset Error:', error);
      res.status(500).json({ error: 'Failed to factory reset database' });
    }
  }

  // Get System Diagnostics / Stats
  async getDiagnostics(req: Request, res: Response) {
    try {
      const totalCampaigners = await prisma.campaign.count();
      const totalDonations = await prisma.donation.count();
      
      const campaigns = await prisma.campaign.findMany({
        select: {
          collectedAmount: true,
          goalAmount: true
        }
      });
      
      const totalAmount = campaigns.reduce((acc, curr) => acc + Number(curr.collectedAmount || 0), 0);
      const verifiedAmount = campaigns.reduce((acc, curr) => acc + Number(curr.collectedAmount || 0), 0);

      res.status(200).json({
        totalCampaigners,
        totalDonations,
        totalAmount,
        verifiedAmount
      });
    } catch (error) {
      console.error('Get Diagnostics Error:', error);
      res.status(500).json({ error: 'Failed to fetch system diagnostics' });
    }
  }

  // Update Banners
  async updateBanners(req: Request, res: Response) {
    try {
      const { banners } = req.body;
      if (!Array.isArray(banners)) {
        return res.status(400).json({ error: 'Banners must be an array' });
      }

      const org = await prisma.organization.findFirst();
      if (!org) {
        return res.status(400).json({ error: 'No organization found' });
      }

      // Delete existing banners
      await prisma.setting.deleteMany({
        where: {
          organizationId: org.id,
          category: 'THEME',
          key: { startsWith: 'BANNER_' }
        }
      });

      // Insert new banners
      const createData = banners.filter(b => b).map((banner, index) => ({
        organizationId: org.id,
        key: `BANNER_${index + 1}`,
        value: banner,
        category: 'THEME'
      }));

      if (createData.length > 0) {
        await prisma.setting.createMany({
          data: createData
        });
      }

      res.status(200).json({ message: 'Banners updated successfully' });
    } catch (error) {
      console.error('Update Banners Error:', error);
      res.status(500).json({ error: 'Failed to update banners' });
    }
  }
}
