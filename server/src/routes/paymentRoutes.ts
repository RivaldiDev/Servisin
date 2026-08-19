import { Router } from 'express';
import {
  createPaymentToken,
  handleWebhookNotification,
  getPaymentHistory,
  simulateMockPaymentSuccess,
} from '../controllers/paymentController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Create Snap Token (Requires Auth)
router.post('/create-snap-token', authenticateJWT, createPaymentToken);

// Webhook Callback (Public endpoint called by Midtrans)
router.post('/notification', handleWebhookNotification);

// Payment History (Requires Auth)
router.get('/history', authenticateJWT, getPaymentHistory);

// Simulate Sandbox Payment Success (For testing/development)
router.post('/simulate-success', authenticateJWT, simulateMockPaymentSuccess);

export default router;
