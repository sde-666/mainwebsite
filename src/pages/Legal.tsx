import { SEO } from '../components/SEO';
import { siteConfig } from '../data/config';

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <>
      <SEO title={title} />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
        <div className="prose prose-blue max-w-none text-gray-700">
          {children}
        </div>
      </div>
    </>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-sm text-slate-500 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <h2>1. Introduction</h2>
      <p>Welcome to <strong>{siteConfig.name}</strong> (available at {siteConfig.url}). We respect your privacy and are committed to protecting your personal information. This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit our website, use our web tools, or access our educational services, and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
      
      <h2>2. Information We Collect</h2>
      <p>We may collect several types of information from and about users of our website, including:</p>
      <ul>
        <li><strong>Personal Identifiers:</strong> Name, email address ({siteConfig.links.email}), or account login details when voluntarily provided (e.g., when signing in, submitting contact inquiries, or accessing premium resources).</li>
        <li><strong>Technical & Log Data:</strong> Internet Protocol (IP) addresses, browser types, Internet Service Providers (ISP), operating system, date/time stamps, referring/exit pages, and number of clicks. This data is not linked to personally identifiable information and is used for trend analysis and site administration.</li>
        <li><strong>Study & Progress Data:</strong> Mock test scores, calculator records, and saved chapter bookmarks stored locally on your device or in our secure database.</li>
      </ul>

      <h2>3. Google AdSense & Third-Party Advertising (Mandatory Disclosure)</h2>
      <p>We use third-party advertising companies, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website. These companies may use cookies and web beacons to collect information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
      <ul>
        <li><strong>DoubleClick DART Cookies:</strong> Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.</li>
        <li><strong>User Opt-Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Google Ads Settings</a> or through the Network Advertising Initiative opt-out page at <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">www.aboutads.info</a>.</li>
      </ul>

      <h2>4. Cookies and Web Beacons</h2>
      <p>Like any other website, {siteConfig.name} uses "cookies". These cookies are used to store information including visitors' preferences, study progress, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

      <h2>5. Third-Party Privacy Policies</h2>
      <p>{siteConfig.name}'s Privacy Policy does not apply to other advertisers or websites. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers (such as Google AdSense, Firebase, or YouTube) for more detailed information, including their practices and instructions about how to opt-out of certain options.</p>

      <h2>6. Children's Information (COPPA Compliance)</h2>
      <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. {siteConfig.name} does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>

      <h2>7. Consent & Updates</h2>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms. We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes.</p>

      <h2>8. Contact Us</h2>
      <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 font-semibold underline">{siteConfig.links.email}</a>.</p>
    </LegalLayout>
  );
}

export function Terms() {
  return (
    <LegalLayout title="Terms and Conditions">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing this Website and the {siteConfig.name} App, you are agreeing to be bound by these Website and App Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>
      
      <h2>2. Use License</h2>
      <p>Permission is granted to temporarily download one copy of the materials (information or software) on {siteConfig.name}'s Website and App for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
      <ul>
        <li>modify or copy the materials;</li>
        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
        <li>attempt to decompile or reverse engineer any software contained on {siteConfig.name}'s Website or App;</li>
        <li>remove any copyright or other proprietary notations from the materials; or</li>
        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
      </ul>

      <h2>3. Disclaimer</h2>
      <p>All the materials on {siteConfig.name}'s Website and App are provided "as is". {siteConfig.name} makes no warranties, may it be expressed or implied, therefore negates all other warranties.</p>

      <h2>4. Limitations</h2>
      <p>In no event shall {siteConfig.name} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on {siteConfig.name}'s Website or App.</p>
    </LegalLayout>
  );
}

export function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>Educational Purposes Only</h2>
      <p>The information and materials contained on the {siteConfig.name} website, YouTube channel, and Android application are for educational and informational purposes only. We strive to provide accurate and up-to-date information regarding NIELIT courses, programming, and computer education, but we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website.</p>
      
      <h2>Not Affiliated with NIELIT</h2>
      <p>{siteConfig.name} is an independent educational platform. We are NOT officially affiliated with, endorsed by, or connected to the National Institute of Electronics & Information Technology (NIELIT) or any other government agency. "O Level" and "CCC" are courses conducted by NIELIT, and our content serves only as supplementary study material.</p>

      <h2>No Guarantee of Results</h2>
      <p>While our courses and materials are designed to help you prepare for exams and build skills, {siteConfig.name} does not guarantee that you will pass any specific examination, secure employment, or achieve specific results by using our materials. Your success depends entirely on your own effort, dedication, and background.</p>
    </LegalLayout>
  );
}

export function RefundPolicy() {
  return (
    <LegalLayout title="Refund Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>1. Digital Products</h2>
      <p>Due to the nature of digital products and online courses, all sales are considered final once the course content has been accessed or downloaded. We generally do not offer refunds for digital products.</p>
      
      <h2>2. Exceptions</h2>
      <p>Refunds may be considered under the following circumstances, purely at the discretion of {siteConfig.name}:</p>
      <ul>
        <li>Duplicate payment made by mistake.</li>
        <li>Technical issues preventing access to the course content that our support team is unable to resolve within 7 working days.</li>
      </ul>

      <h2>3. Requesting a Refund</h2>
      <p>If you believe you qualify for a refund under our exceptions, please contact us at {siteConfig.links.email} within 3 days of your purchase. Please include your transaction details, the email address used for the purchase, and a detailed explanation of the issue.</p>
    </LegalLayout>
  );
}
