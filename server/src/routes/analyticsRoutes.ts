import { Router } from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/summary', getAnalyticsSummary);

export default router;
