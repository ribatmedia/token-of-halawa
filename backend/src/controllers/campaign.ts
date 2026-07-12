import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { CampaignService } from '../services/campaign';

export class CampaignController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const result = await CampaignService.create(orgId, req.body);
      return res.status(201).json({
        message: 'Campaign created successfully',
        campaign: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const result = await CampaignService.list(orgId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const { id } = req.params;
      const result = await CampaignService.getById(orgId, id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
