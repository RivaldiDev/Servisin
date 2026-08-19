import { Router } from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  updateOdometer,
  deleteVehicle,
} from '../controllers/vehicleController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', upload.single('photo'), createVehicle);
router.put('/:id', upload.single('photo'), updateVehicle);
router.patch('/:id/odometer', updateOdometer);
router.delete('/:id', deleteVehicle);

export default router;
