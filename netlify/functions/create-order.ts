import type { Handler } from './types.ts';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// In-memory or fallback course price catalog to prevent price tampering
const COURSE_PRICES: Record<string, { title: string; price: number }> = {
  'o-level-all-in-one': { title: 'NIELIT O Level All-in-One Master Batch (M1, M2, M3, M4)', price: 999 },
  'o-level-m1': { title: 'M1-R5.1 IT Tools & Network Basics Complete Video Course', price: 349 },
  'o-level-m2': { title: 'M2-R5.1 Web Designing & Publishing Complete Video Course', price: 349 },
  'o-level-m3': { title: 'M3-R5.1 Python Programming Complete Master Video Course', price: 399 },
  'o-level-m4': { title: 'M4-R5.1 Internet of Things (IoT) Complete Video Course', price: 349 },
  'ccc-master-course': { title: 'CCC Complete Master Course (Theory + 1000+ MCQs)', price: 199 },
  'python-complete-mastery': { title: 'Python Programming from Scratch to Advanced', price: 299 },
  'web-dev-fundamentals': { title: 'Web Development Bootcamp (HTML, CSS, JS, React)', price: 299 },
  'libreoffice-suite-mastery': { title: 'LibreOffice Suite Complete Practical Mastery', price: 149 },
  'ms-office-pro': { title: 'Microsoft Office Professional Mastery', price: 149 }
};

export const handler: Handler = async (event) => {
  // CORS Headers
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
    const { courseId, userId, studentEmail, studentName, studentPhone, customAmount } = body;

    if (!courseId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'courseId is required.' })
      };
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Determine final price server-side to prevent price tampering
    let amountInRupees = 499;
    let courseTitle = 'Skilldotpy Course';

    if (COURSE_PRICES[courseId]) {
      amountInRupees = COURSE_PRICES[courseId].price;
      courseTitle = COURSE_PRICES[courseId].title;
    } else if (customAmount && Number(customAmount) > 0) {
      amountInRupees = Math.max(1, Number(customAmount));
    }

    const amountInPaise = Math.round(amountInRupees * 100);

    // If Razorpay credentials are not yet configured in Netlify environment, return informative fallback order
    if (!keyId || !keySecret) {
      const fallbackOrderId = `order_demo_${Date.now()}`;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          orderId: fallbackOrderId,
          amount: amountInPaise,
          currency: 'INR',
          keyId: keyId || 'rzp_test_placeholder',
          courseTitle,
          isSimulation: true,
          notice: 'RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET need to be set in Netlify / server environment variables.'
        })
      };
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const receipt = `rcpt_${(userId || 'guest').substring(0, 10)}_${Date.now().toString().slice(-6)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        courseId,
        courseTitle: courseTitle.substring(0, 50),
        userId: userId || '',
        studentEmail: studentEmail || '',
        studentName: studentName || ''
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
        courseTitle
      })
    };
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Failed to create Razorpay order'
      })
    };
  }
};
