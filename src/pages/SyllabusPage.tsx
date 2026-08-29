import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Layers, 
  Globe, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  GraduationCap,
  Clock,
  Award
} from 'lucide-react';
import { SEO } from '../components/SEO';

export function SyllabusPage() {
  const syllabusCards = [
    {
      code: 'M1-R5.1',
      title: 'Information Technology Tools and Network Basics',
      hindiTitle: 'आईटी टूल्स एवं नेटवर्क बेसिक्स',
      description: 'Introduction to Computer, OS, LibreOffice Suite (Writer, Calc, Impress), Internet & WWW, E-mail & Digital Financial Tools.',
      theoryHours: 48,
      labHours: 72,
      totalHours: 120,
      marks: '100 (Theory) + 100 (Practical PR1)',
      weightage: '60:40 (Theory : Practical)',
      pdfUrl: '/downloads/m1-r5-syllabus.pdf',
      notesUrl: '/chapter-wise-notes/m1-r5',
      mcqUrl: '/chapter-wise-mcq/m1-r5',
      color: 'from-blue-600 to-indigo-700',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Layers,
      topics: [
        'Introduction to Computer & Evolution',
        'Operating Systems (GUI & CLI concepts)',
        'Word Processing using LibreOffice Writer',
        'Spreadsheet manipulation in LibreOffice Calc',
        'Presentation Creation in LibreOffice Impress',
        'Introduction to Internet, WWW and Web Browsing',
        'E-mail, Social Networking & e-Governance',
        'Digital Financial Tools & Applications (UPI, AEPS, USSD)',
        'Overview of FutureSkills & Cyber Security'
      ]
    },
    {
      code: 'M2-R5.1',
      title: 'Web Designing and Publishing',
      hindiTitle: 'वेब डिजाइनिंग एवं पब्लिशिंग',
      description: 'HTML5 Semantic Elements, CSS3, Responsive Design (W3.CSS/Bootstrap), JavaScript Basics, Photo Editing & Web Publishing.',
      theoryHours: 48,
      labHours: 72,
      totalHours: 120,
      marks: '100 (Theory) + 100 (Practical PR2)',
      weightage: '60:40 (Theory : Practical)',
      pdfUrl: '/downloads/m2-r5-syllabus.pdf',
      notesUrl: '/chapter-wise-notes/m2-r5',
      mcqUrl: '/chapter-wise-mcq/m2-r5',
      color: 'from-sky-600 to-blue-800',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: Globe,
      topics: [
        'Introduction to Web Design & Client-Server Architecture',
        'HTML & Text Editors (VS Code, Notepad++)',
        'HTML5 Semantic Elements & Media Integration',
        'Cascading Style Sheets (CSS3 Selectors, Box Model)',
        'Responsive Design using CSS Frameworks (W3.CSS)',
        'JavaScript Language Basics & Event Handling',
        'Photo Editor Tools & Web Graphics Optimization',
        'Web Publishing, Hosting & FTP Protocols'
      ]
    },
    {
      code: 'M3-R5.1',
      title: 'Programming and Problem Solving Through Python',
      hindiTitle: 'पायथन प्रोग्रामिंग एवं प्रॉब्लम सॉल्विंग',
      description: 'Algorithms & Flowcharts, Python Syntax, Operators, Control Flow, Lists/Tuples/Dictionaries, Functions & NumPy.',
      theoryHours: 48,
      labHours: 72,
      totalHours: 120,
      marks: '100 (Theory) + 100 (Practical PR3)',
      weightage: '60:40 (Theory : Practical)',
      pdfUrl: '/downloads/m3-r5-syllabus.pdf',
      notesUrl: '/chapter-wise-notes/m3-r5',
      mcqUrl: '/chapter-wise-mcq/m3-r5',
      color: 'from-emerald-600 to-teal-800',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Terminal,
      topics: [
        'Introduction to Programming & Algorithms',
        'Flowcharts and Decision Structures',
        'Python Syntax, Variables & Basic I/O',
        'Operators, Expressions and Conditional Statements',
        'Loops (for, while, nested loops)',
        'Sequence Data Types: Lists, Tuples, Dictionaries & Sets',
        'Functions, Scope & Recursion',
        'File Handling in Python (read, write, append)',
        'NumPy Basics for Scientific Computing'
      ]
    },
    {
      code: 'M4-R5.1',
      title: 'Internet of Things (IoT) and its Applications',
      hindiTitle: 'इंटरनेट ऑफ थिंग्स (IoT)',
      description: 'IoT Architecture, Sensors & Actuators, Arduino Uno C/C++ Programming, IoT Protocols, Cyber Security & Soft Skills.',
      theoryHours: 48,
      labHours: 72,
      totalHours: 120,
      marks: '100 (Theory) + 100 (Practical PR4)',
      weightage: '60:40 (Theory : Practical)',
      pdfUrl: '/downloads/m4-r5-syllabus.pdf',
      notesUrl: '/chapter-wise-notes/m4-r5',
      mcqUrl: '/chapter-wise-mcq/m4-r5',
      color: 'from-purple-600 to-indigo-800',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Cpu,
      topics: [
        'Introduction to IoT - Sensors, Actuators & Microcontrollers',
        'Things and Connections in IoT Networks',
        'Sensors, Actuators and Microcontrollers Integration',
        'Building IoT Applications with Arduino Uno',
        'Security Aspects in IoT Devices',
        'Soft Skills, Communication & Personality Development'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <SEO
        title="NIELIT O Level & CCC Official Syllabus PDF Downloads | Skilldotpy"
        description="Download official NIELIT R5.1 Syllabus PDF for all 4 papers (M1-R5.1, M2-R5.1, M3-R5.1, M4-R5.1) and CCC. Complete marks weightage and topic outlines."
        canonicalUrl="/syllabus"
      />

      {/* =========================================================================
          TOP HERO HEADER
         ========================================================================= */}
      <section className="bg-slate-900 text-white pt-10 sm:pt-14 pb-14 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-black px-3.5 py-1.5 rounded-full mb-4 border border-amber-400/30 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NIELIT Revised Syllabus R5.1 Official Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            NIELIT O Level & CCC Syllabus
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
            आधिकारिक NIELIT R5.1 के चारों पेपर्स का विस्तृत सिलेबस डाउनलोड करें। थ्योरी, प्रैक्टिकल और 60:40 मार्किंग स्कीम के साथ।
          </p>

          {/* Quick PDF Download Buttons Strip */}
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <a
              href="/downloads/o-level-r5-syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Full O-Level R5.1 Syllabus PDF</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href="/downloads/ccc-syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>CCC 80-Hrs Syllabus PDF</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4 PAPERS SYLLABUS CARDS GRID
         ========================================================================= */}
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Paper-Wise Official Syllabus & PDFs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Click "Download Syllabus PDF" on any paper below to view the official curriculum in a new tab.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {syllabusCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.code}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Bar: Paper Code & Icon */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
                        <Icon className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${card.badgeBg}`}>
                          {card.code}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 tracking-tight">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/50 mb-4">
                    {card.hindiTitle}
                  </p>

                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Hours & Marks Metric Pill Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Duration:</span>
                      <span className="font-bold text-slate-800">{card.totalHours} Hours ({card.theoryHours}h + {card.labHours}h)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Marks & Ratio:</span>
                      <span className="font-bold text-slate-800">{card.weightage}</span>
                    </div>
                  </div>

                  {/* Topics Covered Preview */}
                  <div className="mb-6">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Key Curriculum Modules:
                    </span>
                    <ul className="space-y-1.5 pl-3 text-xs text-slate-600 list-disc marker:text-blue-500">
                      {card.topics.slice(0, 5).map((topic, i) => (
                        <li key={i} className="line-clamp-1">{topic}</li>
                      ))}
                      {card.topics.length > 5 && (
                        <li className="text-[11px] text-slate-400 font-medium list-none -ml-3 pt-0.5">
                          +{card.topics.length - 5} more detailed topics in official PDF
                        </li>
                      )}
                    </ul>
                  </div>

                </div>

                {/* Bottom Row Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  
                  {/* Primary Download Button (Opens in New Tab) */}
                  <a
                    href={card.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer group"
                  >
                    <Download className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Download Syllabus PDF</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {/* Secondary Notes Link */}
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      to={card.mcqUrl}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      MCQs
                    </Link>
                    <Link
                      to={card.notesUrl}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] shadow-2xs transition-colors"
                    >
                      Read Notes →
                    </Link>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* CCC Syllabus Card */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl border border-amber-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
              CCC 80-Hours Curriculum
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2">
              NIELIT CCC (Course on Computer Concepts) Full Syllabus
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Complete official syllabus for CCC covering Computer Fundamentals, LibreOffice (Writer, Calc, Impress), Internet, Cyber Security & Digital Banking.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href="/downloads/ccc-syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CCC PDF</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            <Link
              to="/chapter-wise-mcq/ccc"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-xs sm:text-sm shadow-2xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>CCC MCQs</span>
            </Link>
            <Link
              to="/chapter-wise-notes/ccc"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold text-xs sm:text-sm shadow-2xs transition-all"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>CCC Notes</span>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
