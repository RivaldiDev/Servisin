import { Router } from 'express';
import {
  getServiceLogs,
  getServiceLogById,
  createServiceLog,
  updateServiceLog,
  deleteServiceLog,
} from '../controllers/serviceLogController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getServiceLogs);
router.get('/:id', getServiceLogById);
router.post('/', upload.single('invoicePhoto'), createServiceLog);
router.put('/:id', upload.single('invoicePhoto'), updateServiceLog);
router.delete('/:id', deleteServiceLog);

export default router;
