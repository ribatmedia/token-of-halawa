import { Router } from 'express';
import { MahabbaDonationController, ClassHandoverController } from '../controllers/mahabba';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/donations/new', MahabbaDonationController.create);
router.post('/donations/renew', MahabbaDonationController.renew);
router.get('/donations/class', MahabbaDonationController.loadClassDonors);
router.get('/donations/admin', MahabbaDonationController.loadAdminDonors);
router.get('/donations/receipt/:receiptNo', MahabbaDonationController.getDonationByReceipt);
router.patch('/donations/:id/verify', MahabbaDonationController.verifyMonth);
router.patch('/donations/:id/unverify', MahabbaDonationController.unverifyMonth);

router.post('/class-handovers', ClassHandoverController.create);
router.get('/class-handovers', ClassHandoverController.list);

export default router;
