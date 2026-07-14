import { Router } from 'express';
import { PublicController } from '../controllers/public';

const router = Router();

router.get('/home-stats', PublicController.getHomeStats);

export default router;
