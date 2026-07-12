import { Router } from 'express';
import { CampaignController } from '../controllers/campaign';
import { authenticate, requirePermission } from '../middleware/auth';
import { PERMISSIONS } from '../constants';

const router = Router();

router.use(authenticate);

router.post('/', requirePermission(PERMISSIONS.CAMPAIGN_CREATE), CampaignController.create);
router.get('/', requirePermission(PERMISSIONS.CAMPAIGN_READ), CampaignController.list);
router.get('/:id', requirePermission(PERMISSIONS.CAMPAIGN_READ), CampaignController.getById);

export default router;
