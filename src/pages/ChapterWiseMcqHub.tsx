import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles,
  Monitor, 
  Settings, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Globe, 
  Layout, 
  Type, 
  Code, 
  Smartphone, 
  Terminal, 
  Image as ImageIcon,
  Cpu, 
  GitBranch, 
  Calculator, 
  Database, 
  Cloud, 
  Wifi, 
  ShieldCheck, 
  Users, 
  Activity,
  Layers,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Zap,
  Mail,
  CreditCard,
  Package,
  FileCode
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { chapterMcqService } from '../services/chapterMcqService';
import { ChapterMeta } from '../types/chapterMcq';

interface PaperVisualConfig {
  id: 'm1-r5' | 'm2-r5' | 'm3-r5' | 'm4-r5' | 'ccc';
  title: string;
  shortCode: string;
  courseUrl: string;
  cardBg: string;
  cardBorder: string;
  chapters: {
    num: number;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function ChapterWiseMcqHub() {
  const navigate = useNavigate();
  const [selectedExamType, setSelectedExamType] = useState<'o-level' | 'ccc'>('o-level');
  const [chapterCounts, setChapterCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const unsub = chapterMcqService.subscribe((items) => {
      const counts: { [key: string]: number } = {};
      items.forEach((item) => {
        const key = `${item.moduleId}-${item.chapterNumber}`;
        counts[key] = (counts[key] || 0) + 1;
      });
      setChapterCounts(counts);
    });
    return () => unsub();
  }, []);

  const papersConfig: PaperVisualConfig[] = [
    // 1. IT Tools and Network Basics (M1-R5.1) - 6 Featured Chapters in Grid
    {
      id: 'm1-r5',
      title: 'IT Tools and Network Basics',
      shortCode: 'M1-R5.1',
      courseUrl: '/o-level/m1-r5',
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

    // 2. Web Designing and Publishing (M2-R5.1) - 6 Featured Chapters in Grid
    {
      id: 'm2-r5',
      title: 'Web Designing and Publishing',
      shortCode: 'M2-R5.1',
      courseUrl: '/o-level/m2-r5',
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

    // 3. Python Programming (M3-R5.1) - 6 Featured Chapters in Grid
    {
      id: 'm3-r5',
      title: 'Python Programming',
      shortCode: 'M3-R5.1',
      courseUrl: '/o-level/m3-r5',
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

    // 4. Internet of Things (IOT) (M4-R5.1) - 6 Chapters
    {
      id: 'm4-r5',
      title: 'Internet of Things (IOT)',
      shortCode: 'M4-R5.1',
      courseUrl: '/o-level/m4-r5',
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

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      <SEO
        title="O Level Chapterwise MCQs | Skilldotpy"
        description="Practice NIELIT O Level (M1-R5.1, M2-R5.1, M3-R5.1, M4-R5.1) and CCC MCQs chapter-by-chapter with instant answer verification, score tracker, and detailed explanations."
        canonicalUrl="/chapter-wise-mcq"
      />

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        
        {/* Main Title */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            O Level <span className="text-[#f43f5e]">Chapterwise MCQs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2 max-w-2xl mx-auto">
            Select any chapter across all 4 NIELIT O Level modules or CCC to practice questions one by one with instant answer verification, bilingual explanations, and accuracy tracking.
          </p>

          {/* Quick Filter Pill */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              onClick={() => setSelectedExamType('o-level')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedExamType === 'o-level'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              NIELIT O Level (4 Papers • 32 Chapters)
            </button>
            <button
              onClick={() => setSelectedExamType('ccc')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedExamType === 'ccc'
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              NIELIT CCC (9 Chapters)
            </button>
          </div>
        </div>

        {/* =========================================================================
            O LEVEL 4-PAPER GRAPHIC GRID
           ========================================================================= */}
        {selectedExamType === 'o-level' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {papersConfig.map((paper) => (
              <div
                key={paper.id}
                className={`${paper.cardBg} ${paper.cardBorder} border rounded-2xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between`}
              >
                <div>
                  {/* Paper Card Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {paper.title}
                    </h2>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                      {paper.shortCode}
                    </span>
                  </div>

                  {/* 6 Chapter Grid (3 Columns x 2 Rows) */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                    {paper.chapters.map((ch) => {
                      const countKey = `${paper.id}-${ch.num}`;
                      const count = chapterCounts[countKey] || 0;

                      return (
                        <Link
                          key={ch.num}
                          to={`/chapter-wise-mcq/${paper.id}/${ch.num}`}
                          className="bg-white hover:bg-blue-50/50 rounded-xl p-3 sm:p-4 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                          title={`${ch.title} - Click to practice MCQs`}
                        >
                          <div className="h-10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                            {ch.icon}
                          </div>
                          <span className="text-xs sm:text-[13px] font-semibold text-slate-800 group-hover:text-blue-600">
                            Chapter {ch.num}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <Link
                    to={paper.courseUrl}
                    className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    View Course
                  </Link>

                  <Link
                    to={`/chapter-wise-mcq/${paper.id}`}
                    className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    All Chapters
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* =========================================================================
              CCC SECTION (9 CHAPTERS GRAPHIC CARD)
             ========================================================================= */
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#f0f4ff] border border-[#d2defa] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Course on Computer Concepts (CCC)
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Complete 9-Chapter instant MCQ practice covering LibreOffice Writer/Calc/Impress, Operating Systems, Digital Financial Tools & Cyber Security.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-600 text-white rounded-full">
                  CCC 2026
                </span>
              </div>

              {/* 9 Chapters Grid for CCC */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {[
                  { num: 1, title: 'Intro to Computer', icon: <Monitor className="w-6 h-6 text-indigo-600" /> },
                  { num: 2, title: 'Operating System', icon: <Settings className="w-6 h-6 text-slate-700" /> },
                  { num: 3, title: 'Word Processing (Writer)', icon: <FileText className="w-6 h-6 text-sky-600" /> },
                  { num: 4, title: 'Spreadsheet (Calc)', icon: <FileSpreadsheet className="w-6 h-6 text-emerald-600" /> },
                  { num: 5, title: 'Presentation (Impress)', icon: <Presentation className="w-6 h-6 text-amber-600" /> },
                  { num: 6, title: 'Internet & WWW', icon: <Globe className="w-6 h-6 text-blue-600" /> },
                  { num: 7, title: 'E-mail & e-Governance', icon: <Mail className="w-6 h-6 text-rose-600" /> },
                  { num: 8, title: 'Digital Financial Tools', icon: <CreditCard className="w-6 h-6 text-purple-600" /> },
                  { num: 9, title: 'FutureSkills & Security', icon: <ShieldCheck className="w-6 h-6 text-teal-600" /> },
                ].map((ch) => (
                  <Link
                    key={ch.num}
                    to={`/chapter-wise-mcq/ccc/${ch.num}`}
                    className="bg-white hover:bg-indigo-50/60 rounded-xl p-3 sm:p-4 border border-slate-200 shadow-2xs hover:shadow-sm hover:border-indigo-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                  >
                    <div className="h-8 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      {ch.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                      Chapter {ch.num}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium truncate max-w-full">
                      {ch.title}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  to="/ccc"
                  className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  View CCC Course
                </Link>

                <Link
                  to="/chapter-wise-mcq/ccc"
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  All 9 Chapters
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  );
}
