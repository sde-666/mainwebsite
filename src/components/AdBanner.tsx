import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ExternalLink, Smartphone, Youtube, BookOpen, MessageCircle, Award, Calculator, X, ChevronUp, ChevronDown } from 'lucide-react';
import { siteConfig } from '../data/config';

export interface AdBannerProps {
  slotId?: string;
  adClient?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'in-feed' | 'in-article' | 'sticky-bottom';
  className?: string;
  showLabel?: boolean;
  fallbackType?: 'app' | 'youtube' | 'notes' | 'telegram' | 'mock-test' | 'calculator' | 'general';
}

export function AdBanner({
  slotId = '1234567890',
  adClient,
  format = 'auto',
  className = '',
  showLabel = true,
  fallbackType = 'general',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [isStickyDismissed, setIsStickyDismissed] = useState(false);
  const [isStickyMinimized, setIsStickyMinimized] = useState(false);

  const client = adClient || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADSENSE_CLIENT_ID) || 'ca-pub-9492300885622538';

  useEffect(() => {
    // If real AdSense client is configured
    if (client && typeof window !== 'undefined') {
      const scriptId = 'google-adsense-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        // @ts-ignore
        window.adsbygoogle = adsbygoogle;
        adsbygoogle.push({});
        setAdLoaded(true);
      } catch (e) {
        console.warn('AdSense push failed or blocked:', e);
        setAdError(true);
      }
    }
  }, [client, slotId]);

  if (format === 'sticky-bottom') {
    if (isStickyDismissed) return null;

    return (
      <aside 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl transition-all duration-300 ${
          isStickyMinimized ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
        } ${className}`}
        aria-label="Sponsored Learning Bottom Bar"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 sm:py-2">
          {/* Header Controls */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1 text-slate-500">
              <Sparkles className="w-3 h-3 text-amber-500" /> Sponsored Learning Bar
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStickyMinimized(!isStickyMinimized)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                title={isStickyMinimized ? 'Expand Bar' : 'Minimize Bar'}
              >
                {isStickyMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsStickyDismissed(true)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                title="Dismiss Bar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sticky Banner Content */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 truncate">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-slate-900 truncate leading-tight">
                  Skilldotpy Official Android App — Free CBT Mock Tests & Notes
                </h4>
                <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                  Score Grade S in NIELIT O Level & CCC with offline HD video classes & timed tests.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/app"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-all"
              >
                <span>Get App APK</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Dimension helpers to avoid Layout Shifts (CLS)
  const formatClasses = {
    auto: 'min-h-[90px] w-full',
    horizontal: 'min-h-[90px] w-full max-w-4xl mx-auto',
    rectangle: 'min-h-[250px] max-w-[336px] mx-auto',
    'in-feed': 'min-h-[110px] w-full',
    'in-article': 'min-h-[120px] w-full max-w-3xl mx-auto',
    'sticky-bottom': 'min-h-[50px] w-full',
  }[format];

  // If real AdSense publisher client is configured and active
  if (client && !adError) {
    return (
      <aside className={`my-4 text-center overflow-hidden select-none ${className}`} aria-label="Advertisement">
        {showLabel && (
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="h-px w-8 bg-slate-200"></span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Advertisement
            </span>
            <span className="h-px w-8 bg-slate-200"></span>
          </div>
        )}
        <div className={`flex justify-center items-center ${formatClasses}`}>
          <ins
            ref={adRef}
            className="adsbygoogle block"
            style={{ display: 'block' }}
            data-ad-client={client}
            data-ad-slot={slotId}
            data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
            data-full-width-responsive="true"
          />
        </div>
      </aside>
    );
  }

  // CLEAN FALLBACK EDUCATIONAL SPONSOR / HIGH-YIELD MONETIZATION CARD
  // When AdSense is pending approval or loading, this provides high-yield student conversions!
  return (
    <aside 
      className={`my-4 select-none rounded-2xl border transition-all ${
        format === 'rectangle' 
          ? 'p-4 max-w-sm mx-auto' 
          : format === 'in-feed'
          ? 'p-3.5 w-full'
          : 'p-3.5 sm:p-4 max-w-4xl mx-auto'
      } ${
        fallbackType === 'app'
          ? 'bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-white border-blue-200/90 text-slate-800'
          : fallbackType === 'youtube'
          ? 'bg-gradient-to-r from-rose-50/90 via-red-50/70 to-white border-rose-200/90 text-slate-800'
          : fallbackType === 'telegram'
          ? 'bg-gradient-to-r from-cyan-50/90 via-sky-50/70 to-white border-cyan-200/90 text-slate-800'
          : fallbackType === 'mock-test'
          ? 'bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-white border-emerald-200/90 text-slate-800'
          : fallbackType === 'calculator'
          ? 'bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-white border-amber-200/90 text-slate-800'
          : 'bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border-slate-200 text-slate-800'
      } ${className}`}
      aria-label="Sponsored Learning Resources"
    >
      {showLabel && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-500" /> Sponsored Learning
          </span>
          <span className="text-[9px] bg-slate-200/70 text-slate-600 px-1.5 py-0.2 rounded">Ad</span>
        </div>
      )}

      {/* Dynamic Content depending on placement */}
      {fallbackType === 'app' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Download Skilldotpy Official App
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Offline video lectures, 1000+ CBT MCQs with timer & instant grade analytics.
              </p>
            </div>
          </div>
          <a
            href="/app"
            className="shrink-0 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <span>Get Free APK</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : fallbackType === 'youtube' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Free Video Lectures on YouTube
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Full chapter playlists for M1-R5, M2-R5, Python (M3) & IoT (M4).
              </p>
            </div>
          </div>
          <a
            href={siteConfig.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <span>Watch Free</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : fallbackType === 'telegram' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Join NIELIT Study Discussion Group
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Daily quiz questions, latest exam date alerts & direct peer doubt clearing.
              </p>
            </div>
          </div>
          <a
            href={siteConfig.links.telegram || 'https://t.me/skilldotpy'}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <span>Join Telegram</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : fallbackType === 'mock-test' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                Take Free NIELIT CBT Mock Test
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Practice 100 timed MCQs with official NIELIT negative marking & instant grade scorecard.
              </p>
            </div>
          </div>
          <a
            href="/mock-test"
            className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <span>Start Free Test</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : fallbackType === 'calculator' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-black">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                NIELIT O Level Grade & Marks Calculator
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Calculate official 60% Theory + 40% Practical aggregate score & final diploma eligibility.
              </p>
            </div>
          </div>
          <a
            href="/o-level-calculator"
            className="shrink-0 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <span>Calculate Grade</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                NIELIT O Level & CCC Preparation Materials
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Chapter-wise syllabus revision notes, formulas, shortcut cheat-sheets & lab manuals.
              </p>
            </div>
          </div>
          <a
            href="/resources"
            className="shrink-0 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            <span>Download PDFs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </aside>
  );
}
