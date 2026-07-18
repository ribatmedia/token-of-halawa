import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class DeveloperController {
  
  // Factory Reset Database
  async factoryReset(req: Request, res: Response) {
    try {
      await prisma.$transaction([
        prisma.payment.deleteMany(),
        prisma.receipt.deleteMany(),
        prisma.workflowLog.deleteMany(),
        prisma.donation.deleteMany(),
        prisma.donor.deleteMany(),
        prisma.campaign.updateMany({
          data: {
            collectedAmount: 0,
            verifiedAmount: 0
          }
        })
      ]);
      
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
          verifiedAmount: true
        }
      });
      
      const totalAmount = campaigns.reduce((acc, curr) => acc + Number(curr.collectedAmount || 0), 0);
      const verifiedAmount = campaigns.reduce((acc, curr) => acc + Number(curr.verifiedAmount || 0), 0);

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
}
