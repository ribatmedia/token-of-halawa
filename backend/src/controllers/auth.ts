import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(201).json({
        message: 'Organization and administrator account registered successfully',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip;
      const userAgent = req.headers['user-agent'];
      const result = await AuthService.login(req.body, ip, userAgent);
      return res.status(200).json({
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.refresh(req.body);
      return res.status(200).json({
        message: 'Token refreshed successfully',
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
}
