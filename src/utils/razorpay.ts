import { CourseItem, RazorpayOrderData } from '../types/paidCourse';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay Checkout Script
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Get Razorpay Key from environment or fallback demo test key
export function getRazorpayKey(): string {
  // Uses Vite public env variable if set, otherwise fallback to standard Razorpay test key
  return (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || 'rzp_test_5173Skilldotpy';
}

/**
 * Open Instant Razorpay Checkout modal
 */
export async function openRazorpayCheckout({
  course,
  studentName,
  studentEmail,
  studentPhone,
  onSuccess,
  onDismiss,
  onError
}: {
  course: CourseItem;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  onSuccess: (paymentId: string, orderId?: string) => void;
  onDismiss?: () => void;
  onError?: (err: any) => void;
}) {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Unable to load Razorpay payment gateway. Please check your internet connection.');
      return;
    }

    const key = getRazorpayKey();
    const amountInPaise = Math.round(course.price * 100); // 499 INR -> 49900 paise

    const options: RazorpayOrderData = {
      key: key,
      amount: amountInPaise,
      currency: 'INR',
      name: 'Skilldotpy Education',
      description: `Enrollment for ${course.title.substring(0, 40)}...`,
      image: 'https://skilldotpy.com/skilldotpy-logo.svg',
      handler: function (response) {
        if (response && response.razorpay_payment_id) {
          onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
        } else {
          // If in test mode simulation
          const simPaymentId = `pay_sim_${Date.now()}`;
          onSuccess(simPaymentId);
        }
      },
      prefill: {
        name: studentName,
        email: studentEmail,
        contact: studentPhone || '9876543210'
      },
      notes: {
        courseId: course.id,
        courseTitle: course.title
      },
      theme: {
        color: '#2563eb' // Skilldotpy blue
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) onDismiss();
        }
      }
    };

    const rzp = new window.Razorpay(options);
    
    // Handle payment failed
    rzp.on('payment.failed', function (response: any) {
      console.warn('Payment failed callback:', response.error);
      if (onError) onError(response.error);
      else alert(`Payment Failed: ${response.error?.description || 'Transaction declined'}`);
    });

    rzp.open();
  } catch (error) {
    console.error('Error opening Razorpay checkout:', error);
    if (onError) onError(error);
  }
}
