import { Router } from 'express';
import { PublicController } from '../controllers/public';

const router = Router();

router.get('/home-stats', PublicController.getHomeStats);
router.get('/banners', PublicController.getBanners);

export default router;
