import { Link } from 'react-router-dom';
import { Youtube, Mail, Smartphone, ExternalLink, ShieldCheck, Award, MessageCircle } from 'lucide-react';
import { siteConfig } from '../data/config';
import { BrandLogo } from './BrandLogo';
import { NielitLogo } from './NielitLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner inside footer */}
      <div className="border-b border-slate-800/80 bg-slate-950/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
                <img src="/skilldotpy-logo.svg" alt="Skilldotpy App" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">Study on the go with Skilldotpy Android App</h4>
                <p className="text-xs text-slate-400">Offline video player, chapter tests, practical source code & instant updates.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-lg shadow-blue-500/20 transition-colors"
              >
                <Smartphone className="w-4 h-4" /> Download Official APK (v{siteConfig.app.version.split(' ')[0]})
              </Link>
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-semibold px-4 py-2.5 rounded-lg text-xs transition-colors"
              >
                <Youtube className="w-4 h-4 text-red-500" /> Free YouTube Classes
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Educator Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <div className="bg-white/95 p-2 rounded-xl inline-block shadow-xs">
                <BrandLogo variant="horizontal" showTagline={true} />
              </div>
            </Link>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-sm">
              India&apos;s dedicated online teaching portal for <strong className="text-slate-200">NIELIT O Level (M1-R5 to M4-R5)</strong>, <strong className="text-slate-200">NIELIT CCC</strong>, Python programming, Web Development, and LibreOffice & MS Office suites.
            </p>

            {/* NIELIT curriculum badge */}
            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg shrink-0">
                <NielitLogo size="xs" className="h-5" />
              </div>
              <div className="text-[11px] leading-tight text-slate-300">
                <span className="font-bold text-white block">Official NIELIT R5.1 Syllabus</span>
                <span className="text-slate-400">Exam preparation for M1-R5, M2-R5, M3-R5, M4-R5 & CCC</span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <span className="font-semibold text-amber-400 block mb-0.5">Instructor: {siteConfig.teacher.name}</span>
              <span>{siteConfig.teacher.role} • {siteConfig.teacher.experience}</span>
            </div>

            <div className="mt-5 flex items-center space-x-4">
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-600/20 hover:text-red-400 flex items-center justify-center text-slate-400 transition-colors"
                title="YouTube Channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 flex items-center justify-center text-slate-400 transition-colors"
                title="Email Support"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* NIELIT O Level Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-400" /> NIELIT O Level
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/o-level#m1-r5" className="text-slate-400 hover:text-blue-400 transition-colors">
                  M1-R5: IT Tools & Network Basics
                </Link>
              </li>
              <li>
                <Link to="/o-level#m2-r5" className="text-slate-400 hover:text-blue-400 transition-colors">
                  M2-R5: Web Designing (HTML/CSS/JS)
                </Link>
              </li>
              <li>
                <Link to="/o-level#m3-r5" className="text-slate-400 hover:text-blue-400 transition-colors">
                  M3-R5: Python Programming
                </Link>
              </li>
              <li>
                <Link to="/o-level#m4-r5" className="text-slate-400 hover:text-blue-400 transition-colors">
                  M4-R5: IoT & Arduino Applications
                </Link>
              </li>
              <li>
                <Link to="/o-level#practicals" className="text-slate-400 hover:text-blue-400 transition-colors">
                  O Level Practical Exam Guide
                </Link>
              </li>
              <li>
                <Link to="/o-level#projects" className="text-slate-400 hover:text-blue-400 transition-colors">
                  O Level Project Submission Formats
                </Link>
              </li>
            </ul>
          </div>

          {/* CCC & Independent Courses */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Courses & Prep</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/ccc" className="text-slate-400 hover:text-blue-400 transition-colors font-medium text-amber-400">
                  NIELIT CCC Complete Hub
                </Link>
              </li>
              <li>
                <Link to="/courses?category=programming" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Python Programming Course
                </Link>
              </li>
              <li>
                <Link to="/courses?category=programming" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Web Development (HTML/CSS/JS)
                </Link>
              </li>
              <li>
                <Link to="/courses?category=office-suite" className="text-slate-400 hover:text-blue-400 transition-colors">
                  LibreOffice Suite (Writer, Calc, Impress)
                </Link>
              </li>
              <li>
                <Link to="/courses?category=office-suite" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Microsoft Office Pro (Word, Excel, PPT)
                </Link>
              </li>
              <li>
                <Link to="/mock-test" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Free Online CBT Mock Test
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Legal */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Free Study Hub</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/resources" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Download O Level Syllabus PDF
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Chapter-wise Free Notes PDF
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Solved Previous Year Papers
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Install Skilldotpy APK
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Control Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Privacy Policy & Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom copyright and NIELIT trademark disclaimer */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {currentYear} {siteConfig.name} ({siteConfig.url}). Created by <Link to="/founder" className="text-slate-400 hover:text-blue-400 transition-colors underline decoration-slate-700 hover:decoration-blue-400">{siteConfig.teacher.name}</Link>. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-lg">
            Disclaimer: Skilldotpy is an independent educational platform. NIELIT is a registered autonomous society under MeitY, Govt. of India. All study materials are created for examination preparation.
          </p>
        </div>
      </div>
    </footer>
  );
}
