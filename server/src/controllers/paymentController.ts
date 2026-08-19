import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { createSnapTransaction, verifyMidtransSignature } from '../services/midtransService';

const planSchema = z.object({
  planType: z.enum(['MONTHLY', 'YEARLY']),
});

const PLAN_CONFIG = {
  MONTHLY: {
    price: 19000,
    name: 'Servisin PRO - 1 Bulan',
  },
  YEARLY: {
    price: 149000,
    name: 'Servisin PRO - 1 Tahun (Hemat 35%)',
  },
} as const;

export const createPaymentToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { planType } = planSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.',
      });
      return;
    }

    const selectedPlan = PLAN_CONFIG[planType];
    const orderId = `SERVISIN-${planType}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    let snapToken = '';
    let snapRedirectUrl = '';

    // Check if Midtrans keys are properly configured
    const hasValidMidtransKey = process.env.MIDTRANS_SERVER_KEY && !process.env.MIDTRANS_SERVER_KEY.includes('xxx');

    if (hasValidMidtransKey) {
      try {
        const snapRes = await createSnapTransaction({
          orderId,
          grossAmount: selectedPlan.price,
          customerDetails: {
            firstName: user.fullName,
            email: user.email,
            phone: user.phoneNumber || '08123456789',
          },
          itemDetails: [
            {
              id: planType,
              price: selectedPlan.price,
              quantity: 1,
              name: selectedPlan.name,
            },
          ],
        });
        snapToken = snapRes.token;
        snapRedirectUrl = snapRes.redirectUrl;
      } catch (err: any) {
        console.error('[Midtrans API Error]:', err.message);
        // Fallback simulation token if Midtrans sandbox network is unavailable
        snapToken = `mock-snap-token-${Date.now()}`;
        snapRedirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;
      }
    } else {
      // Sandbox / Simulation token for local development when keys are not yet provided
      snapToken = `mock-snap-token-${Date.now()}`;
      snapRedirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;
    }

    // Save transaction in database
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId,
        orderId,
        grossAmount: selectedPlan.price,
        planType,
        status: 'PENDING',
        snapToken,
        snapRedirectUrl,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Token transaksi pembayaran berhasil dibuat.',
      data: {
        orderId: transaction.orderId,
        grossAmount: transaction.grossAmount,
        planType: transaction.planType,
        snapToken: transaction.snapToken,
        snapRedirectUrl: transaction.snapRedirectUrl,
        clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-W2Q1e4k1e1r1-xxx',
      },
    });
  } catch (error: any) {
    console.error('Error creating payment token:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Gagal memproses pembayaran.',
    });
  }
};

export const handleWebhookNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const notification = req.body;
    console.log('[Midtrans Webhook Received]:', notification);

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = notification;

    if (!order_id) {
      res.status(400).json({ success: false, message: 'Invalid payload.' });
      return;
    }

    // Verify signature if server key is configured
    if (process.env.MIDTRANS_SERVER_KEY && !process.env.MIDTRANS_SERVER_KEY.includes('xxx') && signature_key) {
      const isValid = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key);
      if (!isValid) {
        console.warn('[Midtrans Webhook]: Signature mismatch for order:', order_id);
        res.status(403).json({ success: false, message: 'Signature verification failed.' });
        return;
      }
    }

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { orderId: order_id },
    });

    if (!transaction) {
      console.warn('[Midtrans Webhook]: Order not found in database:', order_id);
      res.status(404).json({ success: false, message: 'Transaction not found.' });
      return;
    }

    let newStatus = transaction.status;

    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        newStatus = 'CHALLENGE';
      } else if (fraud_status === 'accept') {
        newStatus = 'SETTLEMENT';
      }
    } else if (transaction_status === 'settlement') {
      newStatus = 'SETTLEMENT';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      newStatus = transaction_status.toUpperCase();
    } else if (transaction_status === 'pending') {
      newStatus = 'PENDING';
    }

    // Update transaction record
    await prisma.paymentTransaction.update({
      where: { orderId: order_id },
      data: {
        status: newStatus,
        paymentType: payment_type || transaction.paymentType,
        rawResponse: JSON.stringify(notification),
      },
    });

    // If payment is settled, activate user PRO tier!
    if (newStatus === 'SETTLEMENT') {
      await prisma.user.update({
        where: { id: transaction.userId },
        data: { tier: 'PRO' },
      });
      console.log(`[Midtrans Payment Success]: User ${transaction.userId} upgraded to PRO for order ${order_id}`);
    }

    res.status(200).json({ success: true, message: 'Notification processed successfully.' });
  } catch (error: any) {
    console.error('Error handling webhook notification:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const history = await prisma.paymentTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderId: true,
        grossAmount: true,
        planType: true,
        paymentType: true,
        status: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengambil riwayat transaksi.',
    });
  }
};

export const simulateMockPaymentSuccess = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { orderId } = req.body;

    const transaction = await prisma.paymentTransaction.findFirst({
      where: { orderId, userId },
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
      return;
    }

    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'SETTLEMENT',
        paymentType: 'qris_simulated',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { tier: 'PRO' },
    });

    res.status(200).json({
      success: true,
      message: 'Simulasi pembayaran Midtrans berhasil. Akun Anda telah diaktifkan ke Servisin PRO.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal memproses simulasi.',
    });
  }
};
