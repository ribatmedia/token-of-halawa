import { Router } from 'express';
import { DonorController } from '../controllers/donor';
import { authenticate, requirePermission } from '../middleware/auth';
import { PERMISSIONS } from '../constants';

const router = Router();

router.use(authenticate);

router.post('/', requirePermission(PERMISSIONS.DONOR_CREATE), DonorController.create);
router.get('/', requirePermission(PERMISSIONS.DONOR_READ), DonorController.list);
router.post('/merge', requirePermission(PERMISSIONS.DONOR_MERGE), DonorController.merge);

export default router;
