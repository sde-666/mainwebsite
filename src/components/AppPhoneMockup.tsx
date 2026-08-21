import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Play, 
  GraduationCap, 
  User, 
  Home as HomeIcon, 
  Moon, 
  Bell, 
  Volume2, 
  Code, 
  Monitor, 
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { siteConfig } from '../data/config';

interface AppPhoneMockupProps {
  className?: string;
  showBadges?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AppPhoneMockup({ 
  className = '', 
  showBadges = true,
  size = 'md' 
}: AppPhoneMockupProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrcIndex, setImageSrcIndex] = useState(0);

  const candidateImages = [
    '/app-screenshots/photo_3.jpg',
    '/app-screenshots/photo_3.svg',
    '/app-screenshots/photo_3_2026-08-16_21-37-13.jpg'
  ];

  const handleNextImageSource = () => {
    if (imageSrcIndex < candidateImages.length - 1) {
      setImageSrcIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={`relative mx-auto flex flex-col items-center select-none ${className}`}>
      
      {/* Ambient Glow behind phone */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-amber-500/20 rounded-[50px] blur-2xl -z-10 opacity-75" />

      {/* Floating Badges */}
      {showBadges && (
        <>
          <div className="absolute -top-3 -left-3 sm:-left-6 z-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-lg border border-blue-400/40 flex items-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Live App Dashboard</span>
          </div>

          <div className="absolute -bottom-3 -right-3 sm:-right-6 z-20 bg-slate-900/90 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-lg border border-slate-700/80 flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-amber-400 font-bold">4.9 ★</span>
            <span className="text-slate-400">({siteConfig.app.downloads})</span>
          </div>
        </>
      )}

      {/* Smartphone Outer Titanium Frame */}
      <div className="w-[270px] xs:w-[290px] sm:w-[310px] md:w-[330px] max-w-full rounded-[38px] sm:rounded-[44px] p-2.5 sm:p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[3px] sm:border-[4px] border-slate-600/60 ring-1 ring-white/20 transition-transform duration-300 hover:scale-[1.02]">
        
        {/* Inner Screen Bezel */}
        <div className="relative w-full rounded-[34px] overflow-hidden bg-slate-950 border border-slate-900 shadow-inner aspect-[9/19.5]">
          
          {/* Top Notch Speaker & Camera Punch Hole */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-2 pointer-events-none">
            {/* Time */}
            <span className="text-[11px] font-bold text-white tracking-tight">9:33</span>
            
            {/* Center Pill / Camera */}
            <div className="w-16 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 border border-slate-800/80">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-900/80" />
              </div>
              <div className="w-4 h-1 rounded-full bg-slate-800" />
            </div>

            {/* Network & Battery Status Icons */}
            <div className="flex items-center gap-1 text-white text-[9px] font-bold">
              <span>VoLTE</span>
              <div className="w-3.5 h-2 rounded-2xs border border-white flex items-center p-0.5">
                <div className="w-full h-full bg-white rounded-3xs" />
              </div>
            </div>
          </div>

          {/* Screen Content: Photo Image with Multi-Tier Fallback to Interactive UI */}
          {!imageError ? (
            <img
              src={candidateImages[imageSrcIndex]}
              alt="Skilldotpy Official Android App Dashboard"
              onError={handleNextImageSource}
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
          ) : (
            /* High-Fidelity Exact Reproduction of photo_3.jpg */
            <div className="w-full h-full bg-slate-50 flex flex-col justify-between overflow-y-auto text-left pt-6 pb-2 select-none">
              
              {/* Header Gradient */}
              <div className="bg-gradient-to-b from-[#183bb5] via-[#245fe8] to-[#4338ca] text-white p-4 pt-3 rounded-b-3xl shadow-md">
                
                {/* Brand row & Icons */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-white">
                      Skill<span className="text-red-500">.</span><span className="text-rose-300 font-serif">py</span>
                    </h3>
                    <p className="text-[10px] italic text-blue-100/90 font-serif -mt-0.5">
                      Just learn skills...
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white">
                      <Moon className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* User Greeting */}
                <div className="flex items-center gap-2.5 mt-3.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                    A
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-100 block">Good Evening 👋</span>
                    <span className="text-xs font-bold text-white">Aditya Pathak</span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mt-3.5 bg-white rounded-full px-3 py-2 flex items-center gap-2 shadow-sm text-slate-400">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] text-slate-400 truncate">Search Courses, Chapters or Notes...</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                
                {/* Announcement Card */}
                <div className="bg-sky-100 rounded-2xl p-3 shadow-2xs border border-sky-200/80 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <span className="bg-blue-700 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                      ANNOUNCEMENT
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900">Skilldotpy</h4>
                    <p className="text-[10px] text-slate-600 leading-tight">
                      Access 100% chapter-wise notes, handwritten PDFs, and HD video
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Volume2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Continue Learning */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 mb-1.5">Continue Learning</h4>
                  <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold font-mono text-xs">
                        <Code className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">Python Programming</h5>
                        <p className="text-[10px] text-slate-500">Pick up where you left off</p>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Play className="w-3 h-3 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Featured Courses */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-extrabold text-slate-900">Featured Courses</h4>
                    <span className="text-[10px] font-bold text-blue-600">View All</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* CCC Course */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                      <div className="h-14 bg-gradient-to-r from-teal-950 to-emerald-950 p-1.5 flex items-start justify-between relative">
                        <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                          <Monitor className="w-3 h-3" /> 3 Ch
                        </span>
                        <span className="text-[9px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-full">
                          ₹99
                        </span>
                      </div>
                      <div className="p-2">
                        <h5 className="text-[11px] font-bold text-slate-900 truncate">CCC (Computer Concepts)</h5>
                        <p className="text-[9px] text-slate-500 line-clamp-1">Master Govt CCC exam...</p>
                      </div>
                    </div>

                    {/* LibreOffice Course */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs opacity-90">
                      <div className="h-14 bg-gradient-to-r from-slate-900 to-blue-950 p-1.5 flex items-start justify-between">
                        <span className="text-[9px] text-blue-300 font-mono font-bold">5 Ch</span>
                        <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full">
                          ₹149
                        </span>
                      </div>
                      <div className="p-2">
                        <h5 className="text-[11px] font-bold text-slate-900 truncate">LibreOffice Suite</h5>
                        <p className="text-[9px] text-slate-500 line-clamp-1">Writer, Calc, Impress</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Nav Bar */}
              <div className="bg-white/95 border-t border-slate-200 px-4 py-2 flex items-center justify-around text-slate-500">
                <div className="flex flex-col items-center text-indigo-950">
                  <div className="p-1 rounded-full bg-indigo-100">
                    <HomeIcon className="w-4 h-4 text-indigo-950 fill-indigo-950" />
                  </div>
                  <span className="text-[9px] font-bold mt-0.5">Home</span>
                </div>
                <div className="flex flex-col items-center">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-[9px] font-medium mt-0.5">Courses</span>
                </div>
                <div className="flex flex-col items-center">
                  <User className="w-4 h-4" />
                  <span className="text-[9px] font-medium mt-0.5">Profile</span>
                </div>
              </div>

            </div>
          )}

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-400/60 rounded-full z-30 pointer-events-none" />

          {/* Gloss overlay reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

        </div>
      </div>

    </div>
  );
}
