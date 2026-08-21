import React, { useState } from 'react';
import { Download, Play, ShieldCheck, CheckCircle2, Smartphone, HelpCircle, Film, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Button } from '../components/Button';
import { siteConfig } from '../data/config';
import { InstallationVideoModal } from '../components/InstallationVideoModal';

export function AppInstall() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const steps = [
    {
      num: 1,
      title: 'Download the Official APK',
      hindi: 'आधिकारिक APK फ़ाइल डाउनलोड करें',
      desc: 'Tap "Download APK Now" to download skilldotpy-latest.apk to your Android phone (Android 5.0+).'
    },
    {
      num: 2,
      title: 'Allow Installation from Browser',
      hindi: 'ब्राउज़र से इंस्टॉलेशन की अनुमति दें',
      desc: 'When opening the downloaded file, tap "Settings" and enable the "Allow from this source" switch.'
    },
    {
      num: 3,
      title: 'Tap Install and Complete Setup',
      hindi: 'इंस्टॉल बटन दबाएं और ऐप खोलें',
      desc: 'Return to the installation prompt, tap "Install", and wait 5-10 seconds for the app to install.'
    },
    {
      num: 4,
      title: 'Launch & Start Learning',
      hindi: 'छात्र खाता बनाएं और पढ़ाई शुरू करें',
      desc: 'Open Skilldotpy, sign in with your email or 1-Tap Google, and access free notes & tests immediately.'
    }
  ];

  return (
    <>
      <SEO 
        title="How to Install Skilldotpy Android App APK - Step by Step Guide & Video" 
        description="Learn how to install the official Skilldotpy Android APK safely on your phone with our quick video guide and step-by-step instructions." 
      />
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-12 sm:py-16 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-xl mx-auto border border-amber-400/40 flex items-center justify-center">
            <img src="/skilldotpy-logo.svg" alt="Skilldotpy App" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
              Quick 1-Minute Setup Guide
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How to Install Skilldotpy App APK
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Follow these simple steps or watch the video guide to install the official Skilldotpy app on any Android device.
            </p>
          </div>

          {/* Action Buttons: Video Guide & APK Download */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg text-xs transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-amber-300" />
              Watch Video Installation Guide
            </button>

            <a
              href={siteConfig.app.apkUrl}
              download="skilldotpy-latest.apk"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg text-xs transition-all"
            >
              <Download className="w-4 h-4" />
              Download APK ({siteConfig.app.size})
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-400 pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Safe, Virus-Free & Verified for Android 5.0+</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-4xl space-y-12">
        
        {/* Video Banner Card */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border border-blue-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-black/30 px-2.5 py-1 rounded-md">
              <Film className="w-3.5 h-3.5" /> Video Tutorial Available
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">Need Help Installing?</h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-lg leading-relaxed">
              Click the button to watch our 30-second video explaining how to enable "Allow Unknown Sources" in Android settings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-xl text-xs transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 text-blue-600" /> Watch Installation Video
          </button>
        </div>

        {/* 4 Easy Step Cards */}
        <div className="space-y-4">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              4 Step Installation Process
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Simple and standard Android APK installation instructions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div 
                key={step.num}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {step.num}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Step {step.num} of 4
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-blue-600">
                    {step.hindi}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="p-6 sm:p-8 bg-blue-50 rounded-3xl border border-blue-100 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Ready to Start Preparing for NIELIT Exams?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Download the APK file now and unlock free handwritten PDF notes, previous year question papers, and CBT mock tests.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button to="/app" className="bg-blue-600 text-white text-xs">
              Explore All App Features
            </Button>
            <Button to="/faq" variant="outline" className="bg-white text-xs">
              Frequently Asked Questions
            </Button>
            <Button to="/o-level" variant="outline" className="bg-white text-xs">
              O Level Exam Syllabus
            </Button>
          </div>
        </div>

      </div>

      {/* Video Modal Component */}
      <InstallationVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </>
  );
}
