import { SEO } from '../components/SEO';
import { Button } from '../components/Button';
import { siteConfig } from '../data/config';
import { Mail, Youtube, MapPin } from 'lucide-react';

export function Contact() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Skilldotpy Support',
    description: 'Get in touch with Skilldotpy for student support, NIELIT examination advice, or technical assistance with the Android app.',
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'Skilldotpy',
      email: siteConfig.links.email,
      url: siteConfig.url
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us - Student Support & Inquiries" 
        description="Get in touch with the Skilldotpy student support team for guidance related to NIELIT O Level, CCC courses, PDF downloads, and the Android App." 
        keywords={[
          'Contact Skilldotpy',
          'Skilldotpy support email',
          'Skilldotpy helpdesk',
          'NIELIT teacher contact'
        ]}
        schema={contactSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact' }
        ]}
      />
      
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-xl text-gray-600">
            We're here to help. Reach out to us if you have any questions or need support.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Whether you have a question about our NIELIT courses, need help installing the Android app, or want to report an issue, our team is ready to assist you.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email Support</h3>
                  <p className="text-gray-600 mt-1">
                    <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 hover:underline">{siteConfig.links.email}</a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">We aim to reply within 24-48 hours.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <Youtube className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">YouTube Community</h3>
                  <p className="text-gray-600 mt-1">
                    <a href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Skilldotpy on YouTube</a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Join our community and ask questions in the comments.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            {/* Note: This is a static form. It requires a backend or form service (like Formspree) to function. */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="name" className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select id="subject" className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border bg-white">
                  <option>Course Inquiry</option>
                  <option>App Installation Issue</option>
                  <option>Payment/Refund</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" rows={4} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border" placeholder="How can we help you?"></textarea>
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
              <p className="text-xs text-center text-gray-500 mt-4">
                This is a demo form. Please email us directly at {siteConfig.links.email} for actual support.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
