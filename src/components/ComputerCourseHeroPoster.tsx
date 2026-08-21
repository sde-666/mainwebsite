import React from 'react';
import { 
  Code2, 
  Terminal, 
  Globe, 
  Cpu, 
  GraduationCap, 
  Award, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Laptop,
  Check,
  Binary,
  Layers,
  Monitor
} from 'lucide-react';

export function ComputerCourseHeroPoster() {
  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-xl select-none py-3 sm:py-4 px-1 sm:px-4">
      {/* Dynamic Light/Cyan Ambient Background Glows */}
      <div className="absolute -top-4 -left-4 w-48 sm:w-60 h-48 sm:h-60 bg-blue-400/20 rounded-full blur-2xl sm:blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute -bottom-4 -right-4 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-400/20 rounded-full blur-2xl sm:blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1.2s' }}></div>

      {/* Floating 3D Badge 1: Top Right */}
      <div className="absolute -top-2 right-1 sm:-top-4 sm:-right-2 z-30 bg-white/95 border border-amber-300 text-slate-800 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-md flex items-center gap-1.5 sm:gap-2 animate-bounce" style={{ animationDuration: '3.8s' }}>
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-amber-100 flex items-center justify-center shadow-xs shrink-0">
          <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
        </div>
        <div>
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wide block leading-tight text-slate-900">Target Grade S</span>
          <span className="text-[8px] sm:text-[9px] text-amber-700 font-bold">NIELIT R5.1</span>
        </div>
      </div>

      {/* Floating 3D Badge 2: Bottom Left */}
      <div className="absolute -bottom-2 left-1 sm:-bottom-4 sm:-left-2 z-30 bg-white/95 border border-blue-200 text-slate-800 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-md flex items-center gap-1.5 sm:gap-2">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-blue-100 flex items-center justify-center shadow-xs shrink-0">
          <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
        </div>
        <div>
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wide block leading-tight text-slate-900">Live Coding Lab</span>
          <span className="text-[8px] sm:text-[9px] text-blue-700 font-bold">Python • Web • IoT</span>
        </div>
      </div>

      {/* 3D PERSPECTIVE WRAPPER (Tilted gently on mobile, full 3D on tablet/desktop) */}
      <div 
        className="transition-transform duration-500 hover:scale-[1.01]"
        style={{
          perspective: '1200px',
        }}
      >
        <div
          className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-100 via-white to-slate-200 border border-white/90 sm:border-2 p-2.5 sm:p-4 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.35),0_10px_15px_rgba(0,0,0,0.1)] transition-transform duration-300"
          style={{
            transform: typeof window !== 'undefined' && window.innerWidth < 640 
              ? 'rotateY(-3deg) rotateX(2deg)' 
              : 'rotateY(-10deg) rotateX(5deg) rotateZ(-1deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Glass Glare Reflection Overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none z-20"></div>

          {/* COMPUTER SCREEN DISPLAY (LIGHT THEME) */}
          <div className="relative rounded-2xl bg-white border border-slate-200 shadow-inner overflow-hidden">
            
            {/* Monitor Top Bezel (Silver / Clean Light Theme) */}
            <div className="bg-slate-100/95 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block shadow-2xs"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-2xs"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-2xs"></span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-0.5 rounded-full shadow-2xs">
                <Monitor className="w-3 h-3 text-blue-600" />
                <span className="font-mono">skilldotpy.com</span>
              </div>

              <div className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>ACTIVE</span>
              </div>
            </div>

            {/* SCREEN INNER POSTER CONTENT (Light, High-Contrast & Beautiful) */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-white via-slate-50 to-blue-50/60 relative overflow-hidden text-slate-800">
              
              {/* Subtle Tech Pattern Blueprint Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="light-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2563eb" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#light-grid)" />
              </svg>

              {/* Poster Heading */}
              <div className="text-center relative z-10 mb-3.5 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] sm:text-xs font-bold px-3 py-0.5 rounded-full mb-1.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>PREMIER COMPUTER EDUCATION</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  NIELIT <span className="text-blue-600">O Level & CCC</span> Masterclass
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  Theoretical Foundations • Practical Labs • Solved Question Banks
                </p>
              </div>

              {/* 4 Light-Themed Course Cards inside Screen */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 relative z-10">
                
                {/* M1: IT Tools */}
                <div className="bg-white border border-blue-200/90 rounded-xl p-2.5 shadow-xs hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Laptop className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">M1-R5</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">IT Tools & OS</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">LibreOffice Writer, Calc, Impress</p>
                </div>

                {/* M2: Web Design */}
                <div className="bg-white border border-emerald-200/90 rounded-xl p-2.5 shadow-xs hover:border-emerald-400 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">M2-R5</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Web Design</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">HTML5, CSS3, JavaScript, DOM</p>
                </div>

                {/* M3: Python */}
                <div className="bg-white border border-amber-200/90 rounded-xl p-2.5 shadow-xs hover:border-amber-400 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">M3-R5</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Python Coding</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Logic, Flowcharts, Loops & NumPy</p>
                </div>

                {/* M4: IoT */}
                <div className="bg-white border border-purple-200/90 rounded-xl p-2.5 shadow-xs hover:border-purple-400 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">M4-R5</span>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">IoT & Arduino</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Sensors, MQTT & Embedded C</p>
                </div>

              </div>

              {/* Bottom Feature Pill in Screen */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600 font-medium">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100 MCQs CBT + Practical Lab
                </span>
                <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                  CCC (80h) Included
                </span>
              </div>

            </div>

          </div>

          {/* 3D LAPTOP KEYBOARD DECK (Light Silver Metallic Aluminum) */}
          <div className="relative pt-2">
            {/* Display Hinge */}
            <div className="mx-auto w-32 sm:w-40 h-1.5 bg-slate-300 rounded-t-sm shadow-inner"></div>
            
            {/* Metallic Keyboard Deck */}
            <div className="w-full h-4 sm:h-5 rounded-b-2xl bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 border-x border-b border-slate-300/90 shadow-[0_15px_25px_rgba(0,0,0,0.25)] flex items-center justify-center">
              {/* Sleek Touchpad Notch */}
              <div className="w-20 sm:w-24 h-1 bg-slate-300/80 rounded-full border border-white/80"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
