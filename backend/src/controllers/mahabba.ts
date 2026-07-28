import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { MahabbaDonationService, ClassHandoverService } from '../services/mahabba';

export class MahabbaDonationController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const result = await MahabbaDonationService.create(orgId, req.body);
      return res.status(201).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async renew(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const result = await MahabbaDonationService.renew(orgId, req.body);
      return res.status(201).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async loadClassDonors(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const className = req.query.class as string;
      if (!className) return res.status(400).json({ error: 'className query param required' });
      const result = await MahabbaDonationService.loadClassDonors(orgId, className);
      return res.status(200).json({ success: true, donors: result });
    } catch (error) {
      next(error);
    }
  }

  static async loadAdminDonors(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const result = await MahabbaDonationService.loadAdminDonors(orgId);
      return res.status(200).json({ success: true, donors: result });
    } catch (error) {
      next(error);
    }
  }

  static async verifyMonth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const { id } = req.params;
      const { month } = req.body;
      const result = await MahabbaDonationService.verifyMonth(orgId, id, month);
      return res.status(200).json({ success: true, donation: result });
    } catch (error) {
      next(error);
    }
  }

  static async unverifyMonth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const { id } = req.params;
      const { month } = req.body;
      const result = await MahabbaDonationService.unverifyMonth(orgId, id, month);
      return res.status(200).json({ success: true, donation: result });
    } catch (error) {
      next(error);
    }
  }

  static async getDonationByReceipt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { receiptNo } = req.params;
      const result = await MahabbaDonationService.getDonationByReceipt(receiptNo);
      if (!result) return res.status(404).json({ error: 'Receipt not found' });
      return res.status(200).json({ success: true, donation: result });
    } catch (error) {
      next(error);
    }
  }
}

export class ClassHandoverController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const result = await ClassHandoverService.create(orgId, req.body);
      return res.status(201).json({ success: true, handover: result });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const handovers = await ClassHandoverService.list(orgId);
      return res.status(200).json({ success: true, handovers });
    } catch (error) {
      next(error);
    }
  }
}
