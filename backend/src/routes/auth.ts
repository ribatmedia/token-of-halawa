import { Router } from 'express';
import { AuthController } from '../controllers/auth';
import { strictSecurityLimiter } from '../middleware/rate-limiter';

const router = Router();

// Throttled auth routes
router.post('/register', strictSecurityLimiter, AuthController.register);
router.post('/login', strictSecurityLimiter, AuthController.login);
router.post('/refresh', AuthController.refresh);

export default router;
