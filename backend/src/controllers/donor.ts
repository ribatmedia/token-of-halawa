import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { DonorService } from '../services/donor';

export class DonorController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const result = await DonorService.create(orgId, req.body);
      return res.status(201).json({
        message: 'Donor profile registered successfully',
        donor: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const search = req.query.search as string;

      const result = await DonorService.list(orgId, page, limit, search);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async merge(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const { sourceId, targetId, reason } = req.body;
      
      const result = await DonorService.merge(orgId, sourceId, targetId, reason);
      return res.status(200).json({
        message: 'Donor profiles merged successfully',
        mergeLog: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user!.organizationId;
      const { id } = req.params;
      
      await DonorService.delete(orgId, id);
      return res.status(200).json({
        message: 'Donor profile deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
