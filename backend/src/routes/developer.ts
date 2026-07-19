import { Router } from 'express';
import { DeveloperController } from '../controllers/developer';

const router = Router();
const developerController = new DeveloperController();

// Dangerous operations - would normally be secured with strong auth
router.delete('/reset', developerController.factoryReset.bind(developerController));
router.get('/diagnostics', developerController.getDiagnostics.bind(developerController));
router.put('/banners', developerController.updateBanners.bind(developerController));

export default router;
