import React from 'react';
import { siteConfig } from '../data/config';
import { Truck, Zap, ShieldCheck, HelpCircle, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ShippingPolicy() {
  return (
    <div id="shipping-policy-page" className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-12">
        
        {/* Header Header */}
        <div className="border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-center gap-3 text-blue-600 mb-3">
            <Truck className="w-8 h-8" />
            <span className="text-xs font-bold tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Delivery & Fulfillment
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Shipping & Delivery Policy</h1>
          <p className="text-sm text-slate-500 mt-2">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900">1. Instant Digital Delivery (No Physical Shipping)</h2>
            </div>
            <p>
              <strong>{siteConfig.name}</strong> operates exclusively as an online educational platform providing digital goods and e-learning services. All of our offerings — including NIELIT O Level Masterclasses, CCC Preparation Packs, Downloadable PDF Notes, CBT Mock Tests, and Practical Coding Workspaces — are <strong>100% digital</strong>.
            </p>
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
              <p className="font-semibold mb-1">📦 Physical Shipping Notice:</p>
              <p>
                We do not manufacture, package, or physically dispatch printed books or physical parcels to postal addresses. Therefore, there are <strong>zero (₹0) shipping, courier, or handling charges</strong> applicable on any transactions.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. How Access is Delivered</h2>
            <p>
              Delivery of all educational courses and study resources is <strong>INSTANT and AUTOMATED</strong> upon successful payment confirmation through our authorized payment gateway (Razorpay):
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Instant Portal Activation:</strong> As soon as your transaction is confirmed, your course content, chapters, video lectures, and notes will be instantly unlocked in your {siteConfig.name} student account.
              </li>
              <li>
                <strong>24/7 Multi-Device Access:</strong> You can access your enrolled courses anytime by logging in with your registered email on our official web app (<a href={siteConfig.url} className="text-blue-600 font-semibold underline">{siteConfig.url}</a>) or via the Skilldotpy Android Mobile App.
              </li>
              <li>
                <strong>Payment Confirmation:</strong> You will immediately receive a digital payment receipt and transaction ID from Razorpay and {siteConfig.name} on your registered email address and phone number.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Delivery Timeline & Service Guarantee</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <p className="font-bold text-slate-900 text-sm">Delivery Duration</p>
                <p className="text-blue-600 font-bold text-lg mt-1">Instant (0 to 5 Minutes)</p>
                <p className="text-xs text-slate-500 mt-1">Directly unlocked upon Razorpay payment capture.</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <p className="font-bold text-slate-900 text-sm">Delivery Mode</p>
                <p className="text-emerald-600 font-bold text-lg mt-1">Digital Access & Download</p>
                <p className="text-xs text-slate-500 mt-1">Through your secure student profile and direct download links.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-slate-900">4. Troubleshooting Delivery or Access Issues</h2>
            </div>
            <p>
              In rare instances of bank network lag or UPI session timeouts where your payment succeeded but the course is not immediately showing as unlocked:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Log out and log back into your student account with the same email used during checkout.</li>
              <li>Check your <Link to="/my-courses" className="text-blue-600 underline font-semibold">My Courses</Link> dashboard tab.</li>
              <li>
                If you still cannot access your course within 15 minutes, please reach out to our dedicated support desk with your <strong>Razorpay Payment ID</strong> (e.g., <code>pay_xxxxxx</code>). Our administrative team guarantees manual activation within <strong>2 business hours</strong>.
              </li>
            </ol>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">5. Contact Support</h2>
            </div>
            <p>
              For any queries regarding your order delivery, course accessibility, or technical assistance, please feel free to reach us:
            </p>
            <div className="bg-slate-100 rounded-xl p-5 mt-3 space-y-2.5 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-900">Email:</span>
                <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 underline">
                  {siteConfig.links.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900">WhatsApp / Call:</span>
                <a href={`https://wa.me/${siteConfig.links.whatsapp}`} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
                  +91 {siteConfig.links.whatsapp}
                </a>
              </div>
              <div className="pt-2 text-xs text-slate-500">
                Operating Address: Uttar Pradesh, India • Working Hours: Monday to Saturday, 9:00 AM – 8:00 PM IST
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <Link to="/refund-policy" className="hover:text-blue-600 underline">
            Cancellation & Refund Policy
          </Link>
          <span>•</span>
          <Link to="/terms-and-conditions" className="hover:text-blue-600 underline">
            Terms & Conditions
          </Link>
          <span>•</span>
          <Link to="/privacy-policy" className="hover:text-blue-600 underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-blue-600 underline">
            Contact Us
          </Link>
        </div>

      </div>
    </div>
  );
}
export default ShippingPolicy;
