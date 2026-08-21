import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Bot, 
  ChevronDown, 
  Laptop, 
  FileText, 
  Download, 
  Code, 
  Layers, 
  Cpu, 
  Globe, 
  Terminal,
  Award,
  CheckCircle2,
  Calculator,
  Home,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { siteConfig } from '../data/config';
import { BrandLogo } from './BrandLogo';
import { NielitLogo } from './NielitLogo';
import { useAuth } from '../context/AuthContext';
import { useAiAssistant } from '../context/AiAssistantContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { openAssistant } = useAiAssistant();

  // Listen for global custom events to open/toggle mobile menu (e.g. from bottom bar)
  useEffect(() => {
    const handleToggle = () => setIsMobileMenuOpen(prev => !prev);
    const handleOpen = () => setIsMobileMenuOpen(true);
    const handleClose = () => setIsMobileMenuOpen(false);
    window.addEventListener('toggle-mobile-menu', handleToggle);
    window.addEventListener('open-mobile-menu', handleOpen);
    window.addEventListener('close-mobile-menu', handleClose);
    return () => {
      window.removeEventListener('toggle-mobile-menu', handleToggle);
      window.removeEventListener('open-mobile-menu', handleOpen);
      window.removeEventListener('close-mobile-menu', handleClose);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleMouseEnter = (menuName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // 4 O Level Papers
  const oLevelPapers = [
    {
      code: 'M1-R5.1',
      title: 'IT Tools & Network Basics',
      href: '/o-level/m1-r5',
      icon: Layers,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      code: 'M2-R5.1',
      title: 'Web Designing & Publishing',
      href: '/o-level/m2-r5',
      icon: Globe,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      code: 'M3-R5.1',
      title: 'Programming through Python',
      href: '/o-level/m3-r5',
      icon: Terminal,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      code: 'M4-R5.1',
      title: 'Internet of Things (IoT)',
      href: '/o-level/m4-r5',
      icon: Cpu,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  // CCC Dropdown Items
  const cccItems = [
    {
      title: 'Syllabus & Marks Weightage',
      desc: '9 Chapters • 100 Marks CBT Exam Pattern',
      href: '/ccc#syllabus',
      icon: FileText,
    },
    {
      title: 'Chapter-Wise Notes',
      desc: 'LibreOffice, OS & Digital Financial Tools',
      href: '/notes/ccc',
      icon: Layers,
    },
    {
      title: '100 MCQ Practice Test',
      desc: 'Timed 90-minute real exam simulator',
      href: '/mock-test',
      icon: CheckCircle2,
    },
    {
      title: 'Study PDFs & Resources',
      desc: 'Free official syllabus & quick notes PDF',
      href: '/resources/ccc',
      icon: Download,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      
      {/* =========================================================================
          SLIM TOP ANNOUNCEMENT STRIP (Clean & Subtle)
         ========================================================================= */}
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded shadow-2xs shrink-0">
              <NielitLogo variant="full" size="xs" className="h-3.5" />
              <span className="text-[10px] font-extrabold text-[#003366] tracking-tight border-l border-slate-200 pl-1">
                R5.1 Official
              </span>
            </div>
            <span className="hidden sm:inline text-slate-300 text-[11px] truncate">
              NIELIT O Level & CCC Online Exam Portal by Skilldotpy
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <Link
              to="/app"
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Get Android App</span>
            </Link>

            <span className="text-slate-600 hidden sm:inline">|</span>

            <Link
              to="/admin"
              className="text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 text-[10px] transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Admin</span>
            </Link>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MAIN NAVIGATION BAR (Strictly Requested Tabs Only)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-15 items-center justify-between gap-3">
          
          {/* 1. Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 shrink-0 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-0.5"
            title="Skilldotpy - Home"
          >
            <BrandLogo variant="horizontal" size="md" />
          </Link>

          {/* 2. Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            
            {/* Tab 1: HOME */}
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${
                location.pathname === '/' 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              HOME
            </Link>

            {/* Tab 2: O LEVEL (Dropdown with 4 Papers) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('olevel')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/o-level"
                className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1 ${
                  location.pathname.startsWith('/o-level') || location.pathname.startsWith('/notes/m')
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>O Level</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'olevel' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </Link>

              {/* 4 Papers Dropdown */}
              {activeDropdown === 'olevel' && (
                <div className="absolute left-0 top-full pt-1.5 w-76 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-2 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                      <span>Select O Level Paper</span>
                      <Link to="/o-level" className="text-blue-600 hover:underline">All Papers →</Link>
                    </div>

                    {oLevelPapers.map((paper) => {
                      const Icon = paper.icon;
                      return (
                        <Link
                          key={paper.code}
                          to={paper.href}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className={`p-1.5 rounded-md border ${paper.color} shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-slate-900 group-hover:text-blue-600">{paper.code}</span>
                            </div>
                            <p className="text-[12px] font-semibold text-slate-600 truncate">{paper.title}</p>
                          </div>
                        </Link>
                      );
                    })}

                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <Link
                        to="/o-level-result-calculator"
                        className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/70 hover:bg-blue-100/80 text-blue-800 transition-colors group"
                      >
                        <div className="p-1.5 rounded-md bg-blue-600 text-white shrink-0 shadow-2xs">
                          <Calculator className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-black block">Result Calculator (60:40)</span>
                          <p className="text-[10px] text-blue-600 font-medium truncate">Check marks & grade status</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tab 3: CCC (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('ccc')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/ccc"
                className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1 ${
                  location.pathname.startsWith('/ccc') || location.pathname.startsWith('/notes/ccc')
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>CCC</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'ccc' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
              </Link>

              {/* CCC Dropdown */}
              {activeDropdown === 'ccc' && (
                <div className="absolute left-0 top-full pt-1.5 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-2 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                      <span>CCC (80 Hours)</span>
                      <Link to="/ccc" className="text-blue-600 hover:underline">Overview →</Link>
                    </div>

                    {cccItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.title}
                          to={item.href}
                          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div className="p-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[12px] font-bold text-slate-800 group-hover:text-amber-600 block">{item.title}</span>
                            <p className="text-[10px] text-slate-500 truncate">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tab 4: MCQ */}
            <Link
              to="/mock-test"
              className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${
                location.pathname.startsWith('/mock-test') 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              MCQ
            </Link>

            {/* Tab 5: Practical Lab */}
            <Link
              to="/practical-practice"
              className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${
                location.pathname.startsWith('/practical-practice') 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Practical Lab
            </Link>

          </nav>

          {/* 3. Action Buttons & Mobile Hamburger Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Tab 6: Ask AI Guru */}
            <button
              onClick={() => openAssistant()}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              title="Ask AI Guru Doubt Solver"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden xs:inline">Ask AI</span>
              <span className="hidden sm:inline">Guru</span>
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            </button>

            {/* Tab 7: Get App */}
            <Link
              to="/app"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 transition-all shadow-2xs active:scale-95 shrink-0"
              title="Download Android App"
            >
              <Smartphone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">App</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              id="mobile-nav-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0 cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* =========================================================================
          MOBILE SLIDE-OVER DRAWER (Rendered in Portal with Motion Spring Physics)
         ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[9999] lg:hidden flex justify-end overflow-hidden">
              
              {/* Backdrop Overlay with Smooth Fade */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Slide-out Panel (Spring slide from right) */}
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
                className="relative w-[85%] max-w-xs sm:max-w-sm bg-white h-full shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col justify-between overflow-y-auto z-10 select-none border-l border-slate-200"
              >
                
                {/* Drawer Header */}
                <div>
                  <div className="p-3.5 sm:p-4 border-b border-slate-200/90 flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/40">
                    <BrandLogo variant="horizontal" size="sm" />
                    <button
                      type="button"
                      id="mobile-nav-close-btn"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/80 transition-all active:scale-95 focus:outline-none cursor-pointer"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div className="p-3 sm:p-4 space-y-1">
                    
                    {/* 1. Home */}
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        location.pathname === '/' 
                          ? 'text-blue-700 bg-blue-50/80 shadow-2xs' 
                          : 'text-slate-800 hover:bg-slate-100 hover:text-blue-600'
                      }`}
                    >
                      <Home className="w-4 h-4 text-blue-600" />
                      <span>Home</span>
                    </Link>

                    {/* 2. O Level (Accordion with 4 Papers) */}
                    <div className="border-y border-slate-100 py-1 my-1">
                      <div className="flex items-center justify-between">
                        <Link
                          to="/o-level"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600"
                        >
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span>O Level (4 Papers)</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileExpanded(mobileExpanded === 'olevel' ? null : 'olevel')}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 mr-1 cursor-pointer"
                          aria-label="Toggle O Level papers"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === 'olevel' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                        </button>
                      </div>

                      {mobileExpanded === 'olevel' && (
                        <div className="pl-2.5 pr-2 py-1.5 space-y-1 bg-slate-50/90 rounded-xl mt-1 border border-slate-100">
                          {oLevelPapers.map((p) => {
                            const Icon = p.icon;
                            return (
                              <Link
                                key={p.code}
                                to={p.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white hover:text-blue-600 transition-colors shadow-2xs"
                              >
                                <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                                <div className="min-w-0">
                                  <span className="font-extrabold text-[11px] block text-slate-900">{p.code}</span>
                                  <span className="text-[10px] text-slate-600 truncate block">{p.title}</span>
                                </div>
                              </Link>
                            );
                          })}
                          <Link
                            to="/o-level-result-calculator"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-100/60 text-blue-800 text-xs font-bold hover:bg-blue-200/80 transition-colors"
                          >
                            <Calculator className="w-3.5 h-3.5 text-blue-600" />
                            <span>Result Calculator (60:40)</span>
                          </Link>
                          <Link
                            to="/o-level"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:underline"
                          >
                            All O Level Syllabus & Details →
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* 3. CCC (Accordion) */}
                    <div className="py-0.5">
                      <div className="flex items-center justify-between">
                        <Link
                          to="/ccc"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600"
                        >
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>CCC (80 Hours)</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileExpanded(mobileExpanded === 'ccc' ? null : 'ccc')}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 mr-1 cursor-pointer"
                          aria-label="Toggle CCC links"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === 'ccc' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                        </button>
                      </div>

                      {mobileExpanded === 'ccc' && (
                        <div className="pl-2.5 pr-2 py-1.5 space-y-1 bg-slate-50/90 rounded-xl mt-1 border border-slate-100">
                          {cccItems.map((item) => (
                            <Link
                              key={item.title}
                              to={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-white hover:text-amber-600 transition-colors shadow-2xs"
                            >
                              <span className="font-bold block text-slate-800 text-[11px]">{item.title}</span>
                              <span className="text-[10px] text-slate-500">{item.desc}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 4. Notes Reader */}
                    <Link
                      to="/notes"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        location.pathname.startsWith('/notes') 
                          ? 'text-blue-700 bg-blue-50/80 shadow-2xs' 
                          : 'text-slate-800 hover:bg-slate-100 hover:text-blue-600'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Chapter Notes</span>
                      </span>
                      <span className="text-[9px] bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    </Link>

                    {/* 5. MCQ Mock Tests */}
                    <Link
                      to="/mock-test"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        location.pathname.startsWith('/mock-test') 
                          ? 'text-blue-700 bg-blue-50/80 shadow-2xs' 
                          : 'text-slate-800 hover:bg-slate-100 hover:text-blue-600'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                        <span>MCQ Mock Tests</span>
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                        ONLINE CBT
                      </span>
                    </Link>

                    {/* 6. Practical Lab */}
                    <Link
                      to="/practical-practice"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        location.pathname.startsWith('/practical-practice') 
                          ? 'text-blue-700 bg-blue-50/80 shadow-2xs' 
                          : 'text-slate-800 hover:bg-slate-100 hover:text-blue-600'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Terminal className="w-4 h-4 text-cyan-600" />
                        <span>Practical Coding Lab</span>
                      </span>
                    </Link>

                    {/* 7. Resources & Downloads */}
                    <Link
                      to="/resources"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        location.pathname.startsWith('/resources') 
                          ? 'text-blue-700 bg-blue-50/80 shadow-2xs' 
                          : 'text-slate-800 hover:bg-slate-100 hover:text-blue-600'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Download className="w-4 h-4 text-blue-600" />
                        <span>Free Study PDFs</span>
                      </span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                        PDF
                      </span>
                    </Link>

                    {/* Admin Link if authorized */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 mt-2"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Admin CMS Dashboard</span>
                        </span>
                        <span>→</span>
                      </Link>
                    )}

                  </div>
                </div>

                {/* Mobile Footer Actions */}
                <div className="p-3 sm:p-4 border-t border-slate-200 space-y-2 bg-gradient-to-t from-slate-100 via-slate-50 to-white">
                  <button
                    type="button"
                    id="drawer-ask-guru-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAssistant();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-100/80 hover:bg-indigo-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
                  >
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span>Ask AI Guru (Doubt Solver)</span>
                  </button>

                  <Link
                    to="/app"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 transition-all active:scale-95 shadow-xs"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Download Skilldotpy App</span>
                  </Link>
                </div>

              </motion.div>

            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </header>
  );
}
