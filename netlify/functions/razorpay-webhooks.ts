import type { Handler } from './types.ts';
import crypto from 'crypto';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Razorpay-Signature',
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
    const signature = event.headers['x-razorpay-signature'] || event.headers['X-Razorpay-Signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const rawBody = event.body || '';

    // Verify webhook signature
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('Invalid Razorpay webhook signature');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid webhook signature' })
        };
      }
    }

    const payload = rawBody ? JSON.parse(rawBody) : {};
    const eventType = payload.event;

    console.log(`Received Razorpay webhook event: ${eventType}`);

    // Handle payment.captured or order.paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const notes = paymentEntity?.notes || {};

      const courseId = notes.courseId;
      const studentEmail = notes.studentEmail || paymentEntity?.email;
      const paymentId = paymentEntity?.id;
      const orderId = paymentEntity?.order_id;
      const amount = (paymentEntity?.amount || 0) / 100;

      console.log(`Payment confirmed via webhook: course=${courseId}, email=${studentEmail}, paymentId=${paymentId}, amount=₹${amount}`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'ok',
          message: 'Webhook processed successfully',
          courseId,
          studentEmail,
          paymentId
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'ignored', message: `Unhandled event: ${eventType}` })
    };
  } catch (error: any) {
    console.error('Error processing Razorpay webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Webhook processing failed' })
    };
  }
};
