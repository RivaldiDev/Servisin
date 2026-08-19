import crypto from 'crypto';
// @ts-ignore
import midtransClient from 'midtrans-client';

const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-TO7YJv6Xj50vB5sA8m8j-xxx';
const clientKey = process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-W2Q1e4k1e1r1-xxx';
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

// Initialize Midtrans Snap Client
export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

export interface CreateSnapParams {
  orderId: string;
  grossAmount: number;
  customerDetails: {
    firstName: string;
    email: string;
    phone?: string;
  };
  itemDetails: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export const createSnapTransaction = async (params: CreateSnapParams) => {
  const parameter = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: params.customerDetails.firstName,
      email: params.customerDetails.email,
      phone: params.customerDetails.phone || '08123456789',
    },
    item_details: params.itemDetails,
    callbacks: {
      finish: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/profile?payment=success` : 'http://localhost:5173/profile?payment=success',
      error: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/profile?payment=error` : 'http://localhost:5173/profile?payment=error',
    },
  };

  const transaction = await snap.createTransaction(parameter);
  return {
    token: transaction.token as string,
    redirectUrl: transaction.redirect_url as string,
  };
};

export const verifyMidtransSignature = (
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean => {
  const currentServerKey = process.env.MIDTRANS_SERVER_KEY || '';
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${currentServerKey}`)
    .digest('hex');

  if (!signatureKey || hash.length !== signatureKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(hash, 'utf-8'), Buffer.from(signatureKey, 'utf-8'));
};
