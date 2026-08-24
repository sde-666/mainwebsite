import { SEO } from '../components/SEO';
import { BrandLogo } from '../components/BrandLogo';
import { NielitLogo } from '../components/NielitLogo';
import { siteConfig } from '../data/config';
import { BookOpen, Target, Users, MonitorPlay, Smartphone, CheckCircle } from 'lucide-react';

export function About() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Skilldotpy - India\'s NIELIT & Programming Hub',
    description: 'Learn about Skilldotpy, founded by Mr. Aditya Pathak, dedicated to high-quality NIELIT O Level (R5.1), CCC exam preparation, and Python programming education across India.',
    mainEntity: {
      '@type': 'EducationalOrganization',
      name: 'Skilldotpy',
      url: siteConfig.url,
      founder: {
        '@type': 'Person',
        name: siteConfig.teacher.name,
        jobTitle: siteConfig.teacher.role,
        description: siteConfig.teacher.bio
      }
    }
  };

  return (
    <>
      <SEO 
        title="About Us - Founder Aditya Pathak" 
        description="Learn about Skilldotpy, our mission, and founder Er. Aditya Pathak. Empowering over 50,000+ students across India for NIELIT O Level & CCC exams."
        keywords={[
          'About Skilldotpy',
          'Skilldotpy founder',
          'Er. Aditya Pathak',
          'Aditya Pathak NIELIT',
          'Skilldotpy mission',
          'Skilldotpy YouTube team'
        ]}
        schema={aboutSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Skilldotpy', url: '/about' }
        ]}
      />
      
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-white p-2 rounded-2xl shadow-xl">
              <img src="/skilldotpy-logo.svg" alt="Skilldotpy" className="w-16 h-16 object-contain" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-center">
              <NielitLogo size="md" className="h-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Skilldotpy</h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Skilldotpy is India's dedicated educational platform offering targeted preparation for NIELIT courses (O Level R5.1 and CCC), programming languages (Python, HTML, CSS, JavaScript), and practical office suites (LibreOffice & MS Office).
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                Our mission is to simplify computer education and make it accessible to everyone. We believe that with the right guidance, structured materials, and practical tutorials, anyone can master technology and succeed in their careers.
              </p>
              <p className="text-lg text-gray-700">
                Through our Android app, YouTube channel, and website, we provide a unified learning experience that connects free resources with premium, structured learning paths.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                 <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                 <h3 className="font-bold text-gray-900">Focused Learning</h3>
                 <p className="text-sm text-gray-600 mt-2">Structured specifically for exam success and practical skill-building.</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                 <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                 <h3 className="font-bold text-gray-900">Student First</h3>
                 <p className="text-sm text-gray-600 mt-2">Content designed based on student feedback and requirements.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">The Skilldotpy Ecosystem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MonitorPlay className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">YouTube Channel</h3>
              <p className="text-gray-600">Free video lectures, tutorials, and practical demonstrations available to everyone.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Android App</h3>
              <p className="text-gray-600">The core of our platform offering an integrated experience with notes, tests, and premium courses.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free Resources</h3>
              <p className="text-gray-600">High-quality PDFs, notes, and study guides available via our website and app.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
