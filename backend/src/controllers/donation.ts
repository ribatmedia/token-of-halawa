import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { DonationService } from '../services/donation';

export class DonationController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const orgId = req.user!.organizationId;
      const role = req.user!.roles[0] || 'VOLUNTEER';

      const result = await DonationService.create(userId, orgId, role, req.body);
      return res.status(201).json({
        message: 'Donation logged successfully and is pending verification',
        donation: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const orgId = req.user!.organizationId;
      const role = req.user!.roles[0] || 'VOLUNTEER';
      const { id } = req.params;

      const result = await DonationService.verify(userId, orgId, role, id, req.body);
      return res.status(200).json({
        message: `Donation verification step processed successfully as: ${req.body.action}`,
        donation: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getQueue(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const result = await DonationService.getVerificationQueue(orgId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
