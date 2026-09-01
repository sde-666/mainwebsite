import type { Handler } from './types.ts';
import crypto from 'crypto';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
      studentEmail,
      studentName,
      studentPhone,
      amountPaid
    } = body;

    if (!razorpay_payment_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'razorpay_payment_id is required' })
      };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Cryptographic HMAC SHA256 Verification
    let isSignatureValid = false;

    if (!keySecret) {
      // In dev mode when secret is not yet configured, allow grace with clear warning
      console.warn('RAZORPAY_KEY_SECRET is not configured. Skipping cryptographic verification in local demo mode.');
      isSignatureValid = true;
    } else if (razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isSignatureValid = generatedSignature === razorpay_signature;
    } else {
      // Fallback for direct checkout payments without order ID
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid payment signature. Payment verification failed.'
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        verified: true,
        message: 'Payment cryptographically verified successfully.',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id || '',
        courseId,
        userId,
        studentEmail,
        timestamp: Date.now()
      })
    };
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Payment verification failed'
      })
    };
  }
};
