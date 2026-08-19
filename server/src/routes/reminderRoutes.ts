import { Router } from 'express';
import {
  getReminders,
  createReminder,
  updateReminder,
  completeReminder,
  deleteReminder,
} from '../controllers/reminderController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.post('/:id/complete', completeReminder);
router.delete('/:id', deleteReminder);

export default router;
