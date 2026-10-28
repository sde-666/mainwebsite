import { siteConfig } from '../data/config';
import { Truck, Zap, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LegalLayout } from './Legal';

export function ShippingPolicy() {
  return (
    <LegalLayout
      title="Shipping & Delivery Policy"
      description="Clear policy explaining 100% instant digital delivery, multi-device web access, and zero shipping charges for all Skilldotpy online courses and PDF notes."
      activeTab="shipping"
      badge="Instant Digital Fulfillment • ₹0 Shipping Fees"
    >
      <div className="not-prose bg-blue-50/70 border border-blue-200/80 rounded-xl p-5 mb-8 text-blue-950">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="block text-blue-900 font-bold mb-1">100% Digital Delivery Notice:</strong>
            Skilldotpy operates exclusively as an online educational portal. We do not dispatch physical printed parcels or books. All course access, chapters, video lectures, and PDF study notes are unlocked <strong>instantly in your web browser</strong> upon payment confirmation.
          </div>
        </div>
      </div>

      <h2>1. Instant Digital Delivery (No Physical Shipping)</h2>
      <p>
        <strong>{siteConfig.name}</strong> operates exclusively as an online educational platform providing digital goods and e-learning services. All of our offerings — including NIELIT O Level Masterclasses, CCC Preparation Packs, Downloadable PDF Notes, CBT Mock Tests, and Practical Coding Workspaces — are <strong>100% digital</strong>.
      </p>
      <p>
        We do not manufacture, package, or physically dispatch printed books or physical parcels to postal addresses. Therefore, there are <strong>zero (₹0) shipping, courier, or handling charges</strong> applicable on any transactions across our platform.
      </p>

      <h2>2. How Access is Delivered &amp; Activated</h2>
      <p>
        Delivery of all educational courses and study resources is <strong>INSTANT and AUTOMATED</strong> upon successful payment confirmation through our authorized payment gateway (Razorpay):
      </p>
      <ul>
        <li>
          <strong>Instant Portal Activation:</strong> As soon as your transaction is confirmed, your course content, chapters, video lectures, and notes will be instantly unlocked in your {siteConfig.name} student profile.
        </li>
        <li>
          <strong>24/7 Multi-Device Access:</strong> You can access your enrolled courses anytime by logging in with your registered email on our official web platform (<a href={siteConfig.url} className="text-blue-600 font-semibold underline">{siteConfig.url}</a>) on mobile, tablet, or desktop.
        </li>
        <li>
          <strong>Payment Confirmation &amp; Invoice:</strong> You will immediately receive a digital payment receipt and transaction ID from Razorpay and {siteConfig.name} on your registered email address and phone number.
        </li>
      </ul>

      <h2>3. Delivery Timeline &amp; Service Guarantee</h2>
      <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <p className="font-bold text-slate-900 text-sm">Delivery Duration</p>
          <p className="text-blue-600 font-bold text-lg mt-1">Instant (0 to 5 Minutes)</p>
          <p className="text-xs text-slate-500 mt-1">Directly unlocked upon Razorpay payment capture.</p>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <p className="font-bold text-slate-900 text-sm">Delivery Mode</p>
          <p className="text-emerald-600 font-bold text-lg mt-1">Digital Access &amp; Download</p>
          <p className="text-xs text-slate-500 mt-1">Through your secure student profile and direct download links.</p>
        </div>
      </div>

      <h2>4. Troubleshooting Access or Activation Issues</h2>
      <p>
        In rare instances of bank network lag or UPI session timeouts where your payment succeeded but the course is not immediately showing as unlocked:
      </p>
      <ol>
        <li>Log out and log back into your student account with the same email used during checkout;</li>
        <li>Check your <Link to="/my-courses" className="text-blue-600 underline font-semibold">My Courses</Link> dashboard tab; or</li>
        <li>
          If you still cannot access your course within 15 minutes, please reach out to our dedicated support desk with your <strong>Razorpay Payment ID</strong> (e.g., <code>pay_xxxxxx</code>). Our administrative team guarantees manual activation within <strong>2 business hours</strong>.
        </li>
      </ol>
    </LegalLayout>
  );
}

export default ShippingPolicy;
