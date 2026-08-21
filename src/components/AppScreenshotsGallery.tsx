import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Play, 
  Pause,
  Layers,
  BookOpen,
  HelpCircle,
  Award,
  Home,
  KeyRound
} from 'lucide-react';
import { appScreenshots, AppScreenshotItem } from '../data/appScreenshots';

// Individual Image Component with Multi-Level Fallback & Error Handling
export function ScreenshotImage({ 
  screen, 
  className = '' 
}: { 
  screen: AppScreenshotItem; 
  className?: string 
}) {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  // Ordered list of candidate image sources
  const candidateSources = [
    screen.imagePath,
    ...screen.alternatePaths
  ];

  const handleImageError = () => {
    if (currentSrcIndex < candidateSources.length - 1) {
      setCurrentSrcIndex((prev) => prev + 1);
    } else {
      setAllFailed(true);
    }
  };

  const getScreenIcon = (id: string) => {
    switch (id) {
      case 'splash-screen': return <Sparkles className="w-8 h-8 text-amber-300" />;
      case 'auth-screen': return <KeyRound className="w-8 h-8 text-blue-300" />;
      case 'home-dashboard': return <Home className="w-8 h-8 text-emerald-300" />;
      case 'course-syllabus': return <BookOpen className="w-8 h-8 text-cyan-300" />;
      case 'cbt-quiz': return <HelpCircle className="w-8 h-8 text-purple-300" />;
      case 'test-result': return <Award className="w-8 h-8 text-amber-300" />;
      default: return <Layers className="w-8 h-8 text-white" />;
    }
  };

  if (allFailed) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-between p-5 text-white text-center select-none">
        <div className="pt-2">
          <span className="text-[10px] font-extrabold bg-blue-600/80 px-2.5 py-1 rounded-full text-white">
            {screen.screenDetails.badge}
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center shadow-lg">
            {getScreenIcon(screen.id)}
          </div>
          <h4 className="text-sm font-extrabold text-white leading-tight">
            {screen.title}
          </h4>
          <p className="text-[10px] text-slate-300 line-clamp-2 px-2">
            {screen.subtitle}
          </p>
        </div>

        <div className="pb-3 w-full">
          <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-[9px] text-blue-200">
            📸 {screen.imageFileName}
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={candidateSources[currentSrcIndex]}
      alt={screen.title}
      onError={handleImageError}
      className={`w-full h-full object-cover object-top select-none ${className}`}
      loading="lazy"
      draggable={false}
    />
  );
}

// Phone Bezel Frame Wrapper
export function PhoneFrameCard({ 
  screen, 
  onSelect 
}: { 
  screen: AppScreenshotItem; 
  onSelect?: () => void 
}) {
  return (
    <div 
      onClick={onSelect}
      className="group relative cursor-pointer flex-shrink-0 w-[240px] sm:w-[260px] md:w-[275px] transition-transform duration-300 hover:-translate-y-2"
    >
      {/* Outer Smartphone Frame */}
      <div className="aspect-[9/19] bg-slate-900 rounded-[2.8rem] p-2.5 sm:p-3 shadow-xl border-4 border-slate-800 relative overflow-hidden flex flex-col ring-1 ring-white/10 group-hover:shadow-2xl group-hover:border-blue-600/60 transition-all">
        
        {/* Top Status & Speaker bar */}
        <div className="flex items-center justify-between px-3 pt-0.5 pb-1 text-[9px] font-medium text-slate-400 z-10 select-none">
          <span>9:33</span>
          <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          </div>
          <div className="flex items-center gap-1 text-[8px]">
            <span>5G</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Screen Area */}
        <div className="flex-1 rounded-[2rem] overflow-hidden relative bg-slate-950 flex flex-col">
          <ScreenshotImage screen={screen} />

          {/* Hover Overlay with Zoom Icon */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs">
            <span className="p-3 rounded-full bg-white/20 text-white backdrop-blur-md shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <Maximize2 className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="pt-1.5 pb-0.5 flex justify-center z-10">
          <div className="w-20 h-1 bg-slate-600/60 rounded-full"></div>
        </div>
      </div>

      {/* Screen Title & Category under the phone */}
      <div className="text-center pt-3 space-y-0.5 px-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
          Screen #{screen.number}
        </span>
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {screen.title}
        </h4>
        <p className="text-[11px] text-slate-500 line-clamp-1">
          {screen.subtitle}
        </p>
      </div>
    </div>
  );
}

export function AppScreenshotsGallery() {
  const [selectedScreen, setSelectedScreen] = useState<AppScreenshotItem | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);

  // Continuous Auto Scroll Logic
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 0.85; // Pixels per frame for smooth marquee effect

    const step = () => {
      if (isAutoScrolling && !isHoveredRef.current && container) {
        container.scrollLeft += speed;
        // If reached end, seamlessly loop back to start
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoScrolling]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Mobile Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore the Inside Experience of Skilldotpy App
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Automatic live showcase of the student dashboard, chapter lectures, notes downloads, and CBT mock exam simulation.
          </p>
        </div>

        {/* Scroll Controls & Play/Pause */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isAutoScrolling 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title={isAutoScrolling ? 'Pause Auto-Scroll' : 'Resume Auto-Scroll'}
          >
            {isAutoScrolling ? (
              <>
                <Pause className="w-3.5 h-3.5 text-blue-600" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto Scroll</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleManualScroll('left')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => handleManualScroll('right')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Auto-Scrolling Continuous Carousel */}
      <div 
        className="relative overflow-hidden py-4 -my-4"
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        onTouchStart={() => { isHoveredRef.current = true; }}
        onTouchEnd={() => { isHoveredRef.current = false; }}
      >
        {/* Soft edge fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth px-4 py-2 cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Render 2 sets of screenshots for continuous seamless loop */}
          {[...appScreenshots, ...appScreenshots].map((screen, idx) => (
            <PhoneFrameCard
              key={`${screen.id}-${idx}`}
              screen={screen}
              onSelect={() => setSelectedScreen(screen)}
            />
          ))}
        </div>
      </div>

      {/* Helper caption */}
      <div className="text-center text-xs text-slate-500">
        💡 Hover or touch any phone card to pause scrolling • Click to expand full screen
      </div>

      {/* Lightbox Fullscreen Detail Modal */}
      {selectedScreen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
          onClick={() => setSelectedScreen(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white my-6 grid grid-cols-1 md:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedScreen(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Phone Bezel View */}
            <div className="md:col-span-6 bg-slate-950 p-6 flex items-center justify-center">
              <div className="w-[260px] sm:w-[280px]">
                <div className="aspect-[9/19] bg-slate-900 rounded-[2.8rem] p-3 shadow-2xl border-4 border-slate-800 relative overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-3 pt-0.5 pb-1 text-[9px] text-slate-400 select-none">
                    <span>9:33</span>
                    <div className="w-3 h-3 rounded-full bg-black border border-slate-700"></div>
                    <span>5G 🔋</span>
                  </div>
                  <div className="flex-1 rounded-[2rem] overflow-hidden relative bg-slate-950 flex flex-col">
                    <ScreenshotImage screen={selectedScreen} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Screen Details & Key Features */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full">
                    {selectedScreen.screenDetails.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Screen #{selectedScreen.number} of {appScreenshots.length}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {selectedScreen.title}
                  </h3>
                  {selectedScreen.hindiTitle && (
                    <p className="text-xs sm:text-sm font-semibold text-blue-400">
                      {selectedScreen.hindiTitle}
                    </p>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedScreen.description}
                </p>

                {/* Features list */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Features in this screen:
                  </h4>
                  <div className="space-y-1.5">
                    {selectedScreen.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const prevIndex = (selectedScreen.number - 2 + appScreenshots.length) % appScreenshots.length;
                    setSelectedScreen(appScreenshots[prevIndex]);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextIndex = selectedScreen.number % appScreenshots.length;
                    setSelectedScreen(appScreenshots[nextIndex]);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Next Screen →
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
