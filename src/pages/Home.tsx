import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Download, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Check, 
  ShieldCheck,
  Zap,
  Calculator,
  Laptop,
  FileCode2,
  Monitor,
  Settings,
  FileSpreadsheet,
  Presentation,
  Globe,
  Layout,
  Code,
  Cpu,
  GitBranch,
  Layers,
  Cloud,
  Wifi,
  Activity,
  Users,
  Video,
  BarChart3,
  Star,
  Timer
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { NielitLogo } from '../components/NielitLogo';
import { siteConfig } from '../data/config';
import { ComputerCourseHeroPoster } from '../components/ComputerCourseHeroPoster';
import { courses } from '../data/courses';
import { faqs } from '../data/faqs';

export function Home() {
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
        title="NIELIT O Level & CCC Notes, MCQs & Syllabus"
        description="Free NIELIT O Level (M1, M2, M3, M4) & CCC chapterwise notes in Hindi/English, online MCQs, practical compilers, CBT mock tests & PDF study material."
        canonicalUrl="/"
        keywords={[
          'Skilldotpy',
          'o level chapterwise notes',
          'o level chapterwise mcq',
          'ccc notes mcq',
          'NIELIT O Level study material',
          'NIELIT O Level free notes',
          'O Level syllabus 2026 pdf',
          'O level M1-R5 notes',
          'O level M2-R5 web design',
          'O level M3-R5 python notes in Hindi',
          'O level M4-R5 IoT notes',
          'CCC free notes pdf in hindi',
          'LibreOffice shortcuts cheat sheet',
          'Skilldotpy paid courses'
        ]}
        schema={homeSchemas}
        breadcrumbs={[{ name: 'Home', url: '/' }]}
      />



      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION — Two-Column Layout (Examjila-inspired, Skilldotpy brand)
          Mobile: stacked | Desktop: left content + right visual panel
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white text-slate-900 pt-8 pb-10 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-16 border-b border-slate-200">

        {/* Very subtle warm background tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 pointer-events-none" />

        {/* Dot grid pattern — decorative */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">

          {/* ── TWO-COLUMN FLEX ROW ── */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 xl:gap-16">

            {/* ════════════════════════════
                LEFT COLUMN — TEXT CONTENT
               ════════════════════════════ */}
            <div className="flex-1 w-full text-center lg:text-left">

              {/* Eyebrow pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] sm:text-xs font-bold mb-4 sm:mb-5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                NIELIT Certified Exam Preparation Platform
              </div>

              {/* Main headline — bold, two-line */}
              <h1 className="text-[2rem] sm:text-[2.6rem] md:text-5xl lg:text-[3.2rem] font-black text-slate-900 tracking-tight leading-[1.12] mb-4 sm:mb-5">
                <span className="block">O Level, CCC में करें</span>
                <span className="block mt-1">
                  पहली बार में{' '}
                  <span className="relative inline-block">
                    <span className="text-[#d94f4f]">सफलता हासिल</span>
                    {/* hand-drawn underline */}
                    <svg
                      className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full overflow-visible"
                      height="7"
                      viewBox="0 0 260 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M3 5.5C70 1.5 190 1.5 257 5.5" stroke="#d94f4f" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base md:text-[1.05rem] text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-7">
                Free chapter-wise notes, video lectures, online MCQ tests, CBT mock exams &amp; practical labs — सब कुछ एक जगह, हिंदी &amp; English में।
              </p>

              {/* CTA Buttons — 3 buttons like reference */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-7 sm:mb-8">
                <Link
                  to="/chapter-wise-notes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-600/20 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  View Notes
                </Link>
                <Link
                  to="/mock-test"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Live Test दें
                </Link>
                <Link
                  to="/resources"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-800 text-sm bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4 text-[#d94f4f]" />
                  Download PDFs (Free)
                </Link>
              </div>

              {/* Trust strip — avatars + text */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                {/* Avatar stack */}
                <div className="flex -space-x-2.5">
                  {['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'].map((color, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}
                    >
                      {['A', 'R', 'S', 'P'][i]}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <span className="block text-xs sm:text-sm font-bold text-slate-900">Trusted by 50,000+ Students</span>
                  <span className="block text-[10px] sm:text-xs text-slate-500">Across India — O Level &amp; CCC Exam Prep</span>
                </div>
              </div>

              {/* Quick stat pills row */}
              <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                {[
                  { label: '1.4M+', sub: 'MCQs Attempted', color: 'bg-blue-50 border-blue-200 text-blue-800' },
                  { label: '20K+', sub: 'MCQ Bank', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                  { label: '6+ Yrs', sub: 'Expert Content', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                ].map((stat) => (
                  <div key={stat.label} className={`inline-flex flex-col items-center px-4 py-2 rounded-xl border font-semibold text-center ${stat.color}`}>
                    <span className="text-sm font-black">{stat.label}</span>
                    <span className="text-[10px] opacity-80">{stat.sub}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* ════════════════════════════
                RIGHT COLUMN — VISUAL PANEL
               ════════════════════════════ */}
            <div className="w-full lg:w-[420px] xl:w-[460px] shrink-0 relative">

              {/* Main card — colored background + illustration */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#f5a623] via-[#f9b830] to-[#f5a623] p-1 shadow-2xl shadow-amber-200/60">
                <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#fbb524] to-[#f5a623] min-h-[280px] sm:min-h-[320px] flex items-end justify-center">

                  {/* Background circle glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-white/15 blur-2xl" />
                  </div>

                  {/* SVG Illustration — student studying at laptop */}
                  <svg
                    viewBox="0 0 320 280"
                    className="relative z-10 w-full max-w-[300px] sm:max-w-[340px] mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Student studying on laptop"
                    role="img"
                  >
                    {/* desk */}
                    <rect x="40" y="210" width="240" height="12" rx="4" fill="#78350f" opacity="0.6"/>
                    <rect x="30" y="222" width="260" height="6" rx="3" fill="#451a03" opacity="0.4"/>

                    {/* laptop body */}
                    <rect x="90" y="162" width="140" height="6" rx="3" fill="#374151"/>
                    <rect x="80" y="168" width="160" height="8" rx="4" fill="#1f2937"/>

                    {/* laptop screen */}
                    <rect x="94" y="100" width="132" height="90" rx="6" fill="#1e293b"/>
                    <rect x="94" y="100" width="132" height="4" rx="2" fill="#334155"/>
                    {/* screen glow */}
                    <rect x="98" y="106" width="124" height="82" rx="4" fill="url(#screenGrad)"/>
                    {/* screen content lines */}
                    <rect x="106" y="116" width="60" height="4" rx="2" fill="white" opacity="0.7"/>
                    <rect x="106" y="124" width="90" height="3" rx="1.5" fill="#93c5fd" opacity="0.6"/>
                    <rect x="106" y="131" width="75" height="3" rx="1.5" fill="#93c5fd" opacity="0.5"/>
                    <rect x="106" y="145" width="30" height="12" rx="4" fill="#2563eb" opacity="0.9"/>
                    <text x="121" y="155" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle">MCQ</text>
                    {/* webcam dot */}
                    <circle cx="160" cy="104" r="2" fill="#475569"/>

                    {/* person body */}
                    <ellipse cx="160" cy="210" rx="38" ry="12" fill="#92400e" opacity="0.3"/>
                    {/* torso */}
                    <rect x="136" y="168" width="48" height="44" rx="12" fill="#2563eb"/>
                    {/* collar */}
                    <rect x="152" y="168" width="16" height="8" rx="4" fill="#1d4ed8"/>
                    {/* left arm */}
                    <path d="M136 180 Q110 192 102 198" stroke="#f9a8d4" strokeWidth="14" strokeLinecap="round" fill="none"/>
                    {/* right arm */}
                    <path d="M184 180 Q210 192 218 198" stroke="#f9a8d4" strokeWidth="14" strokeLinecap="round" fill="none"/>
                    {/* left hand */}
                    <circle cx="100" cy="200" r="8" fill="#f9a8d4"/>
                    {/* right hand */}
                    <circle cx="220" cy="200" r="8" fill="#f9a8d4"/>

                    {/* neck */}
                    <rect x="153" y="152" width="14" height="18" rx="6" fill="#f9a8d4"/>
                    {/* head */}
                    <ellipse cx="160" cy="140" rx="26" ry="28" fill="#f9a8d4"/>
                    {/* hair */}
                    <ellipse cx="160" cy="118" rx="26" ry="12" fill="#1c1917"/>
                    <ellipse cx="140" cy="130" rx="8" ry="14" fill="#1c1917"/>
                    <ellipse cx="180" cy="130" rx="8" ry="14" fill="#1c1917"/>
                    {/* headphones */}
                    <path d="M134 128 Q134 108 160 108 Q186 108 186 128" stroke="#fbbf24" strokeWidth="5" fill="none" strokeLinecap="round"/>
                    <rect x="130" y="126" width="8" height="12" rx="4" fill="#f59e0b"/>
                    <rect x="182" y="126" width="8" height="12" rx="4" fill="#f59e0b"/>
                    {/* eyes */}
                    <ellipse cx="150" cy="140" rx="4" ry="4.5" fill="white"/>
                    <ellipse cx="170" cy="140" rx="4" ry="4.5" fill="white"/>
                    <circle cx="151" cy="141" r="2.5" fill="#1e293b"/>
                    <circle cx="171" cy="141" r="2.5" fill="#1e293b"/>
                    {/* smile */}
                    <path d="M152 150 Q160 156 168 150" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round"/>

                    <defs>
                      <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0f172a"/>
                        <stop offset="100%" stopColor="#1e3a5f"/>
                      </linearGradient>
                    </defs>
                  </svg>

                </div>
              </div>

              {/* Floating stat card — top right: MCQ Tests */}
              <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 z-20 bg-white rounded-2xl shadow-lg border border-slate-100 px-3.5 py-2.5 flex items-center gap-2.5 min-w-[130px]">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <span className="block text-sm font-black text-slate-900">1.4M+</span>
                  <span className="block text-[10px] text-slate-500 font-medium">MCQs Attempted</span>
                </div>
              </div>

              {/* Floating stat card — bottom left: Rating */}
              <div className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-4 z-20 bg-white rounded-2xl shadow-lg border border-slate-100 px-3.5 py-2.5 flex items-center gap-2.5 min-w-[120px]">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-400" />
                </div>
                <div>
                  <span className="block text-sm font-black text-slate-900">4.9</span>
                  <span className="block text-[10px] text-slate-500 font-medium">Student Rating</span>
                </div>
              </div>

            </div>
            {/* END RIGHT COLUMN */}

          </div>
          {/* END TWO-COLUMN ROW */}

        </div>
      </section>

      {/* =========================================================================
          1. FEATURED CHAPTER-WISE STUDY NOTES SECTION
         ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-black px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>NIELIT R5.1 Official Chapter-Wise Lecture & Study Notes</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              चैप्टरवाइज़ स्टडी नोट्स (Theory & Code)
            </h2>
            <p className="text-xs sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
              प्रत्येक मॉड्यूल और चैप्टर के विस्तृत थ्योरी नोट्स, डेफिनिशन, सिंटैक्स, कोड उदाहरण और द्विभाषी (Hindi & English) व्याख्या। 1-क्लिक में अध्ययन शुरू करें।
            </p>
          </div>

          {/* 4 O-Level Paper Cards Grid for Study Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            
            {/* Notes Card 1: M1-R5.1 */}
            <div className="bg-[#e9f2fa] border border-[#cde0f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    IT Tools and Network Basics
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M1-R5.1
                  </span>
                </div>

                {/* 6 Chapter Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { num: 1, icon: <Monitor className="w-7 h-7 text-blue-600" />, title: 'Introduction to Computer' },
                    { num: 2, icon: <Settings className="w-7 h-7 text-slate-700" />, title: 'Introduction to OS' },
                    { num: 3, icon: <FileText className="w-7 h-7 text-sky-600" />, title: 'Word Processing (Writer)' },
                    { num: 4, icon: <FileSpreadsheet className="w-7 h-7 text-emerald-600" />, title: 'Spreadsheet (Calc)' },
                    { num: 5, icon: <Presentation className="w-7 h-7 text-amber-600" />, title: 'Presentation (Impress)' },
                    { num: 6, icon: <Globe className="w-7 h-7 text-indigo-600" />, title: 'Internet & WWW' },
                  ].map((ch) => (
                    <Link
                      key={ch.num}
                      to={`/notes/m1-r5/m1-ch${ch.num}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                      title={ch.title}
                    >
                      <div className="h-9 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-1">
                        Chapter {ch.num}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-notes/m1-r5"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Chapters
                </Link>
              </div>
            </div>

            {/* Notes Card 2: M2-R5.1 */}
            <div className="bg-[#e9f2fa] border border-[#cde0f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Web Designing and Publishing
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M2-R5.1
                  </span>
                </div>

                {/* 6 Chapter Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { num: 1, icon: <Layout className="w-7 h-7 text-sky-600" />, title: 'Intro to Web Design' },
                    { num: 2, icon: <Code className="w-7 h-7 text-amber-700" />, title: 'HTML & Text Editors' },
                    { num: 3, icon: <div className="w-7 h-7 rounded bg-orange-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">5</div>, title: 'HTML5 Elements' },
                    { num: 4, icon: <div className="w-7 h-7 rounded bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">3</div>, title: 'CSS3 Selectors' },
                    { num: 5, icon: <Laptop className="w-7 h-7 text-rose-500" />, title: 'Responsive Frameworks' },
                    { num: 6, icon: <div className="w-7 h-7 rounded bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-2xs">JS</div>, title: 'JavaScript & Angular' },
                  ].map((ch) => (
                    <Link
                      key={ch.num}
                      to={`/notes/m2-r5/m2-ch${ch.num}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                      title={ch.title}
                    >
                      <div className="h-9 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-1">
                        Chapter {ch.num}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-notes/m2-r5"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Chapters
                </Link>
              </div>
            </div>

            {/* Notes Card 3: M3-R5.1 */}
            <div className="bg-[#ebf5fa] border border-[#cfe4f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Python Programming
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M3-R5.1
                  </span>
                </div>

                {/* 6 Chapter Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { num: 1, icon: <Cpu className="w-7 h-7 text-emerald-600" />, title: 'Intro to Programming' },
                    { num: 2, icon: <GitBranch className="w-7 h-7 text-amber-600" />, title: 'Algorithms & Flowcharts' },
                    { num: 3, icon: <div className="w-7 h-7 rounded bg-gradient-to-tr from-blue-600 to-amber-400 text-white font-black text-xs flex items-center justify-center shadow-2xs">Py</div>, title: 'Python Syntax & Basics' },
                    { num: 4, icon: <Calculator className="w-7 h-7 text-rose-600" />, title: 'Operators & Expressions' },
                    { num: 5, icon: <Layers className="w-7 h-7 text-blue-600" />, title: 'Sequence Data Types' },
                    { num: 6, icon: <Code className="w-7 h-7 text-purple-600" />, title: 'Functions & Scope' },
                  ].map((ch) => (
                    <Link
                      key={ch.num}
                      to={`/notes/m3-r5/m3-ch${ch.num}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                      title={ch.title}
                    >
                      <div className="h-9 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-1">
                        Chapter {ch.num}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-notes/m3-r5"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Chapters
                </Link>
              </div>
            </div>

            {/* Notes Card 4: M4-R5.1 */}
            <div className="bg-[#eaf5f2] border border-[#cce8e0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Internet of Things (IOT)
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M4-R5.1
                  </span>
                </div>

                {/* 6 Chapter Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { num: 1, icon: <Cloud className="w-7 h-7 text-teal-600" />, title: 'Introduction to IoT' },
                    { num: 2, icon: <Wifi className="w-7 h-7 text-sky-600" />, title: 'Things & Connections' },
                    { num: 3, icon: <Activity className="w-7 h-7 text-emerald-600" />, title: 'Sensors & Actuators' },
                    { num: 4, icon: <div className="w-7 h-7 rounded bg-teal-700 text-white font-black text-xs flex items-center justify-center shadow-2xs">∞</div>, title: 'Arduino Programming' },
                    { num: 5, icon: <ShieldCheck className="w-7 h-7 text-amber-600" />, title: 'Security & Cyber Attacks' },
                    { num: 6, icon: <Users className="w-7 h-7 text-indigo-600" />, title: 'Soft Skills & Personality' },
                  ].map((ch) => (
                    <Link
                      key={ch.num}
                      to={`/notes/m4-r5/m4-ch${ch.num}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                      title={ch.title}
                    >
                      <div className="h-9 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-1">
                        Chapter {ch.num}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-notes/m4-r5"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Chapters
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Explore Hub CTA */}
          <div className="mt-10 text-center">
            <Link
              to="/chapter-wise-notes"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md shadow-slate-900/20 transition-all group"
            >
              <span>Explore All Chapter-Wise Study Notes Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. FEATURED CHAPTER-WISE MCQS HUB SECTION
         ========================================================================= */}
      <section className="py-12 sm:py-16 bg-slate-100/70 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-black px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>NIELIT R5.1 Official Chapter-Wise MCQ Bank</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              चैप्टरवाइज़ MCQs ऑनलाइन प्रैक्टिस
            </h2>
            <p className="text-xs sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
              प्रत्येक चैप्टर के महत्वपूर्ण बहुविकल्पीय प्रश्न हल करें। तुरंत सही/गलत उत्तर जाँच, व्याख्या एवं स्कोर ट्रैकिंग की सुविधा।
            </p>
          </div>

          {/* 4 O-Level Paper Cards + CCC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            
            {/* Card 1: M1-R5.1 */}
            <div className="bg-[#e9f2fa] border border-[#cde0f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    IT Tools and Network Basics
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M1-R5.1
                  </span>
                </div>

                {/* 6 Chapter Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { num: 1, icon: <Monitor className="w-7 h-7 text-blue-600" />, title: 'Introduction to Computer' },
                    { num: 2, icon: <Settings className="w-7 h-7 text-slate-700" />, title: 'Operating System' },
                    { num: 3, icon: <FileText className="w-7 h-7 text-sky-600" />, title: 'Word Processing' },
                    { num: 4, icon: <FileSpreadsheet className="w-7 h-7 text-emerald-600" />, title: 'Spreadsheet' },
                    { num: 5, icon: <Presentation className="w-7 h-7 text-amber-600" />, title: 'Presentation' },
                    { num: 6, icon: <Globe className="w-7 h-7 text-indigo-600" />, title: 'Internet & WWW' },
                  ].map((ch) => (
                    <Link
                      key={ch.num}
                      to={`/chapter-wise-mcq/m1-r5/${ch.num}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                      title={ch.title}
                    >
                      <div className="h-9 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                        Chapter {ch.num}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-mcq/m1-r5"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Chapters
                </Link>
              </div>
            </div>

            {/* Card 2: M2-R5.1 */}
            <div className="bg-[#e9f2fa] border border-[#cde0f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Web Designing and Publishing
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M2-R5.1
                  </span>
                </div>

                {/* 6 Chapter Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { num: 1, icon: <Layout className="w-7 h-7 text-sky-600" />, title: 'Intro to Web Design' },
                    { num: 2, icon: <Code className="w-7 h-7 text-amber-700" />, title: 'HTML Editors' },
                    { num: 3, icon: <div className="w-7 h-7 rounded bg-orange-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">5</div>, title: 'HTML5 Elements' },
                    { num: 4, icon: <div className="w-7 h-7 rounded bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">3</div>, title: 'CSS3' },
                    { num: 5, icon: <Laptop className="w-7 h-7 text-rose-500" />, title: 'Responsive CSS' },
                    { num: 6, icon: <div className="w-7 h-7 rounded bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-2xs">JS</div>, title: 'JavaScript' },
                  ].map((ch) => (
                    <Link
                      key={ch.num}
                      to={`/chapter-wise-mcq/m2-r5/${ch.num}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                      title={ch.title}
                    >
                      <div className="h-9 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                        Chapter {ch.num}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-mcq/m2-r5"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Chapters
                </Link>
              </div>
            </div>

            {/* Card 3: M3-R5.1 */}
            <div className="bg-[#ebf5fa] border border-[#cfe4f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Python Programming
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M3-R5.1
                  </span>
                </div>

                {/* 6 Chapter Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { num: 1, icon: <Cpu className="w-7 h-7 text-emerald-600" />, title: 'Intro to Programming' },
                    { num: 2, icon: <GitBranch className="w-7 h-7 text-amber-600" />, title: 'Flowcharts' },
                    { num: 3, icon: <div className="w-7 h-7 rounded bg-gradient-to-tr from-blue-600 to-amber-400 text-white font-black text-xs flex items-center justify-center shadow-2xs">Py</div>, title: 'Python Syntax' },
                    { num: 4, icon: <Calculator className="w-7 h-7 text-rose-600" />, title: 'Operators' },
                    { num: 5, icon: <Layers className="w-7 h-7 text-blue-600" />, title: 'Data Types' },
                    { num: 6, icon: <Code className="w-7 h-7 text-purple-600" />, title: 'Functions' },
                  ].map((ch) => (
                    <Link
                      key={ch.num}
                      to={`/chapter-wise-mcq/m3-r5/${ch.num}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                      title={ch.title}
                    >
                      <div className="h-9 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                        Chapter {ch.num}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-mcq/m3-r5"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Chapters
                </Link>
              </div>
            </div>

            {/* Card 4: M4-R5.1 */}
            <div className="bg-[#eaf5f2] border border-[#cce8e0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Internet of Things (IOT)
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M4-R5.1
                  </span>
                </div>

                {/* 6 Chapter Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { num: 1, icon: <Cloud className="w-7 h-7 text-teal-600" />, title: 'Introduction to IoT' },
                    { num: 2, icon: <Wifi className="w-7 h-7 text-sky-600" />, title: 'Things & Connections' },
                    { num: 3, icon: <Activity className="w-7 h-7 text-emerald-600" />, title: 'Sensors & Actuators' },
                    { num: 4, icon: <div className="w-7 h-7 rounded bg-teal-700 text-white font-black text-xs flex items-center justify-center shadow-2xs">∞</div>, title: 'Arduino' },
                    { num: 5, icon: <ShieldCheck className="w-7 h-7 text-amber-600" />, title: 'Security' },
                    { num: 6, icon: <Users className="w-7 h-7 text-indigo-600" />, title: 'Soft Skills' },
                  ].map((ch) => (
                    <Link
                      key={ch.num}
                      to={`/chapter-wise-mcq/m4-r5/${ch.num}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                      title={ch.title}
                    >
                      <div className="h-9 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                        Chapter {ch.num}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-mcq/m4-r5"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Chapters
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Explore Hub CTA */}
          <div className="mt-10 text-center">
            <Link
              to="/chapter-wise-mcq"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-md shadow-blue-500/20 transition-all group"
            >
              <span>Explore All 41 Chapters & CCC MCQs Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. FEATURED CBT ONLINE MOCK TEST SERIES SECTION (Full Test Mode)
         ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>NIELIT R5.1 Official Full CBT Online Mock Test Series</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              ऑनलाइन CBT मॉक टेस्ट (Full Test Mode)
            </h2>
            <p className="text-xs sm:text-base text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
              वास्तविक NIELIT परीक्षा पैटर्न पर आधारित 100 प्रश्नों के ऑनलाइन टेस्ट। टाइमर, तुरंत रिजल्ट, ग्रेडिंग (S/A/B/C/D) एवं विस्तृत हिंदी व्याख्या के साथ 1-क्लिक में शुरू करें।
            </p>
          </div>

          {/* 4 O-Level Paper Cards Grid for CBT Mock Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            
            {/* CBT Card 1: M1-R5.1 */}
            <div className="bg-[#e9f2fa] border border-[#cde0f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      IT Tools and Network Basics
                    </h3>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">4 ऑनलाइन सीबीटी टेस्ट उपलब्ध</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M1-R5.1
                  </span>
                </div>

                {/* 4 Tests Grid (2x2) */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: 'm1-test-1', num: 1, title: 'Test 1: Fundamentals & OS', sub: '50 MCQs • 45 Mins' },
                    { id: 'm1-test-2', num: 2, title: 'Test 2: LibreOffice Suite', sub: '50 MCQs • 45 Mins' },
                    { id: 'm1-test-3', num: 3, title: 'Test 3: Internet & Banking', sub: '50 MCQs • 45 Mins' },
                    { id: 'm1-test-4', num: 4, title: 'Test 4: Grand Exam Simulator', sub: '100 MCQs • 90 Mins' },
                  ].map((t) => (
                    <Link
                      key={t.id}
                      to={`/mock-test?test=${t.id}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative"
                    >
                      {/* Red circular number sticker */}
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs mb-1.5 group-hover:scale-110 transition-transform">
                        {t.num}
                      </div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                        Test {t.num}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {t.sub}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/mock-test?module=m1"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Tests
                </Link>
              </div>
            </div>

            {/* CBT Card 2: M2-R5.1 */}
            <div className="bg-[#e9f2fa] border border-[#cde0f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      Web Designing and Publishing
                    </h3>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">4 ऑनलाइन सीबीटी टेस्ट उपलब्ध</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M2-R5.1
                  </span>
                </div>

                {/* 4 Tests Grid (2x2) */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: 'm2-test-1', num: 1, title: 'Test 1: HTML5 Structure', sub: '50 MCQs • 45 Mins' },
                    { id: 'm2-test-2', num: 2, title: 'Test 2: CSS3 & Flexbox', sub: '50 MCQs • 45 Mins' },
                    { id: 'm2-test-3', num: 3, title: 'Test 3: JS & DOM Scripting', sub: '50 MCQs • 45 Mins' },
                    { id: 'm2-test-4', num: 4, title: 'Test 4: Grand Exam Simulator', sub: '100 MCQs • 90 Mins' },
                  ].map((t) => (
                    <Link
                      key={t.id}
                      to={`/mock-test?test=${t.id}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative"
                    >
                      {/* Red circular number sticker */}
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs mb-1.5 group-hover:scale-110 transition-transform">
                        {t.num}
                      </div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                        Test {t.num}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {t.sub}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/mock-test?module=m2"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Tests
                </Link>
              </div>
            </div>

            {/* CBT Card 3: M3-R5.1 */}
            <div className="bg-[#ebf5fa] border border-[#cfe4f2] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      Python Programming
                    </h3>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">4 ऑनलाइन सीबीटी टेस्ट उपलब्ध</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M3-R5.1
                  </span>
                </div>

                {/* 4 Tests Grid (2x2) */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: 'm3-test-1', num: 1, title: 'Test 1: Python Basics', sub: '50 MCQs • 45 Mins' },
                    { id: 'm3-test-2', num: 2, title: 'Test 2: Sequence Types', sub: '50 MCQs • 45 Mins' },
                    { id: 'm3-test-3', num: 3, title: 'Test 3: Functions & NumPy', sub: '50 MCQs • 45 Mins' },
                    { id: 'm3-test-4', num: 4, title: 'Test 4: Flagship 100 MCQs', sub: '100 MCQs • 90 Mins' },
                  ].map((t) => (
                    <Link
                      key={t.id}
                      to={`/mock-test?test=${t.id}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative"
                    >
                      {/* Red circular number sticker */}
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs mb-1.5 group-hover:scale-110 transition-transform">
                        {t.num}
                      </div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                        Test {t.num}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {t.sub}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/mock-test?module=m3"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Tests
                </Link>
              </div>
            </div>

            {/* CBT Card 4: M4-R5.1 */}
            <div className="bg-[#eaf5f2] border border-[#cce8e0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      Internet of Things (IOT)
                    </h3>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">4 ऑनलाइन सीबीटी टेस्ट उपलब्ध</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                    M4-R5.1
                  </span>
                </div>

                {/* 4 Tests Grid (2x2) */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { id: 'm4-test-1', num: 1, title: 'Test 1: IoT Architecture', sub: '50 MCQs • 45 Mins' },
                    { id: 'm4-test-2', num: 2, title: 'Test 2: Sensors & Arduino', sub: '50 MCQs • 45 Mins' },
                    { id: 'm4-test-3', num: 3, title: 'Test 3: Protocols & Security', sub: '50 MCQs • 45 Mins' },
                    { id: 'm4-test-4', num: 4, title: 'Test 4: Grand Exam Simulator', sub: '100 MCQs • 90 Mins' },
                  ].map((t) => (
                    <Link
                      key={t.id}
                      to={`/mock-test?test=${t.id}`}
                      className="bg-white hover:bg-blue-50/60 rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer relative"
                    >
                      {/* Red circular number sticker */}
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs mb-1.5 group-hover:scale-110 transition-transform">
                        {t.num}
                      </div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                        Test {t.num}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                        {t.sub}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/mock-test?module=m4"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All Tests
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Explore Hub CTA */}
          <div className="mt-10 text-center">
            <Link
              to="/mock-test"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md shadow-emerald-500/20 transition-all group"
            >
              <span>Explore All NIELIT O Level & CCC Online CBT Tests Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* QUICK ACCESS 8-GRID (ExamJila-Inspired Instant 1-Tap Portal Grid) */}
      <section className="bg-white border-b border-slate-200 py-6 sm:py-8 shadow-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>त्वरित अध्ययन पोर्टल (Quick Study Gateway)</span>
              </h2>
              <p className="text-xs text-slate-500">
                अपनी आवश्यकतानुसार सीधे अध्ययन सामग्री, ऑनलाइन टेस्ट या कैलकुलेटर खोलें:
              </p>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              8 मुख्य पोर्टल्स
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
            
            {/* 1. O Level Hub */}
            <Link
              to="/o-level"
              className="bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group shadow-2xs hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 group-hover:text-blue-700 leading-tight">
                O Level हब
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">M1 से M4 नोट्स</span>
            </Link>

            {/* 2. CCC Portal */}
            <Link
              to="/ccc"
              className="bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group shadow-2xs hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 group-hover:text-amber-700 leading-tight">
                CCC पोर्टल
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">80 घंटे पाठ्यक्रम</span>
            </Link>

            {/* 3. Chapter-Wise MCQs */}
            <Link
              to="/chapter-wise-mcq"
              className="bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group shadow-2xs hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 group-hover:text-blue-700 leading-tight">
                चैप्टर MCQs
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">32+ चैप्टर टेस्ट</span>
            </Link>

            {/* 4. CBT Mock Test */}
            <Link
              to="/mock-test"
              className="bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group shadow-2xs hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 leading-tight">
                ऑनलाइन टेस्ट
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">100 MCQs CBT</span>
            </Link>

            {/* 5. Result Calculator */}
            <Link
              to="/o-level-result-calculator"
              className="bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group shadow-2xs hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 group-hover:text-indigo-700 leading-tight">
                रिजल्ट कैलकुलेटर
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">60:40 फॉर्मूला</span>
            </Link>

            {/* 6. Practical Lab */}
            <Link
              to="/practical-practice"
              className="bg-slate-50 hover:bg-rose-50/80 border border-slate-200 hover:border-rose-300 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group shadow-2xs hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 group-hover:text-rose-700 leading-tight">
                प्रैक्टिकल लैब
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Python व Web IDE</span>
            </Link>

            {/* 7. Free PDFs & Resources */}
            <Link
              to="/resources"
              className="bg-slate-50 hover:bg-purple-50/80 border border-slate-200 hover:border-purple-300 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group shadow-2xs hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 group-hover:text-purple-700 leading-tight">
                फ्री PDF नोट्स
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">सिलेबस व पेपर्स</span>
            </Link>

            {/* 8. Paid Courses */}
            <Link
              to="/courses"
              className="bg-slate-50 hover:bg-sky-50/80 border border-slate-200 hover:border-sky-300 p-3 sm:p-3.5 rounded-2xl flex flex-col items-center text-center transition-all group shadow-2xs hover:shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-900 group-hover:text-sky-700 leading-tight">
                पेड वीडियो बैच
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">फुल क्लासेज</span>
            </Link>

          </div>
        </div>
      </section>

      {/* NIELIT R5.1 PASSING CRITERIA & 60:40 EXPLAINER (ExamJila Inspired) */}
      <section className="py-10 sm:py-12 bg-slate-100/80 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-3.5">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black px-3 py-1 rounded-full">
                  <ShieldCheck className="w-4 h-4" />
                  <span>NIELIT R5.1 आधिकारिक परीक्षा पैटर्न व पासिंग नियम</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  O Level में पास होने के लिए 60:40 का नया नियम समझें
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  NIELIT R5.1 नियम के अनुसार, प्रत्येक पेपर (M1 से M4) में <strong>थ्योरी (100 MCQs)</strong> और <strong>प्रैक्टिकल (100 Marks Lab)</strong> दोनों में अलग-अलग न्यूनतम <strong>33% (33 अंक)</strong> लाना अनिवार्य है, तथा दोनों का कुल भारित औसत न्यूनतम <strong>50%</strong> होना आवश्यक है।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-blue-700 block">थ्योरी परीक्षा</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">100 MCQs CBT (60% वेटेज)</p>
                    <span className="text-[11px] text-slate-500">न्यूनतम 33 अंक अनिवार्य</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-indigo-700 block">प्रैक्टिकल लैब</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">100 Marks Lab (40% वेटेज)</p>
                    <span className="text-[11px] text-slate-500">न्यूनतम 33 अंक अनिवार्य</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase text-emerald-700 block">फाइनल पासिंग ग्रेड</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">कुल 50% या अधिक</p>
                    <span className="text-[11px] text-slate-500">ग्रेड S, A, B, C, D</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/o-level-result-calculator"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>अपना फाइनल स्कोर व ग्रेड कैलकुलेट करें →</span>
                  </Link>
                </div>
              </div>

              {/* Right: Grade Table */}
              <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-black text-amber-400">NIELIT ग्रेडिंग स्केल (Official Scale)</span>
                  <span className="text-[10px] text-slate-400">R5.1 Scheme</span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-200 font-bold">85% या अधिक</span>
                    <span className="font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">ग्रेड 'S' (सर्वश्रेष्ठ)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-200 font-bold">75% से 84%</span>
                    <span className="font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">ग्रेड 'A' (उत्कृष्ट)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-200 font-bold">65% से 74%</span>
                    <span className="font-black text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">ग्रेड 'B' (अच्छा)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-200 font-bold">55% से 64%</span>
                    <span className="font-black text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">ग्रेड 'C' (संतोषजनक)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-200 font-bold">50% से 54%</span>
                    <span className="font-black text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">ग्रेड 'D' (पास)</span>
                  </div>
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
                    to="/courses"
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View Batch
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
