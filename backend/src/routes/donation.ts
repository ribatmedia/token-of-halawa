import { Router } from 'express';
import { DonationController } from '../controllers/donation';
import { authenticate, requirePermission } from '../middleware/auth';
import { PERMISSIONS } from '../constants';

const router = Router();

router.use(authenticate);

router.post('/', requirePermission(PERMISSIONS.DONATION_CREATE), DonationController.create);
router.get('/queue', requirePermission(PERMISSIONS.DONATION_VERIFY), DonationController.getQueue);
router.patch('/:id/verify', requirePermission(PERMISSIONS.DONATION_VERIFY), DonationController.verify);

export default router;
