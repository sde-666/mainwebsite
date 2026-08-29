import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles,
  Monitor, 
  Settings, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Globe, 
  Layout, 
  Code, 
  Smartphone, 
  Cpu, 
  GitBranch, 
  Calculator, 
  Cloud, 
  Wifi, 
  ShieldCheck, 
  Users, 
  Activity,
  Layers,
  ArrowRight,
  BookOpen,
  Mail,
  CreditCard,
  Download
} from 'lucide-react';
import { SEO } from '../components/SEO';

interface PaperVisualConfig {
  id: 'm1-r5' | 'm2-r5' | 'm3-r5' | 'm4-r5' | 'ccc';
  title: string;
  shortCode: string;
  syllabusUrl: string;
  allChaptersUrl: string;
  cardBg: string;
  cardBorder: string;
  chapters: {
    num: number;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function ChapterWiseNotesHub() {
  const [selectedExamType, setSelectedExamType] = useState<'o-level' | 'ccc'>('o-level');

  const papersConfig: PaperVisualConfig[] = [
    // 1. IT Tools and Network Basics (M1-R5.1)
    {
      id: 'm1-r5',
      title: 'IT Tools and Network Basics',
      shortCode: 'M1-R5.1',
      syllabusUrl: '/syllabus',
      allChaptersUrl: '/chapter-wise-notes/m1-r5',
      cardBg: 'bg-[#e9f2fa]',
      cardBorder: 'border-[#cde0f2]',
      chapters: [
        {
          num: 1,
          title: 'Introduction to Computer',
          icon: <Monitor className="w-7 h-7 text-blue-600" />
        },
        {
          num: 2,
          title: 'Introduction to Operating System',
          icon: <Settings className="w-7 h-7 text-slate-700" />
        },
        {
          num: 3,
          title: 'Word Processing (Writer)',
          icon: <FileText className="w-7 h-7 text-sky-600" />
        },
        {
          num: 4,
          title: 'Spreadsheet (Calc)',
          icon: <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
        },
        {
          num: 5,
          title: 'Presentation (Impress)',
          icon: <Presentation className="w-7 h-7 text-amber-600" />
        },
        {
          num: 6,
          title: 'Introduction to Internet & WWW',
          icon: <Globe className="w-7 h-7 text-indigo-600" />
        }
      ]
    },

    // 2. Web Designing and Publishing (M2-R5.1)
    {
      id: 'm2-r5',
      title: 'Web Designing and Publishing',
      shortCode: 'M2-R5.1',
      syllabusUrl: '/syllabus',
      allChaptersUrl: '/chapter-wise-notes/m2-r5',
      cardBg: 'bg-[#e9f2fa]',
      cardBorder: 'border-[#cde0f2]',
      chapters: [
        {
          num: 1,
          title: 'Introduction to Web Design',
          icon: <Layout className="w-7 h-7 text-sky-600" />
        },
        {
          num: 2,
          title: 'HTML & Text Editors',
          icon: <Code className="w-7 h-7 text-amber-700" />
        },
        {
          num: 3,
          title: 'HTML5 Semantic Elements',
          icon: (
            <div className="w-7 h-7 rounded bg-orange-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              5
            </div>
          )
        },
        {
          num: 4,
          title: 'Cascading Style Sheets (CSS3)',
          icon: (
            <div className="w-7 h-7 rounded bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              3
            </div>
          )
        },
        {
          num: 5,
          title: 'Responsive Design & Frameworks',
          icon: <Smartphone className="w-7 h-7 text-rose-500" />
        },
        {
          num: 6,
          title: 'JavaScript & Angular JS',
          icon: (
            <div className="w-7 h-7 rounded bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-2xs">
              JS
            </div>
          )
        }
      ]
    },

    // 3. Python Programming (M3-R5.1)
    {
      id: 'm3-r5',
      title: 'Python Programming',
      shortCode: 'M3-R5.1',
      syllabusUrl: '/syllabus',
      allChaptersUrl: '/chapter-wise-notes/m3-r5',
      cardBg: 'bg-[#ebf5fa]',
      cardBorder: 'border-[#cfe4f2]',
      chapters: [
        {
          num: 1,
          title: 'Introduction to Programming',
          icon: <Cpu className="w-7 h-7 text-emerald-600" />
        },
        {
          num: 2,
          title: 'Algorithms & Flowcharts',
          icon: <GitBranch className="w-7 h-7 text-amber-600" />
        },
        {
          num: 3,
          title: 'Python Syntax & Basics',
          icon: (
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-blue-600 to-amber-400 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              Py
            </div>
          )
        },
        {
          num: 4,
          title: 'Operators & Expressions',
          icon: <Calculator className="w-7 h-7 text-rose-600" />
        },
        {
          num: 5,
          title: 'Sequence Data Types',
          icon: <Layers className="w-7 h-7 text-blue-600" />
        },
        {
          num: 6,
          title: 'Functions & Scope',
          icon: <Code className="w-7 h-7 text-purple-600" />
        }
      ]
    },

    // 4. Internet of Things (IOT) (M4-R5.1)
    {
      id: 'm4-r5',
      title: 'Internet of Things (IOT)',
      shortCode: 'M4-R5.1',
      syllabusUrl: '/syllabus',
      allChaptersUrl: '/chapter-wise-notes/m4-r5',
      cardBg: 'bg-[#eaf5f2]',
      cardBorder: 'border-[#cce8e0]',
      chapters: [
        {
          num: 1,
          title: 'Introduction to IoT',
          icon: <Cloud className="w-7 h-7 text-teal-600" />
        },
        {
          num: 2,
          title: 'Things & Connections',
          icon: <Wifi className="w-7 h-7 text-sky-600" />
        },
        {
          num: 3,
          title: 'Sensors & Actuators',
          icon: <Activity className="w-7 h-7 text-emerald-600" />
        },
        {
          num: 4,
          title: 'Arduino Programming',
          icon: (
            <div className="w-7 h-7 rounded bg-teal-700 text-white font-black text-xs flex items-center justify-center shadow-2xs">
              ∞
            </div>
          )
        },
        {
          num: 5,
          title: 'Security & Cyber Attacks',
          icon: <ShieldCheck className="w-7 h-7 text-amber-600" />
        },
        {
          num: 6,
          title: 'Soft Skills & Personality',
          icon: <Users className="w-7 h-7 text-indigo-600" />
        }
      ]
    }
  ];

  const cccConfig: PaperVisualConfig = {
    id: 'ccc',
    title: 'Course on Computer Concepts (CCC)',
    shortCode: 'CCC 80-HRS',
    syllabusUrl: '/syllabus',
    allChaptersUrl: '/chapter-wise-notes/ccc',
    cardBg: 'bg-[#fef8ee]',
    cardBorder: 'border-[#f5debe]',
    chapters: [
      { num: 1, title: 'Introduction to Computer', icon: <Monitor className="w-7 h-7 text-blue-600" /> },
      { num: 2, title: 'Operating System', icon: <Settings className="w-7 h-7 text-slate-700" /> },
      { num: 3, title: 'LibreOffice Writer', icon: <FileText className="w-7 h-7 text-sky-600" /> },
      { num: 4, title: 'LibreOffice Calc', icon: <FileSpreadsheet className="w-7 h-7 text-emerald-600" /> },
      { num: 5, title: 'LibreOffice Impress', icon: <Presentation className="w-7 h-7 text-amber-600" /> },
      { num: 6, title: 'Internet & WWW', icon: <Globe className="w-7 h-7 text-indigo-600" /> },
      { num: 7, title: 'E-mail, Social & e-Gov', icon: <Mail className="w-7 h-7 text-rose-600" /> },
      { num: 8, title: 'Digital Financial Tools', icon: <CreditCard className="w-7 h-7 text-teal-600" /> },
      { num: 9, title: 'Overview of Cyber Security', icon: <ShieldCheck className="w-7 h-7 text-purple-600" /> },
    ]
  };

  const getNotesLink = (moduleId: string, chapterNum: number) => {
    if (moduleId === 'ccc') {
      return `/notes/ccc/ccc-ch${chapterNum}`;
    }
    const prefix = moduleId.replace('-r5', '');
    return `/notes/${moduleId}/${prefix}-ch${chapterNum}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <SEO
        title="Chapter Wise Study Notes - NIELIT O Level & CCC | Skilldotpy"
        description="Comprehensive chapter-wise study notes for NIELIT O Level (M1-R5.1, M2-R5.1, M3-R5.1, M4-R5.1) and CCC examinations in Hindi and English."
        canonicalUrl="/chapter-wise-notes"
      />

      {/* =========================================================================
          HERO BANNER (MATCHING CHAPTER WISE MCQ HUB LAYOUT)
         ========================================================================= */}
      <section className="bg-slate-900 text-white pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-black px-3.5 py-1.5 rounded-full mb-4 border border-blue-400/30 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>NIELIT R5.1 Official Chapter-Wise Lecture & Study Notes</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            चैप्टरवाइज़ स्टडी नोट्स
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
            प्रत्येक चैप्टर के विस्तृत थ्योरी नोट्स, डेफिनिशन, सिंटैक्स, कोड उदाहरण और द्विभाषी (Hindi & English) व्याख्या। 1-क्लिक में चैप्टर का अध्ययन शुरू करें।
          </p>

          {/* Quick Segment Switcher Tabs */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            <button
              onClick={() => setSelectedExamType('o-level')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedExamType === 'o-level'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              NIELIT O Level (4 Modules)
            </button>
            <button
              onClick={() => setSelectedExamType('ccc')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedExamType === 'ccc'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              NIELIT CCC (9 Chapters)
            </button>
            <Link
              to="/syllabus"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800/90 text-amber-300 hover:bg-slate-700 border border-amber-400/30 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Syllabus PDFs</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          MAIN PAPERS GRID CONTAINER
         ========================================================================= */}
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        
        {selectedExamType === 'o-level' ? (
          /* 4 O-Level Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {papersConfig.map((paper) => (
              <div
                key={paper.id}
                className={`${paper.cardBg} border ${paper.cardBorder} rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar: Title & Paper Code */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {paper.title}
                    </h2>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                      {paper.shortCode}
                    </span>
                  </div>

                  {/* 6 Chapter Grid Box */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {paper.chapters.map((ch) => (
                      <Link
                        key={ch.num}
                        to={getNotesLink(paper.id, ch.num)}
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

                {/* Bottom Row Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <Link
                    to="/syllabus"
                    className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    View Syllabus
                  </Link>
                  <Link
                    to={paper.allChaptersUrl}
                    className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    All Chapters
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* CCC Master Card */
          <div className="max-w-4xl mx-auto">
            <div className={`${cccConfig.cardBg} border ${cccConfig.cardBorder} rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {cccConfig.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Complete 80-Hour Computer Concepts Curriculum & LibreOffice Suite Notes
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-white border border-amber-200 text-amber-900 shadow-2xs">
                    {cccConfig.shortCode}
                  </span>
                </div>

                {/* 9 Chapters Grid for CCC */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
                  {cccConfig.chapters.map((ch) => (
                    <Link
                      key={ch.num}
                      to={getNotesLink('ccc', ch.num)}
                      className="bg-white hover:bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/80 shadow-2xs hover:shadow-xs hover:border-amber-400 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                      title={ch.title}
                    >
                      <div className="h-9 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                        {ch.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                        Chapter {ch.num}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {ch.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-amber-200/60">
                <Link
                  to="/syllabus"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View CCC Syllabus
                </Link>
                <Link
                  to="/chapter-wise-notes/ccc"
                  className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All 9 Chapters Notes
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Footer CTA to MCQs & Calculator */}
        <section className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
              Complete Preparation Ecosystem
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Want to test your preparation after studying notes?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Practice chapter-wise MCQs or calculate your final composite score (60:40) with our tools.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              to="/chapter-wise-mcq"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chapter-Wise MCQs</span>
            </Link>
            <Link
              to="/o-level-result-calculator"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
            >
              <Calculator className="w-4 h-4" />
              <span>Result Calculator</span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
