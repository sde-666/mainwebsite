import { useState } from 'react';
import { SEO } from '../components/SEO';
import { Button } from '../components/Button';
import { siteConfig } from '../data/config';
import { Mail, Youtube, CheckCircle2, MessageCircle } from 'lucide-react';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Course Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Direct mailto link preparation
    const mailtoUrl = `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(
      `[${subject}] Query from ${name}`
    )}&body=${encodeURIComponent(
      `Student Name: ${name}\nStudent Email: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    )}`;

    window.open(mailtoUrl, '_blank');
    setSubmitted(true);
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Skilldotpy Support',
    description: 'Get in touch with Skilldotpy for student support, NIELIT examination advice, course enrollment queries, or technical assistance.',
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
        title="Contact Student Support" 
        description="Contact Skilldotpy student support for guidance on NIELIT O Level & CCC exam prep, free PDF notes downloads, mock tests, and paid batch access." 
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
              Whether you have a question about our NIELIT courses, need help accessing study materials, or want to report an issue, our team is ready to assist you.
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
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">WhatsApp Support</h3>
                  <p className="text-gray-600 mt-1">
                    <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold hover:underline">
                      Chat with Sir on WhatsApp (+91 93355 21389)
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Fastest response for course & exam queries.</p>
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
            
            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">Thank You!</h3>
                <p className="text-sm text-emerald-800">
                  Your message has been initiated. If your mail client did not open automatically, you can email us directly at{' '}
                  <a href={`mailto:${siteConfig.links.email}`} className="font-bold underline">
                    {siteConfig.links.email}
                  </a>{' '}
                  or message us on WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border bg-white"
                  >
                    <option>Course Inquiry</option>
                    <option>Website / Portal Access Issue</option>
                    <option>Notes Download Query</option>
                    <option>Payment/Refund</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 border"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
                <p className="text-xs text-center text-gray-500 mt-4">
                  For urgent inquiries, reach out directly at{' '}
                  <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 font-semibold underline">
                    {siteConfig.links.email}
                  </a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
