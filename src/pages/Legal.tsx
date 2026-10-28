import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { siteConfig } from '../data/config';
import {
  ShieldCheck,
  FileText,
  RefreshCw,
  Truck,
  AlertTriangle,
  Lock,
  Scale,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Clock,
  Building,
  Eye,
  Trash2,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'refund' | 'shipping' | 'disclaimer';

interface LegalLayoutProps {
  title: string;
  description?: string;
  activeTab: LegalTab;
  badge?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  description,
  activeTab,
  badge = 'Statutory Compliance • DPDP Act, 2023 & IT Act, 2000',
  lastUpdated,
  children
}: LegalLayoutProps) {
  const currentDate = lastUpdated || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const tabs: { id: LegalTab; name: string; path: string; icon: React.ReactNode }[] = [
    {
      id: 'privacy',
      name: 'Privacy Policy (DPDPA)',
      path: '/privacy-policy',
      icon: <ShieldCheck className="w-4 h-4 shrink-0" />
    },
    {
      id: 'terms',
      name: 'Terms & Conditions',
      path: '/terms-and-conditions',
      icon: <FileText className="w-4 h-4 shrink-0" />
    },
    {
      id: 'refund',
      name: 'Refund & Cancellation',
      path: '/refund-policy',
      icon: <RefreshCw className="w-4 h-4 shrink-0" />
    },
    {
      id: 'shipping',
      name: 'Shipping & Delivery',
      path: '/shipping-policy',
      icon: <Truck className="w-4 h-4 shrink-0" />
    },
    {
      id: 'disclaimer',
      name: 'Disclaimer',
      path: '/disclaimer',
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />
    }
  ];

  return (
    <>
      <SEO
        title={`${title} - Skilldotpy Legal Hub`}
        description={
          description ||
          `Official ${title} for Skilldotpy. Compliant with Digital Personal Data Protection Act (DPDP Act, 2023), IT Act 2000, and Razorpay e-learning payment terms.`
        }
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Legal & Policies', url: '/privacy-policy' },
          { name: title, url: '#' }
        ]}
      />

      <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Breadcrumb Bar */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Legal Policies</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-semibold">{title}</span>
          </nav>

          {/* Header Banner */}
          <header className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/60 via-indigo-50/30 to-transparent rounded-bl-full pointer-events-none -mr-16 -mt-16" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide uppercase mb-4">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>{badge}</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
              
              <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
                {description ||
                  `Transparency, trust, and student data protection are fundamental to Skilldotpy. Please review the official legal policy below.`}
              </p>

              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Effective Date: <strong>October 2026</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Last Reviewed: <strong>{currentDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Applicable Law: <strong>Republic of India</strong></span>
                </div>
              </div>
            </div>
          </header>

          {/* Legal Navigation Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 p-1.5 mb-8 shadow-2xs overflow-x-auto scrollbar-thin">
            <div className="flex items-center gap-1 min-w-max">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Policy Content Container */}
          <main className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-12">
            <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700">
              {children}
            </article>

            {/* Statutory Grievance & Contact Block */}
            <section aria-labelledby="statutory-grievance-heading" className="mt-12 pt-8 border-t border-slate-200">
              <div className="bg-slate-50 rounded-xl p-6 sm:p-8 border border-slate-200/80">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h2 id="statutory-grievance-heading" className="text-lg font-bold text-slate-900 m-0">
                      Grievance Redressal & Statutory Inquiries
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed m-0">
                      Under the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules</strong>, students and Data Principals can address concerns, request data correction/erasure, or report grievances directly to our appointed officer:
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-2">
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block text-xs font-semibold uppercase">Designated Officer</span>
                        <strong className="text-slate-900 text-sm">{siteConfig.teacher.name}</strong>
                        <span className="text-slate-500 block text-xs mt-0.5">Grievance &amp; Data Protection Officer</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block text-xs font-semibold uppercase">Official Contact Email</span>
                        <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 font-semibold underline break-all">
                          {siteConfig.links.email}
                        </a>
                        <span className="text-slate-500 block text-xs mt-0.5">Turnaround: Acknowledgement in 24–48 hrs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Quick Cross-Link Footer */}
          <footer className="mt-8 text-center text-xs text-slate-500">
            <p>
              Looking for related policies?{' '}
              <Link to="/terms-and-conditions" className="text-blue-600 underline font-medium hover:text-blue-800">Terms of Use</Link> •{' '}
              <Link to="/refund-policy" className="text-blue-600 underline font-medium hover:text-blue-800">Refund Policy</Link> •{' '}
              <Link to="/shipping-policy" className="text-blue-600 underline font-medium hover:text-blue-800">Shipping Policy</Link> •{' '}
              <Link to="/disclaimer" className="text-blue-600 underline font-medium hover:text-blue-800">Disclaimer</Link> •{' '}
              <Link to="/contact" className="text-blue-600 underline font-medium hover:text-blue-800">Student Support</Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

/**
 * Privacy Policy Page - Fully Compliant with the Digital Personal Data Protection Act, 2023 (DPDP Act)
 */
export function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="Detailed notice on how Skilldotpy collects, processes, protects, and handles your digital personal data in strict compliance with the Digital Personal Data Protection Act (DPDP Act, 2023) and Indian Cyber Laws."
      activeTab="privacy"
      badge="DPDP Act, 2023 (Act No. 22 of 2023) Compliant"
    >
      {/* Student Highlights Card */}
      <div className="not-prose bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200/80 rounded-xl p-5 sm:p-6 mb-8 text-slate-800">
        <h2 className="text-base font-bold text-blue-900 flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>DPDP Act 2023 Summary for Students (At a Glance)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="flex items-start gap-2 bg-white/80 p-3 rounded-lg border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Zero Advertising Tracking:</strong> We never sell, rent, or trade your personal data to ad brokers or data aggregators.
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/80 p-3 rounded-lg border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Strict Purpose Limitation:</strong> Your data is used exclusively for exam prep, mock scoring, and batch access.
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/80 p-3 rounded-lg border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Right to be Forgotten:</strong> You can access, correct, or request permanent deletion of your profile anytime.
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white/80 p-3 rounded-lg border border-blue-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Encrypted Payments:</strong> All fees are securely processed via Razorpay. We never store debit/credit card CVVs.
            </div>
          </div>
        </div>
      </div>

      <h2>1. Legislative Framework &amp; Statutory Preamble</h2>
      <p>
        Welcome to <strong>{siteConfig.name}</strong> (accessible at <a href={siteConfig.url}>{siteConfig.url}</a>). This Privacy Policy is formulated, published, and executed in strict compliance with the provisions of:
      </p>
      <ul>
        <li><strong>The Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot; / &quot;DPDPA 2023&quot;)</strong>, Act No. 22 of 2023, enacted by the Parliament of the Republic of India;</li>
        <li><strong>The Information Technology Act, 2000 (&quot;IT Act&quot;)</strong> and amendments thereto;</li>
        <li><strong>The Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (&quot;SPDI Rules&quot;)</strong>; and</li>
        <li><strong>The Consumer Protection (E-Commerce) Rules, 2020</strong> as applicable to online digital education and e-learning platforms.</li>
      </ul>
      <p>
        For the purposes of this Privacy Policy, <strong>Skilldotpy</strong> operates as the <strong>&quot;Data Fiduciary&quot;</strong> (the entity determining the purpose and means of processing personal data), and you (the student, candidate, parent/guardian, or site visitor) are designated as the <strong>&quot;Data Principal&quot;</strong> under the DPDPA 2023.
      </p>

      <h2>2. Identity of the Data Fiduciary</h2>
      <p>
        Personal data processed via this website is governed by:
      </p>
      <ul>
        <li><strong>Data Fiduciary Name:</strong> Skilldotpy Education</li>
        <li><strong>Founder &amp; Principal Mentor:</strong> {siteConfig.teacher.name}</li>
        <li><strong>Official Website:</strong> <a href={siteConfig.url}>{siteConfig.url}</a></li>
        <li><strong>Official Electronic Mail:</strong> <a href={`mailto:${siteConfig.links.email}`}>{siteConfig.links.email}</a></li>
        <li><strong>Operational Jurisdiction:</strong> Uttar Pradesh, India</li>
      </ul>

      <h2>3. Lawful Basis for Processing &amp; Consent Architecture (Sections 4, 5 &amp; 6 DPDPA)</h2>
      <p>
        In accordance with <strong>Section 4, Section 5, and Section 6 of the DPDP Act, 2023</strong>, Skilldotpy processes personal data solely under the following lawful grounds:
      </p>
      <ol>
        <li>
          <strong>Free, Specific, Informed, Unconditional, and Unambiguous Consent:</strong> By registering an account, purchasing a paid video batch, submitting inquiries, or attempting interactive online mock tests, you provide explicit consent to the processing of your personal data for the designated educational purpose.
        </li>
        <li>
          <strong>Certain Legitimate Uses (Section 7):</strong> Processing strictly necessary for fulfilling voluntary inquiries, providing exam receipts, preventing fraud, maintaining cybersecurity, or complying with statutory judicial and tax orders.
        </li>
        <li>
          <strong>Right to Withdraw Consent (Section 6(4)):</strong> You hold the statutory right to withdraw your consent at any time with equal ease. Upon receipt of a withdrawal notice, processing for that specific purpose will cease within statutory timelines, subject to data retention required by Indian tax or accounting laws.
        </li>
      </ol>

      <h2>4. Categories of Digital Personal Data Collected</h2>
      <p>
        We restrict our data collection strictly to what is necessary, adequate, and relevant for delivering computer education, NIELIT exam coaching, and secure transactions:
      </p>
      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="p-3 border border-slate-200">Category</th>
              <th className="p-3 border border-slate-200">Data Points Collected</th>
              <th className="p-3 border border-slate-200">Lawful Purpose &amp; Justification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            <tr>
              <td className="p-3 font-semibold text-slate-900 border border-slate-200">Student Profile &amp; Contact</td>
              <td className="p-3 border border-slate-200">Full Name, Email Address, Mobile / WhatsApp Number</td>
              <td className="p-3 border border-slate-200">Account login credentials, batch activation, transaction confirmations, doubt clearing.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-900 border border-slate-200">Academic &amp; Assessment Records</td>
              <td className="p-3 border border-slate-200">Selected Module (M1, M2, M3, M4, CCC), Mock Test Scores, Time Spent, Bookmarks, IDE Code Runs</td>
              <td className="p-3 border border-slate-200">Delivering interactive CBT scoring, grade calculation, and customized study performance feedback.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-900 border border-slate-200">Financial &amp; Transaction Details</td>
              <td className="p-3 border border-slate-200">Razorpay Payment ID, Order ID, Transaction Status, Timestamp, Billing Name</td>
              <td className="p-3 border border-slate-200">Payment verification and invoicing. <em>(Note: We never collect or store debit/credit card CVV or netbanking passwords).</em></td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-900 border border-slate-200">Technical &amp; Log Telemetry</td>
              <td className="p-3 border border-slate-200">IP Address, Browser Type, Device Operating System, HTTP Referrers, Error Logs</td>
              <td className="p-3 border border-slate-200">Platform security, rate limiting, DDoS defense, and ensuring mobile/desktop layout responsiveness.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>5. Specific Purposes of Processing (Purpose Limitation)</h2>
      <p>Skilldotpy processes personal data solely for the following explicit purposes:</p>
      <ul>
        <li>Provisioning instant access to enrolled NIELIT O Level and CCC masterclasses, notes, and study packs;</li>
        <li>Generating objective mock test reports, timer tracking, and answer explanations;</li>
        <li>Communicating critical examination schedule updates, admit card notifications, and syllabus revisions;</li>
        <li>Responding to student support tickets and academic queries via email or WhatsApp;</li>
        <li>Ensuring platform integrity, verifying genuine purchases, and preventing unauthorized account sharing or intellectual property scraping; and</li>
        <li>Complying with applicable Indian commercial, tax, and cyber regulations.</li>
      </ul>

      <h2>6. Statutory Rights of Data Principals (Sections 11, 12, 13 &amp; 14 DPDPA)</h2>
      <p>
        As a Data Principal under the DPDP Act, 2023, you are endowed with enforceable statutory rights:
      </p>
      <ul>
        <li>
          <strong>Right to Access Information (Section 11):</strong> You have the right to obtain from Skilldotpy a summary of your personal data being processed, a list of third-party processors with whom such data has been shared, and any other relevant details regarding our processing activities.
        </li>
        <li>
          <strong>Right to Correction &amp; Updation (Section 12(1)):</strong> You have the right to request the correction of inaccurate or misleading data, the completion of incomplete data, or the updating of personal information (such as email or mobile number).
        </li>
        <li>
          <strong>Right to Erasure (&quot;Right to be Forgotten&quot;, Section 12(2)):</strong> You have the right to request the permanent erasure of your personal data when the purpose for which it was collected is no longer served or upon withdrawal of consent, unless retention is required by Indian law.
        </li>
        <li>
          <strong>Right of Grievance Redressal (Section 13):</strong> You have the right to readily accessible grievance redressal provided by Skilldotpy regarding any act or omission regarding personal data obligations.
        </li>
        <li>
          <strong>Right to Nominate (Section 14):</strong> You have the right to nominate any individual who shall, in the event of your death or incapacity, exercise the rights of the Data Principal on your behalf.
        </li>
      </ul>
      <p>
        To exercise any of these rights, simply email our designated Grievance Officer at <a href={`mailto:${siteConfig.links.email}`}>{siteConfig.links.email}</a> with the subject line <em>&quot;DPDPA Data Rights Request&quot;</em>. We will process your verified request free of charge within 15 working days.
      </p>

      <h2>7. Special Protections for Children &amp; Minors (Section 9 DPDPA)</h2>
      <p>
        Under <strong>Section 9 of the DPDP Act, 2023</strong>, an individual who has not completed 18 years of age is defined as a child:
      </p>
      <ul>
        <li><strong>Parental / Guardian Consent:</strong> Any student under the age of 18 preparing for NIELIT or CCC examinations must use our platform under the supervision and with the verifiable consent of a parent or lawful guardian.</li>
        <li><strong>Strict Ban on Behavioral Tracking:</strong> Skilldotpy strictly adheres to Section 9(2) and does <strong>NOT</strong> undertake tracking, behavioral monitoring, or profiling of children.</li>
        <li><strong>No Targeted Advertising:</strong> We do not direct targeted advertising to children under any circumstances.</li>
        <li><strong>Child Well-Being Safeguard:</strong> We do not process any digital personal data that is likely to cause any detrimental effect on the well-being of a child.</li>
      </ul>

      <h2>8. Reasonable Security Safeguards &amp; Data Breach Protocols (Section 8 DPDPA)</h2>
      <p>
        In accordance with <strong>Section 8(5) of the DPDP Act, 2023</strong> and the <strong>SPDI Rules, 2011</strong>, Skilldotpy maintains robust technical, physical, and organizational security measures:
      </p>
      <ul>
        <li><strong>256-Bit TLS Encryption:</strong> All data transmitted between your browser and our servers is encrypted using modern TLS 1.3 protocol.</li>
        <li><strong>Secure Cloud Infrastructure:</strong> Database records are hosted on ISO/IEC 27001, SOC 2 certified cloud infrastructure with role-based access control (RBAC).</li>
        <li><strong>Zero Sensitive Card Storage:</strong> Payment card details are never stored on Skilldotpy servers; all transactions are routed through Razorpay&apos;s PCI-DSS Level 1 compliant vault.</li>
        <li><strong>Statutory Breach Notification (Section 8(6)):</strong> In the unlikely event of a personal data breach impacting student records, Skilldotpy will promptly notify the <strong>Data Protection Board of India (DPBI)</strong> and the affected Data Principals in the prescribed form and manner.</li>
      </ul>

      <h2>9. Data Retention &amp; Purpose Fulfillment (Section 8(7) DPDPA)</h2>
      <p>
        Skilldotpy retains your digital personal data only for as long as your account remains active or as required to fulfill the educational purpose for which it was obtained.
      </p>
      <p>
        When you request account deletion or when the educational retention period lapses, your personal identifiers are either securely purged from production databases or irreversibly anonymized for aggregated statistical analysis, except where retention is strictly mandated by Indian taxation, audit, or statutory legal obligations.
      </p>

      <h2>10. Third-Party Data Processors &amp; Cross-Border Transfers</h2>
      <p>
        To provide seamless digital education, we engage trusted third-party service providers (Data Processors) bound by strict confidentiality and data protection obligations:
      </p>
      <ul>
        <li><strong>Payment Processing:</strong> Razorpay Software Private Limited (RBI-authorized payment aggregator, India).</li>
        <li><strong>Authentication &amp; Storage:</strong> Google Cloud / Firebase (Authentication, security, and cloud storage).</li>
        <li><strong>Video Delivery:</strong> YouTube (Embedded video player for free lecture playback).</li>
      </ul>
      <p>
        Personal data of Indian students is primarily processed within Indian data centers in full compliance with Central Government data localization directives.
      </p>

      <h2>11. Cookies, Web Storage &amp; Distraction-Free Educational Policy</h2>
      <p>
        Skilldotpy is built to provide an ad-free, focused learning environment:
      </p>
      <ul>
        <li>We use essential cookies and browser local storage strictly to remember your login session, mock test countdown state, bookmarked chapters, and dark/light UI preference.</li>
        <li>We do <strong>NOT</strong> display intrusive third-party pop-up advertisements, commercial banners, or sponsored ad network trackers on our study portals.</li>
        <li>You may adjust your browser settings to decline cookies; however, certain interactive features (such as persistent test sessions) may not function as intended.</li>
      </ul>

      <h2>12. Designated Grievance Redressal Officer (Mandatory DPDPA &amp; IT Rules)</h2>
      <p>
        In compliance with <strong>Section 13 of the DPDP Act, 2023</strong> and <strong>Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules</strong>, the contact details of our appointed Grievance Officer are:
      </p>
      <div className="not-prose my-6 bg-slate-50 border border-slate-300/80 rounded-xl p-6 text-slate-800 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Designation</span>
            <p className="font-bold text-slate-900 mt-0.5">Grievance Redressal &amp; Data Protection Officer</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Officer Name</span>
            <p className="font-bold text-slate-900 mt-0.5">{siteConfig.teacher.name}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Official Email</span>
            <p className="mt-0.5">
              <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 font-semibold underline">
                {siteConfig.links.email}
              </a>
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Helpline / WhatsApp</span>
            <p className="font-bold text-emerald-700 mt-0.5">+91 {siteConfig.links.whatsapp}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Postal Jurisdiction</span>
            <p className="text-slate-700 mt-0.5">Skilldotpy Education, Uttar Pradesh, India</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1">
          <p>• <strong>Turnaround Guarantee:</strong> Grievance acknowledgment within 24 to 48 hours; full resolution within 15 working days.</p>
          <p>• <strong>Escalation Mechanism:</strong> If you are dissatisfied with our resolution, you hold the statutory right to escalate your complaint to the <strong>Data Protection Board of India (DPBI)</strong> in accordance with Section 13(3) of the DPDP Act, 2023.</p>
        </div>
      </div>

      <h2>13. Periodic Policy Updates &amp; Notifications</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect amendments in the DPDP Rules, judicial interpretations, or platform features. When changes are made, the &quot;Last Reviewed&quot; date at the top of this policy will be revised. We encourage students and parents to periodically review this page to stay informed of our data protection practices.
      </p>
    </LegalLayout>
  );
}

/**
 * Terms and Conditions Page
 */
export function Terms() {
  return (
    <LegalLayout
      title="Terms and Conditions"
      description="Official terms of use governing access, enrollment, payments, and intellectual property on Skilldotpy's e-learning website and study portals."
      activeTab="terms"
      badge="Student Terms of Service &amp; Usage License"
    >
      <h2>1. Acceptance of Terms &amp; Eligibility</h2>
      <p>
        By accessing or using the <strong>{siteConfig.name}</strong> website (<a href={siteConfig.url}>{siteConfig.url}</a>), interactive CBT mock test engines, notes readers, or paid video batches, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions.
      </p>
      <p>
        If you are under 18 years of age, you represent that you are accessing the platform with the knowledge, consent, and supervision of your parent or legal guardian in accordance with the Digital Personal Data Protection Act, 2023.
      </p>

      <h2>2. Educational Nature &amp; Limited Use License</h2>
      <p>
        Permission is granted to view, read, and temporarily download one copy of downloadable study resources (such as free PDF notes, syllabus breakdowns, and sample question papers) solely for your personal, non-commercial examination preparation. Under this license, you may NOT:
      </p>
      <ul>
        <li>Modify, copy, distribute, or publicly display course lecture videos, premium notes, or question banks for any commercial purpose;</li>
        <li>Attempt to decompile, reverse-engineer, scrape, or extract source code from any software or code runner on {siteConfig.name};</li>
        <li>Remove any copyright, watermark, or proprietary notices from any PDF or video material; or</li>
        <li>Mirror, re-host, or resell course credentials, mock test questions, or project files on any external server, Telegram channel, or digital repository.</li>
      </ul>

      <h2>3. Digital Course Access &amp; Account Responsibility</h2>
      <p>
        Upon successful payment verification through Razorpay, course access is provisioned digitally to your registered account. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Account sharing among multiple users is strictly prohibited and may result in immediate access revocation without refund.
      </p>

      <h2>4. Intellectual Property Rights</h2>
      <p>
        All educational content, chapter notes, video explanations, interactive CBT software, branding, logos, and UI designs featured on {siteConfig.name} are the proprietary intellectual property of <strong>Er. Aditya Pathak</strong> and {siteConfig.name}, protected under the Indian Copyright Act, 1957, and relevant international intellectual property treaties.
      </p>

      <h2>5. Pricing, Razorpay Payments &amp; Taxes</h2>
      <p>
        All course fees displayed on the website are in Indian Rupees (INR) and are inclusive of applicable taxes unless specified otherwise. Payments are securely processed via Razorpay. We do not store financial card data or netbanking credentials.
      </p>

      <h2>6. Termination of Access</h2>
      <p>
        Skilldotpy reserves the right to suspend or terminate your access to the website or enrolled courses immediately, without prior notice, if you breach any provision of these Terms or engage in unlawful or abusive conduct toward mentors or fellow students.
      </p>

      <h2>7. Governing Law &amp; Jurisdiction</h2>
      <p>
        These Terms and Conditions shall be governed by and construed in accordance with the laws of the <strong>Republic of India</strong>. Any dispute, claim, or controversy arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Uttar Pradesh, India</strong>.
      </p>
    </LegalLayout>
  );
}

/**
 * Educational Disclaimer Page
 */
export function Disclaimer() {
  return (
    <LegalLayout
      title="Disclaimer"
      description="Important regulatory disclosures regarding Skilldotpy's independent educational status and absence of official affiliation with NIELIT or government bodies."
      activeTab="disclaimer"
      badge="Educational Notice &amp; Trademark Clarification"
    >
      <h2>1. Educational &amp; Informational Purposes Only</h2>
      <p>
        The study notes, mock tests, video masterclasses, practical coding exercises, and examination tips provided on the <strong>{siteConfig.name}</strong> website and official YouTube channel are created strictly for <strong>educational, informational, and self-study purposes</strong>.
      </p>
      <p>
        While we make every reasonable effort to keep the syllabus breakdowns, notes, and question banks accurate and updated in alignment with NIELIT&apos;s latest R5.1 curriculum, {siteConfig.name} makes no warranties or representations of any kind, express or implied, regarding the absolute completeness, accuracy, or suitability of the content.
      </p>

      <h2>2. Independent Status (Not Affiliated with NIELIT)</h2>
      <p className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg text-amber-950 font-medium">
        <strong>Important Notice:</strong> <strong>Skilldotpy</strong> is an <strong>independent, privately managed educational coaching platform</strong> founded by <strong>Er. Aditya Pathak</strong>. We are <strong>NOT</strong> officially affiliated with, endorsed by, sponsored by, or connected to the <strong>National Institute of Electronics and Information Technology (NIELIT)</strong>, the <strong>Ministry of Electronics and Information Technology (MeitY)</strong>, or any government department.
      </p>
      <p className="mt-4">
        &quot;O Level&quot;, &quot;CCC&quot;, &quot;BCC&quot;, and related exam titles are registered certifications conducted independently by NIELIT. Official examination dates, registration forms, admit cards, and results must always be cross-verified directly on NIELIT&apos;s official student portal (<a href="https://student.nielit.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">student.nielit.gov.in</a>).
      </p>

      <h2>3. No Guarantee of Examination Results</h2>
      <p>
        While our study materials, cheat sheets, and mock tests are designed to maximize your exam preparation and concept clarity, {siteConfig.name} <strong>does not guarantee that any student will pass any examination, achieve a specific grade (S, A, B, C, D), or secure employment</strong>. Success in examinations depends entirely on individual dedication, study hours, practical coding practice, and personal aptitude.
      </p>

      <h2>4. External Links &amp; Third-Party Services</h2>
      <p>
        Our website may contain links to external websites (such as NIELIT portals, Python official documentation, or YouTube). We do not control or endorse the content, policies, or practices of any external third-party sites.
      </p>
    </LegalLayout>
  );
}

/**
 * Refund and Cancellation Policy Page
 */
export function RefundPolicy() {
  return (
    <LegalLayout
      title="Refund &amp; Cancellation Policy"
      description="Transparent policy regarding instant digital course access, cancellation rights, and refund exceptions in compliance with Razorpay e-learning guidelines."
      activeTab="refund"
      badge="Instant Digital Delivery &amp; Razorpay Compliant"
    >
      <h2>1. Instant Digital Delivery &amp; All-Sales-Final Policy</h2>
      <p>
        <strong>{siteConfig.name}</strong> provides digital educational services, including paid video masterclasses, downloadable PDF chapter notes, and interactive CBT mock test series. Delivery of access credentials and course resources is <strong>instant and automated</strong> upon successful payment confirmation through our payment gateway (Razorpay).
      </p>
      <p>
        Due to the immediate access and digital nature of these downloadable materials, <strong>all course enrollments are generally considered final and non-refundable</strong> once access to the curriculum or study resources has been activated.
      </p>

      <h2>2. Exceptional Circumstances for Refund Consideration</h2>
      <p>
        We value our students and understand that unforeseen technical glitches can occur. A refund may be considered under the following specific circumstances, subject to verification:
      </p>
      <ul>
        <li>
          <strong>Duplicate Payment:</strong> If your bank account or UPI was charged multiple times for the same course transaction due to a network timeout or payment gateway error.
        </li>
        <li>
          <strong>Technical Non-Delivery:</strong> If a technical issue on Skilldotpy prevents you from accessing the enrolled course content, and our dedicated technical support team is unable to resolve the issue within <strong>7 business days</strong> of you reporting it.
        </li>
      </ul>

      <h2>3. Non-Eligible Refund Scenarios</h2>
      <p>Refunds will <strong>NOT</strong> be granted in the following cases:</p>
      <ul>
        <li>Change of mind after accessing or viewing lecture videos and downloading PDF notes;</li>
        <li>Lack of compatible hardware or internet connectivity (standard requirements: any modern browser on mobile, tablet, or PC);</li>
        <li>Failure to clear a NIELIT examination or mismatch with personal study schedules; or</li>
        <li>Account suspension resulting from a violation of our Terms of Service (e.g., unauthorized sharing or pirating of study materials).</li>
      </ul>

      <h2>4. Step-by-Step Refund Application Process</h2>
      <p>If you believe you qualify under our exceptional refund criteria:</p>
      <ol>
        <li>
          Send an email to <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 font-bold underline">{siteConfig.links.email}</a> within <strong>3 calendar days</strong> of the transaction timestamp.
        </li>
        <li>Include your <strong>Razorpay Payment ID</strong> (e.g., <code>pay_xxxxxx</code>), registered email, student name, and a clear screenshot of the duplicate deduction or error.</li>
        <li>Our administrative team will review and verify your request within <strong>2 business days</strong>.</li>
        <li>Upon approval, the refund amount will be credited back to your original source of payment (UPI, card, or netbanking) within <strong>5 to 7 working days</strong>, as per standard banking settlement cycles.</li>
      </ol>
    </LegalLayout>
  );
}

export default PrivacyPolicy;
