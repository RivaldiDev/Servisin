import { Router } from 'express';
import { register, login, getMe, updateProfile, toggleTier } from '../controllers/authController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJWT, getMe);
router.put('/profile', authenticateJWT, upload.single('photo'), updateProfile);
router.post('/toggle-tier', authenticateJWT, toggleTier);

export default router;
