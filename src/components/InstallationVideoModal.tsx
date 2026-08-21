import React, { useState, useRef } from 'react';
import { X, Play, Download, CheckCircle2, ShieldCheck, Film, ExternalLink } from 'lucide-react';
import { siteConfig } from '../data/config';

interface InstallationVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
}

export function InstallationVideoModal({
  isOpen,
  onClose,
  videoSrc = siteConfig.app.installVideoUrl
}: InstallationVideoModalProps) {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl text-white my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Skilldotpy APK Installation Video Guide
              </h3>
              <p className="text-[11px] text-slate-400">
                Step-by-step video instructions to install and start the app
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="bg-black aspect-video relative flex items-center justify-center overflow-hidden">
          {!videoError ? (
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              onError={() => setVideoError(true)}
            >
              <source src={videoSrc} type="video/mp4" />
              <source src="/how-to-install.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center p-8 max-w-md space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 mx-auto flex items-center justify-center">
                <Play className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Installation Video Tutorial</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Watch how to enable "Install Unknown Apps" in Android settings and launch your courses in 30 seconds.
              </p>
              <div className="pt-2">
                <a
                  href={siteConfig.app.apkUrl}
                  download="skilldotpy-latest.apk"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all"
                >
                  <Download className="w-4 h-4" /> Download Official APK Now
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Fast Summary & Action bar */}
        <div className="p-5 sm:p-6 bg-slate-900 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
              <span className="text-slate-300 text-[11px]">Download <strong className="text-white">skilldotpy-latest.apk</strong> file</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
              <span className="text-slate-300 text-[11px]">Tap <strong className="text-white">Settings &rarr; Allow from this source</strong></span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
              <span className="text-slate-300 text-[11px]">Tap <strong className="text-white">Install</strong> & register student profile</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Safe & Verified Official Android Build</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href={siteConfig.app.apkUrl}
                download="skilldotpy-latest.apk"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-md text-xs transition-all"
              >
                <Download className="w-4 h-4" /> Download APK ({siteConfig.app.size})
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
