import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  Users, 
  Layers, 
  Sparkles, 
  FileText, 
  MessageCircle,
  Zap,
  ArrowRight,
  Play
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { siteConfig } from '../data/config';
import { AppScreenshotsGallery } from '../components/AppScreenshotsGallery';
import { InstallationVideoModal } from '../components/InstallationVideoModal';
import { AppPhoneMockup } from '../components/AppPhoneMockup';

export function AppPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.app.name,
    operatingSystem: 'Android 5.0 and higher',
    applicationCategory: 'EducationalApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1250'
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <SEO
        title="Download Skilldotpy Android App APK (Latest 2026) - NIELIT O Level & CCC"
        description="Download the official Skilldotpy Android App APK free for complete NIELIT O Level (M1, M2, M3, M4) & CCC preparation. Offline video lectures, online CBT mock tests, PDF notes & practical solutions by Er. Aditya Pathak."
        keywords={[
          'Skilldotpy app',
          'Skilldotpy apk download',
          'Skilldotpy app apk',
          'Skilldotpy Android application',
          'NIELIT O level android app',
          'CCC exam practice app download',
          'O level mock test app offline',
          'Skilldotpy APK latest version 2026'
        ]}
        schema={appSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Skilldotpy Android App', url: '/app' }
        ]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Main Hero Card */}
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Official Learning App for NIELIT Students
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Study Anywhere, Anytime with <span className="text-amber-400">Skilldotpy App</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unlock structured HD video classes for O Level (M1, M2, M3, M4) & CCC, chapter-wise test series with timer, downloadable offline notes, and direct teacher doubt support.
              </p>

              {/* Specs Badge */}
              <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Version</span>
                  <span className="font-bold text-white">{siteConfig.app.version.split(' ')[0]}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Size</span>
                  <span className="font-bold text-white">{siteConfig.app.size}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Rating</span>
                  <span className="font-bold text-amber-400">{siteConfig.app.rating} ★</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={siteConfig.app.apkUrl}
                  download="skilldotpy-latest.apk"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg text-xs transition-all"
                >
                  <Download className="w-4 h-4" /> Download Official APK ({siteConfig.app.size})
                </a>
                
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3.5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  <Play className="w-4 h-4 text-amber-300" />
                  Watch Video Guide (.mp4)
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Virus-Free & Safe • Verified for Android 5.0 and above</span>
              </div>
            </div>

            {/* Right: Phone Visual Mockup Showcase */}
            <div className="lg:col-span-5 flex items-center justify-center py-2 lg:py-0">
              <AppPhoneMockup showBadges={true} />
            </div>

          </div>
        </div>

        {/* 6 App Screenshots Interactive Continuous Scroller */}
        <div className="max-w-6xl mx-auto">
          <AppScreenshotsGallery />
        </div>

        {/* 6 Core App Advantages */}
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Why Students Prefer the Skilldotpy App
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Built specifically for serious candidates who want to clear NIELIT exams on their first attempt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">Real CBT Exam Interface</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Practice 100-question mock tests under identical 90-minute timed conditions with instantaneous scorecards and deep analytics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">Offline Study Mode</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Download HD video lectures and handwritten PDF notes inside the app to study seamlessly without internet or buffering.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">Teacher Doubt Clearing</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ask your coding and exam doubts directly to Er. Skilldotpy via the in-app student chat portal with fast replies.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Video Modal */}
      <InstallationVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
