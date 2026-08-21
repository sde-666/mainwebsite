import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Smartphone, 
  Youtube, 
  Download, 
  Award, 
  Code, 
  Laptop, 
  Cpu, 
  FileCode2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Check, 
  Layers, 
  Flame, 
  ExternalLink,
  ShieldCheck,
  Star,
  Users,
  GraduationCap
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { BrandLogo } from '../components/BrandLogo';
import { NielitLogo } from '../components/NielitLogo';
import { siteConfig } from '../data/config';
import { AppPhoneMockup } from '../components/AppPhoneMockup';
import { ComputerCourseHeroPoster } from '../components/ComputerCourseHeroPoster';
import { oLevelModules, oLevelExamInfo } from '../data/oLevelData';
import { cccExamInfo, libreOfficeShortcutCheatSheet } from '../data/cccData';
import { courses } from '../data/courses';
import { resources } from '../data/resources';
import { quizQuestions } from '../data/quizData';
import { faqs } from '../data/faqs';
import { AdBanner } from '../components/AdBanner';

export function Home() {
  const [selectedModuleId, setSelectedModuleId] = useState('m1-r5');
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const selectedModule = oLevelModules.find(m => m.id === selectedModuleId) || oLevelModules[0];
  const quickQuiz = quizQuestions.slice(0, 5);

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    if (optionIndex === quickQuiz[activeQuizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (activeQuizIndex < quickQuiz.length - 1) {
      setActiveQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setActiveQuizIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
  };

  // Structured Data Schema for Home (Courses, FAQPage, and Knowledge Graph)
  const homeSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'NIELIT O Level Complete Certification Course (R5.1)',
      description: 'Comprehensive preparation for NIELIT O Level Modules: M1-R5 (IT Tools & Network Basics), M2-R5 (Web Designing & Publishing), M3-R5 (Python Programming), and M4-R5 (Internet of Things IoT).',
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Skilldotpy',
        sameAs: siteConfig.url
      },
      educationalCredentialAwarded: 'NIELIT O Level Certificate',
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'PT120H'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'NIELIT CCC (Course on Computer Concepts) Master Course',
      description: 'Official 80-hour syllabus coverage for NIELIT CCC exam including computer fundamentals, LibreOffice Writer, Calc, Impress, Internet, Cyber Security & Digital Financial Services.',
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Skilldotpy',
        sameAs: siteConfig.url
      },
      educationalCredentialAwarded: 'NIELIT CCC Certificate'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.slice(0, 6).map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO 
        title="Skilldotpy - NIELIT O Level & CCC Free Notes, Syllabus, Python & App"
        description="India's #1 learning platform for NIELIT O Level (M1-R5, M2-R5, M3-R5, M4-R5) & CCC exam preparation by Er. Aditya Pathak. Free PDF notes, CBT mock tests, Python tutorials, LibreOffice shortcuts & Android APK."
        keywords={[
          'Skilldotpy',
          'skilldotpy',
          'skill.py',
          'Skill.py',
          'Skill Dot Py',
          'NIELIT O Level free notes',
          'O Level syllabus 2026 pdf',
          'O level M1-R5 notes',
          'O level M2-R5 web design',
          'O level M3-R5 python notes in Hindi',
          'O level M4-R5 IoT',
          'CCC free notes pdf',
          'LibreOffice shortcuts',
          'Skilldotpy app download apk'
        ]}
        schema={homeSchemas}
        breadcrumbs={[{ name: 'Home', url: '/' }]}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white pt-10 pb-20 lg:pt-16 lg:pb-24">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Dual Brand & NIELIT Alignment Header */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="bg-white/95 px-3 py-1.5 rounded-xl inline-flex items-center gap-2 shadow-xs border border-white/20">
                  <img src="/skilldotpy-logo.svg" alt="Skilldotpy" className="h-6 w-6 object-contain" />
                  <span className="text-xs font-black text-slate-900 tracking-tight">Skill<span className="text-blue-500">.</span><span className="text-rose-500 font-serif">py</span></span>
                </div>

                <div className="bg-white px-3.5 py-1.5 rounded-xl inline-flex items-center gap-2.5 shadow-xs border border-white/30">
                  <NielitLogo variant="full" size="xs" className="h-5" />
                  <span className="text-xs font-black text-[#003366] tracking-tight border-l border-slate-200 pl-2">NIELIT R5.1 Aligned</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Crack NIELIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">O Level & CCC</span> with 100% Confidence
              </h1>

              <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Learn directly from your trusted computer teacher. Get comprehensive chapter-wise free PDF notes, syllabus breakdowns, solved previous papers, practical lab programs, and full video classes for <strong className="text-white">M1-R5, M2-R5, M3-R5 (Python) & M4-R5 (IoT)</strong>.
              </p>

              {/* Action Buttons (Compact & thumb-friendly on mobile) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                <Link
                  to="/app"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all text-xs sm:text-sm group"
                >
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <span>Download Skilldotpy App (APK)</span>
                </Link>

                <Link
                  to="/resources"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl transition-colors text-xs sm:text-sm"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  <span>Free Notes & Syllabus PDF</span>
                </Link>

                <a
                  href={siteConfig.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-semibold px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl transition-colors text-xs sm:text-sm"
                >
                  <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                  <span>YouTube Classes</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 sm:pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 sm:gap-4 text-center sm:text-left">
                <div>
                  <span className="block text-lg sm:text-2xl font-bold text-white">50,000+</span>
                  <span className="text-[10px] sm:text-xs text-slate-400">Students Taught</span>
                </div>
                <div>
                  <span className="block text-lg sm:text-2xl font-bold text-amber-400">Grade S & A</span>
                  <span className="text-[10px] sm:text-xs text-slate-400">High Success Rate</span>
                </div>
                <div>
                  <span className="block text-lg sm:text-2xl font-bold text-emerald-400">100% Free</span>
                  <span className="text-[10px] sm:text-xs text-slate-400">Basic Study Notes</span>
                </div>
              </div>
            </div>

            {/* Right Column: Graphic Computer / Laptop Poster Showcase */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <ComputerCourseHeroPoster />
            </div>

          </div>
        </div>
      </section>

      {/* OFFICIAL EXAM PREPARATION & ACCREDITATION STRIP */}
      <section className="bg-slate-100 border-b border-slate-200 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                <img src="/skilldotpy-logo.svg" alt="Skilldotpy Official Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Skilldotpy Educational Platform</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Official</span>
                </h4>
                <p className="text-xs text-slate-500">"Just learn skills..." — Structured computer science education & practical coding</p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                <NielitLogo size="sm" className="h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">NIELIT (R5.1) Exam Syllabus</h4>
                <p className="text-xs text-slate-500">M1-R5, M2-R5, M3-R5 (Python), M4-R5 (IoT) & CCC certified preparation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC SPONSOR PLACEMENT 1 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <AdBanner slotId="home-top-leaderboard" format="horizontal" fallbackType="app" />
      </div>

      {/* QUICK COURSE & STUDY GATEWAY (LearnNIELIT 5-Module Fast Hub) */}
      <section className="py-10 sm:py-14 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full">
              Quick Learning Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Select Your NIELIT Paper to Start Studying
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              Instant access to bilingual chapter notes, online CBT mock exams, practical lab compilers, and syllabus downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* 1. M1-R5 */}
            <div className="bg-gradient-to-b from-white to-blue-50/40 rounded-2xl border border-blue-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">M1-R5</span>
                  <span className="text-[10px] font-bold text-slate-500">Paper 1</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">IT Tools & Network Basics</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">LibreOffice Writer, Calc, Impress, OS & Digital Finance.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-100/80 space-y-1.5">
                <Link
                  to="/notes/m1-r5"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Chapter Notes</span>
                </Link>
                <div className="grid grid-cols-2 gap-1">
                  <Link
                    to="/mock-test"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-blue-700 bg-blue-100/70 hover:bg-blue-200/80 rounded-md transition-colors"
                  >
                    <span>CBT Test</span>
                  </Link>
                  <Link
                    to="/resources/m1-r5"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    <span>PDFs</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. M2-R5 */}
            <div className="bg-gradient-to-b from-white to-indigo-50/40 rounded-2xl border border-indigo-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">M2-R5</span>
                  <span className="text-[10px] font-bold text-slate-500">Paper 2</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Web Design & Publishing</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">HTML5, CSS3, JavaScript, W3.CSS & Photoshop.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-100/80 space-y-1.5">
                <Link
                  to="/notes/m2-r5"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Chapter Notes</span>
                </Link>
                <div className="grid grid-cols-2 gap-1">
                  <Link
                    to="/practical-practice/pr2-web-1"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-100/70 hover:bg-indigo-200/80 rounded-md transition-colors"
                  >
                    <span>Web IDE</span>
                  </Link>
                  <Link
                    to="/mock-test"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    <span>CBT Test</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. M3-R5 */}
            <div className="bg-gradient-to-b from-white to-emerald-50/40 rounded-2xl border border-emerald-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">M3-R5</span>
                  <span className="text-[10px] font-bold text-slate-500">Paper 3</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Python Programming</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">Algorithms, Flowcharts, Loops, Functions & NumPy.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-100/80 space-y-1.5">
                <Link
                  to="/notes/m3-r5"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Chapter Notes</span>
                </Link>
                <div className="grid grid-cols-2 gap-1">
                  <Link
                    to="/practical-practice/pr3-python-1"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/80 rounded-md transition-colors"
                  >
                    <span>Python IDE</span>
                  </Link>
                  <Link
                    to="/mock-test"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    <span>CBT Test</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 4. M4-R5 */}
            <div className="bg-gradient-to-b from-white to-purple-50/40 rounded-2xl border border-purple-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">M4-R5</span>
                  <span className="text-[10px] font-bold text-slate-500">Paper 4</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Internet of Things (IoT)</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">Sensors, Actuators, Arduino, Protocols & Security.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-100/80 space-y-1.5">
                <Link
                  to="/notes/m4-r5"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-2xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Chapter Notes</span>
                </Link>
                <div className="grid grid-cols-2 gap-1">
                  <Link
                    to="/mock-test"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-purple-700 bg-purple-100/70 hover:bg-purple-200/80 rounded-md transition-colors"
                  >
                    <span>CBT Test</span>
                  </Link>
                  <Link
                    to="/resources/m4-r5"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    <span>PDFs</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* 5. CCC */}
            <div className="bg-gradient-to-b from-white to-amber-50/40 rounded-2xl border border-amber-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between sm:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">CCC</span>
                  <span className="text-[10px] font-bold text-slate-500">80 Hours</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">Course on Computer Concepts</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">Computer Basics, Writer, Calc, Impress & Banking.</p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-100/80 space-y-1.5">
                <Link
                  to="/ccc"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>CCC Portal</span>
                </Link>
                <div className="grid grid-cols-2 gap-1">
                  <Link
                    to="/mock-test"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 hover:bg-amber-200/80 rounded-md transition-colors"
                  >
                    <span>100 MCQs</span>
                  </Link>
                  <Link
                    to="/resources/ccc"
                    className="flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    <span>PDFs</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW: PRACTICAL EXAM PRACTICE HIGHLIGHT (Python, Web, IoT Simulator) */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-10 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-3 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="bg-[#e65100] text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  New Feature
                </span>
                <span className="text-blue-300 text-xs font-semibold">
                  NIELIT R5.1 Official Practical Exam Simulator
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Practical Exam Practice Lab & Viva Portal
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Practice <strong>Python Programming (PR3)</strong>, <strong>Web Designing (PR2)</strong>, <strong>IoT & Arduino Uno (PR4)</strong>, and <strong>IT Tools (PR1)</strong> with live code compilers, interactive Wokwi hardware boards, typed Viva Voce, and AI scorecard grading.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> 80 Marks Coding (2 of 3)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 20 Marks Viva Voce</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> 50 Minutes Timed</span>
              </div>
            </div>

            <Link
              to="/practical-practice"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
            >
              <span>Launch Practical Lab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK LEARNING JOURNEY: YOUTUBE -> WEBSITE -> APP */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Your Exam Success Blueprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              How to Study with Skilldotpy
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              From free YouTube video lectures to downloadable notes on this website and full interactive mock tests in our Android app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: YouTube */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Youtube className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Step 1 • Free Lectures</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Watch YouTube Videos</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Watch our detailed conceptual classes, marathon revision sessions, and paper-solving videos on the Skilldotpy YouTube channel.
              </p>
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 mt-4"
              >
                Go to YouTube Channel <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Step 2: Website */}
            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200/80 hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 2 • Official Website</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Download Free Notes & Syllabus</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Access official NIELIT R5.1 syllabus PDFs, chapter-wise revision notes, LibreOffice shortcut charts, and sample practical codes completely free.
              </p>
              <Link
                to="/resources"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-4"
              >
                Browse Free Study Materials <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Step 3: App */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 hover:shadow-xl transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Step 3 • Complete Masterclass</span>
              <h3 className="text-lg font-bold text-white mt-1">Skilldotpy Android App</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Take timed CBT mock tests with negative marking analytics, offline HD video courses, solved practical codes, and 1-on-1 teacher doubt clearing.
              </p>
              <Link
                to="/app"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 mt-4"
              >
                Download Skilldotpy APK <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FLAGSHIP SECTION: NIELIT O LEVEL PAPERS (MAIN HIGHLIGHT) */}
      <section className="py-16 bg-slate-100/70 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                <Award className="w-3.5 h-3.5" /> NIELIT O Level (Level-5 IT) Flagship Hub
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Explore All 4 O Level Papers (M1, M2, M3, M4)
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-xl">
                Detailed syllabus breakdown, chapter list, practical lab requirements, and study materials for the revised R5.1 scheme.
              </p>
            </div>

            <Link
              to="/o-level"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs"
            >
              Full O Level Hub & Practical Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Module Selector Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {oLevelModules.map((module) => {
              const isSelected = module.id === selectedModuleId;
              return (
                <button
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white/80 hover:bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {module.code}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">{module.weightage.split(' ')[0]}</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 leading-tight">
                    {module.shortName}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                    {module.hindiTitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Module Deep-Dive Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded">
                      Module Code: {selectedModule.code}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      Exam Code: {selectedModule.examCode}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    {selectedModule.title}
                  </h3>
                  <p className="text-sm font-medium text-blue-600">
                    {selectedModule.hindiTitle}
                  </p>
                  <p className="text-sm text-gray-600 pt-2 leading-relaxed">
                    {selectedModule.description}
                  </p>
                </div>

                {/* Chapters list preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" /> Official R5.1 Syllabus Chapters ({selectedModule.chapters.length} Chapters):
                    </h4>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {selectedModule.totalTheoryHours}h Theory • {selectedModule.totalPracticalHours}h Practical
                    </span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {selectedModule.chapters.map((chap) => (
                      <div key={chap.number} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-start gap-2.5 hover:bg-blue-50/40 transition-colors">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          {chap.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-gray-900">{chap.title}</span>
                            <span className="text-[10px] text-slate-500 font-medium shrink-0">
                              {chap.theoryHours + chap.practicalHours} hrs
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{chap.topics.join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Exam Focus */}
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                    <Flame className="w-4 h-4 text-amber-600" /> Practical Lab Exam Requirements (100 Marks):
                  </h4>
                  <ul className="text-xs text-amber-950 space-y-1 pl-4 list-disc">
                    {selectedModule.practicalTopics.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Side: Sample Question & Action Buttons */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Sample Question Box */}
                <div className="p-5 rounded-xl bg-slate-900 text-white border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-amber-400">Sample MCQ (R5.1 Pattern)</span>
                    <span>1 Mark • No Negative</span>
                  </div>
                  <p className="text-sm font-semibold text-white mb-4">
                    {selectedModule.sampleQuestions[0].question}
                  </p>
                  <div className="space-y-2 mb-3">
                    {selectedModule.sampleQuestions[0].options.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-lg text-xs font-medium border ${
                          i === selectedModule.sampleQuestions[0].correct
                            ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                        {opt} {i === selectedModule.sampleQuestions[0].correct && '✓ (Correct)'}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    💡 <strong className="text-slate-200">Explanation:</strong> {selectedModule.sampleQuestions[0].explanation}
                  </p>
                </div>

                {/* Resource CTAs */}
                <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 space-y-3">
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Study Materials for {selectedModule.shortName}
                  </h4>
                  
                  <Link
                    to="/resources"
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-blue-200 text-xs font-bold text-gray-900 hover:border-blue-500 transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" /> Download {selectedModule.shortName} Notes PDF
                    </span>
                    <Download className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  <Link
                    to="/mock-test"
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-blue-200 text-xs font-bold text-gray-900 hover:border-blue-500 transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Practice {selectedModule.code} Online Mock Test
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  <Link
                    to="/app"
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors shadow-sm"
                  >
                    <Smartphone className="w-4 h-4" /> Full Video Course & Test Series in App
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* NIELIT CCC PREPARATION HUB PREVIEW */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" /> NIELIT CCC (Course on Computer Concepts)
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Crack CCC in 15 Days with Grade S Guarantee
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mandatory certification for government jobs (UPSSSC, RO/ARO, VDO, Police, Banking). Our structured CCC crash course covers all 9 chapters with special focus on LibreOffice Calc formulas, Writer shortcuts, and digital financial banking tools.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-gray-200">
                  <span className="font-bold text-gray-900 block">100 Questions CBT Exam</span>
                  <span className="text-gray-500">90 Mins • No Negative Marking</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-gray-200">
                  <span className="font-bold text-gray-900 block">50% Minimum Passing</span>
                  <span className="text-gray-500">Grade S: 85%+ Marks</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/ccc"
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-sm transition-colors"
                >
                  Explore Complete CCC Hub <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/resources"
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-3 rounded-xl transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-gray-600" /> Free CCC Notes PDF
                </Link>
              </div>
            </div>

            {/* Right: LibreOffice Shortcut Cheat Sheet Teaser */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">LibreOffice High-Yield Shortcuts</h3>
                  <p className="text-[11px] text-slate-400">Most repeated questions in CCC & O Level M1</p>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">Cheat Sheet</span>
              </div>

              <div className="space-y-2">
                {libreOfficeShortcutCheatSheet.slice(0, 5).map((sc, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                    <span className="text-slate-300">{sc.description}</span>
                    <kbd className="px-2 py-1 rounded bg-slate-950 text-amber-400 font-mono font-bold text-[11px] border border-slate-800">
                      {sc.shortcut}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                <Link to="/ccc" className="text-xs font-bold text-blue-400 hover:underline">
                  View All 50+ LibreOffice Shortcuts & Cheat Sheets →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INDEPENDENT PROGRAMMING & OFFICE SUITE COURSES */}
      <section className="py-16 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Computer Teacher Independent Courses
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Programming Languages & Office Productivity
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Learn practical computer skills beyond exam syllabuses: Full Python Programming, Modern Web Development (HTML/CSS/JS), and complete LibreOffice & Microsoft Office packages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      course.category === 'o-level'
                        ? 'bg-blue-100 text-blue-800'
                        : course.category === 'ccc'
                        ? 'bg-amber-100 text-amber-800'
                        : course.category === 'programming'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {course.categoryLabel}
                    </span>
                    {course.discountBadge && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        {course.discountBadge.split('•')[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                    {course.hindiTitle}
                  </p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                    {course.overview}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                    {course.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-gray-900">{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-xs text-gray-400 line-through ml-1.5">{course.originalPrice}</span>
                    )}
                  </div>
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Enroll in App
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
            >
              View Detailed Course Catalog & Syllabuses →
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE LIVE QUICK TEST (ONLINE CBT PRACTICE ENGINE) */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Live Interactive Test
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Test Your NIELIT Knowledge Right Now
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Try this quick 5-question mock test to assess your preparation level for M1, M2, M3, M4, and CCC.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            {/* Header / Progress */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
              <span className="font-semibold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800/60">
                {quickQuiz[activeQuizIndex].moduleLabel}
              </span>
              <span className="text-slate-400">
                Question <strong className="text-white">{activeQuizIndex + 1}</strong> of {quickQuiz.length}
              </span>
              <span className="font-bold text-emerald-400">
                Score: {quizScore} / {quickQuiz.length}
              </span>
            </div>

            {/* Question Body */}
            <div className="mt-6">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {quickQuiz[activeQuizIndex].question}
              </h3>
              {quickQuiz[activeQuizIndex].hindiQuestion && (
                <p className="text-xs sm:text-sm text-blue-300 mt-1 font-medium">
                  {quickQuiz[activeQuizIndex].hindiQuestion}
                </p>
              )}

              {/* Options */}
              <div className="mt-6 space-y-3">
                {quickQuiz[activeQuizIndex].options.map((option, idx) => {
                  let btnStyle = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200';
                  if (selectedOption !== null) {
                    if (idx === quickQuiz[activeQuizIndex].correctIndex) {
                      btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500/30';
                    } else {
                      btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-950 flex items-center justify-center font-bold text-xs shrink-0 text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {selectedOption !== null && idx === quickQuiz[activeQuizIndex].correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {showExplanation && (
                <div className="mt-6 p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    💡 Explanation:
                  </div>
                  <p>{quickQuiz[activeQuizIndex].explanation}</p>
                  
                  <div className="pt-3 flex justify-end">
                    {activeQuizIndex < quickQuiz.length - 1 ? (
                      <button
                        onClick={handleNextQuiz}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs"
                      >
                        Next Question <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={resetQuiz}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs"
                        >
                          Retake Quiz
                        </button>
                        <Link
                          to="/mock-test"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                        >
                          Take Full Online CBT Mock Test →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PRIME AD PLACEMENT 2: Below Quick Quiz */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <AdBanner slotId="home-quiz-bottom" format="horizontal" fallbackType="mock-test" />
        </div>
      </section>

      {/* DEDICATED APP DOWNLOAD PROMO CARD */}
      <section className="py-16 bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-400/30 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" /> Official Android Application
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                  Get the Official <span className="text-amber-300">Skilldotpy App</span> for Complete Study
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Download our lightweight Android APK to access sequential HD video classes, full-length CBT mock tests with timer, downloadable offline notes, solved practical codes, and direct doubt clearing with Er. Skilldotpy.
                </p>

                <div className="space-y-2 text-xs text-slate-200 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Works completely offline once videos/notes are downloaded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Real NIELIT CBT Mock Test format with scorecard & analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>No ads, secure APK, verified for all Android devices (5.0+)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <a
                    href={siteConfig.app.apkUrl}
                    download="skilldotpy-latest.apk"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg text-xs transition-all"
                  >
                    <Smartphone className="w-4 h-4" /> Download Official APK ({siteConfig.app.size})
                  </a>
                  <Link
                    to="/app"
                    className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-3.5 rounded-xl border border-slate-600 text-xs transition-all"
                  >
                    View App Screenshots & Guide
                  </Link>
                </div>
              </div>

              {/* Right: Phone Visual Mockup Showcase */}
              <div className="md:col-span-5 flex items-center justify-center py-2">
                <AppPhoneMockup showBadges={true} />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* TEACHER / MENTOR CREDIBILITY SECTION */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-50 border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-4 text-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-extrabold text-3xl mx-auto flex items-center justify-center shadow-lg mb-3">
                  AP
                </div>
                <h3 className="font-extrabold text-lg text-gray-900">{siteConfig.teacher.name}</h3>
                <p className="text-xs font-semibold text-blue-600">{siteConfig.teacher.role}</p>
                <span className="text-[11px] text-gray-500 block mt-1">{siteConfig.teacher.experience}</span>
              </div>

              <div className="md:col-span-8 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Dedicated to Making Computer Science & NIELIT Accessible to Everyone
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {siteConfig.teacher.bio}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {siteConfig.teacher.specialties.map((spec, i) => (
                    <span key={i} className="text-[11px] font-semibold bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md">
                      ✓ {spec}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <a
                    href={siteConfig.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Youtube className="w-4 h-4" /> Watch Free Classes on YouTube
                  </a>
                  <a
                    href={`mailto:${siteConfig.links.email}`}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Email Mentorship Query →
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Student Queries
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Frequently Asked Questions (NIELIT O Level & CCC)
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
                <h3 className="font-bold text-sm text-gray-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                {faq.hindiQuestion && (
                  <p className="text-xs font-medium text-blue-600 pl-6 mt-0.5">
                    {faq.hindiQuestion}
                  </p>
                )}
                <p className="text-xs text-gray-600 leading-relaxed pl-6 mt-2">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              Have more questions? View Complete Student FAQ →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
