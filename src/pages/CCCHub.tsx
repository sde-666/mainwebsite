import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  BookOpen, 
  Download, 
  Smartphone, 
  Youtube, 
  Search, 
  CheckCircle2, 
  Keyboard, 
  Layers, 
  HelpCircle,
  FileText,
  Copy,
  Check,
  Sparkles,
  FileSpreadsheet,
  Presentation,
  Filter,
  X,
  Star,
  Monitor,
  Settings,
  Globe,
  Mail,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Share2
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { NielitLogo } from '../components/NielitLogo';
import { AdBanner } from '../components/AdBanner';
import { siteConfig } from '../data/config';
import { cccExamInfo, cccChapters, libreOfficeShortcutCheatSheet, LibreOfficeShortcut } from '../data/cccData';

export function CCCHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuite, setSelectedSuite] = useState<'All' | 'Writer' | 'Calc' | 'Impress'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyHighFrequency, setOnlyHighFrequency] = useState<boolean>(false);
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null);

  // Counts for tabs
  const writerCount = libreOfficeShortcutCheatSheet.filter(s => s.module.includes('Writer')).length;
  const calcCount = libreOfficeShortcutCheatSheet.filter(s => s.module.includes('Calc')).length;
  const impressCount = libreOfficeShortcutCheatSheet.filter(s => s.module.includes('Impress')).length;
  const highFreqCount = libreOfficeShortcutCheatSheet.filter(s => s.isHighFrequency).length;

  const categories = [
    'All',
    'Editing & Formatting',
    'Tables & Cells',
    'Formulas & Functions',
    'Slide Show & Objects',
    'Navigation',
    'Tools & Special',
    'File & Window'
  ];

  const filteredShortcuts = libreOfficeShortcutCheatSheet.filter((sc) => {
    // Module filter
    if (selectedSuite === 'Writer' && !sc.module.includes('Writer')) return false;
    if (selectedSuite === 'Calc' && !sc.module.includes('Calc')) return false;
    if (selectedSuite === 'Impress' && !sc.module.includes('Impress')) return false;

    // High frequency toggle
    if (onlyHighFrequency && !sc.isHighFrequency) return false;

    // Category filter
    if (selectedCategory !== 'All' && sc.category !== selectedCategory) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchShortcut = sc.shortcut.toLowerCase().includes(q);
      const matchDesc = sc.description.toLowerCase().includes(q);
      const matchHindi = sc.hindiDescription ? sc.hindiDescription.toLowerCase().includes(q) : false;
      const matchModule = sc.module.toLowerCase().includes(q);
      const matchCategory = sc.category.toLowerCase().includes(q);
      return matchShortcut || matchDesc || matchHindi || matchModule || matchCategory;
    }

    return true;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedShortcut(text);
    setTimeout(() => {
      setCopiedShortcut(null);
    }, 2000);
  };

  const getCccChapterIcon = (num: number) => {
    switch (num) {
      case 1: return <Monitor className="w-6 h-6 text-blue-600" />;
      case 2: return <Settings className="w-6 h-6 text-slate-700" />;
      case 3: return <FileText className="w-6 h-6 text-sky-600" />;
      case 4: return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
      case 5: return <Presentation className="w-6 h-6 text-amber-600" />;
      case 6: return <Globe className="w-6 h-6 text-indigo-600" />;
      case 7: return <Mail className="w-6 h-6 text-rose-600" />;
      case 8: return <CreditCard className="w-6 h-6 text-teal-600" />;
      case 9: return <ShieldCheck className="w-6 h-6 text-purple-600" />;
      default: return <BookOpen className="w-6 h-6 text-blue-600" />;
    }
  };

  const cccSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'NIELIT CCC (Course on Computer Concepts) Free Notes & Mock Test',
      description: 'Complete 80-hour NIELIT CCC syllabus, LibreOffice Writer Calc Impress shortcuts cheat sheet, digital financial services, and online CBT mock tests to score Grade S.',
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Skilldotpy',
        sameAs: siteConfig.url
      },
      educationalCredentialAwarded: 'NIELIT CCC Certificate',
      courseCode: 'NIELIT-CCC-80HR'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="NIELIT CCC Syllabus, Notes & Shortcuts"
        description="Crack NIELIT CCC exam with Grade S. 9 chapters syllabus breakdown, 100+ LibreOffice Writer/Calc shortcuts, free PDF notes & CBT mock tests."
        keywords={[
          'Skilldotpy CCC',
          'NIELIT CCC free notes PDF download',
          'CCC syllabus 2026 80 hours in Hindi',
          'LibreOffice shortcut keys in Hindi for CCC',
          'LibreOffice Writer Calc Impress shortcuts PDF',
          'CCC online mock test free 100 questions',
          'CCC exam passing marks and grading system',
          'CCC digital banking AEPS UPI questions',
          'CCC old question paper solved'
        ]}
        schema={cccSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'NIELIT CCC Hub', url: '/ccc' }
        ]}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950 text-white py-10 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-white px-4 py-2 rounded-2xl shadow-lg inline-flex items-center gap-3 border border-white/20">
                <NielitLogo size="sm" className="h-8" />
                <div className="h-6 w-px bg-gray-200"></div>
                <span className="text-xs font-bold text-slate-800 tracking-tight">CCC Exam Masterclass</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              NIELIT CCC (Course on Computer Concepts)
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Complete 80-hour syllabus study portal. Master computer fundamentals, LibreOffice, internet protocols, and digital finance to guarantee Grade S in your monthly CCC exam.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] sm:text-xs">
              <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                ⏱️ 90 Minutes Online Exam
              </span>
              <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                📝 100 MCQs + True/False
              </span>
              <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                🎯 50% Minimum Passing
              </span>
              <span className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                🏆 Grade S: 85%+ Marks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
        
        {/* Quick Anchor Navigation Strip */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-3.5 shadow-xs flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <a
            href="#study-notes"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-all shrink-0"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>1. Study Notes</span>
          </a>
          <a
            href="#chapter-mcqs"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>2. Chapter MCQs</span>
          </a>
          <Link
            to="/syllabus"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-all shrink-0"
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>3. View Syllabus</span>
          </Link>
          <a
            href="#shortcuts-section"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-all shrink-0"
          >
            <Keyboard className="w-4 h-4 text-purple-600" />
            <span>4. LibreOffice Shortcuts</span>
          </a>
          <Link
            to="/mock-test"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shrink-0 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>5. 100 CBT Mock Test</span>
          </Link>
        </div>

        {/* 4 Feature Gateway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5 flex flex-col justify-between hover:border-blue-300 transition-all group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-blue-600 transition-colors">CCC Chapter Notes</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                9 विस्तृत चैप्टर्स के थ्योरी नोट्स, डेफिनिशन, सिंटैक्स एवं LibreOffice उदाहरण।
              </p>
            </div>
            <Link to="/chapter-wise-notes/ccc" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-2">
              All 9 Chapters Notes →
            </Link>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5 flex flex-col justify-between hover:border-emerald-300 transition-all group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-emerald-600 transition-colors">Chapter-Wise MCQs</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                प्रत्येक चैप्टर के महत्वपूर्ण बहुविकल्पीय प्रश्न, तुरंत उत्तर जाँच व द्विभाषी व्याख्या।
              </p>
            </div>
            <Link to="/chapter-wise-mcq/ccc" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline pt-2">
              Practice 1-by-1 MCQs →
            </Link>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5 flex flex-col justify-between hover:border-amber-300 transition-all group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-amber-600 transition-colors">Official Syllabus & PDF</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                80 घंटे का आधिकारिक पाठ्यक्रम, 100 अंक मार्किंग स्कीम और ग्रेडिंग क्राइटेरिया।
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Link to="/syllabus" className="text-xs font-bold text-amber-600 hover:underline">
                View Syllabus →
              </Link>
              <a
                href="/downloads/ccc-syllabus.pdf"
                download="NIELIT-CCC-Official-Syllabus.pdf"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                title="Download PDF"
              >
                <Download className="w-3 h-3" /> PDF
              </a>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5 flex flex-col justify-between hover:border-purple-300 transition-all group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-purple-600 transition-colors">100 MCQ CBT Mock Test</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                90 मिनट का वास्तविक NIELIT CBT परीक्षा सिम्युलेटर, लाइव टाइमर और स्कोरकार्ड।
              </p>
            </div>
            <Link to="/mock-test" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline pt-2">
              Start CBT Mock Test →
            </Link>
          </div>
        </div>

        {/* =========================================================================
            1. FEATURED CHAPTER-WISE STUDY NOTES SECTION (LIKE O-LEVEL)
           ========================================================================= */}
        <section id="study-notes" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-black px-3.5 py-1 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>NIELIT CCC 80-Hour Official Lecture & Study Notes</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                CCC चैप्टरवाइज़ स्टडी नोट्स (Theory & LibreOffice)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                प्रत्येक चैप्टर के संपूर्ण थ्योरी नोट्स, डेफिनिशन, शॉर्टकट कीज एवं द्विभाषी व्याख्या। 1-क्लिक में अध्ययन प्रारंभ करें।
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/syllabus"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] shadow-2xs transition-colors"
              >
                View Syllabus
              </Link>
              <Link
                to="/chapter-wise-notes/ccc"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] shadow-2xs transition-colors"
              >
                All 9 Chapters Notes
              </Link>
            </div>
          </div>

          {/* 9-Chapter Graphic Card (Matching O-Level Style) */}
          <div className="bg-[#fef8ee] border border-[#f5debe] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Course on Computer Concepts (CCC)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    9 Chapters: Computer Basics, OS, Writer, Calc, Impress, Internet, E-mail, Digital Banking & Security
                  </p>
                </div>
                <span className="text-xs font-extrabold px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-900 shadow-2xs">
                  CCC 80-HRS
                </span>
              </div>

              {/* 9 Chapters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {cccChapters.map((ch) => (
                  <Link
                    key={ch.number}
                    to={`/notes/ccc/ccc-ch${ch.number}`}
                    className="bg-white hover:bg-amber-50/70 rounded-xl p-3.5 sm:p-4 border border-amber-200/80 shadow-2xs hover:shadow-xs hover:border-amber-400 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                    title={ch.title}
                  >
                    <div className="h-9 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      {getCccChapterIcon(ch.number)}
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-amber-700">
                      Chapter {ch.number}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium truncate max-w-full mt-0.5">
                      {ch.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-amber-200/60">
              <span className="text-xs font-semibold text-amber-900">
                💡 Tip: Click any chapter above to open online notes with code syntax & LibreOffice shortcuts.
              </span>
              <div className="flex items-center gap-2 justify-end">
                <Link
                  to="/syllabus"
                  className="px-4 py-2 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 font-bold text-xs shadow-2xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-notes/ccc"
                  className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-2xs transition-colors"
                >
                  Explore All Notes →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. FEATURED CHAPTER-WISE MCQS SECTION (LIKE O-LEVEL)
           ========================================================================= */}
        <section id="chapter-mcqs" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>NIELIT CCC Chapter-Wise Practice MCQ Bank</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                चैप्टरवाइज़ MCQs ऑनलाइन प्रैक्टिस (1-by-1 Questions)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                प्रत्येक चैप्टर के 50+ महत्वपूर्ण बहुविकल्पीय प्रश्न हल करें। तुरंत सही/गलत उत्तर जाँच, स्कोर ट्रैकिंग और हिंदी व्याख्या।
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/syllabus"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] shadow-2xs transition-colors"
              >
                View Syllabus
              </Link>
              <Link
                to="/chapter-wise-mcq/ccc"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-2xs transition-colors"
              >
                All 9 Chapters MCQs
              </Link>
            </div>
          </div>

          {/* 9-Chapter MCQ Graphic Card */}
          <div className="bg-[#f0f9f6] border border-[#cdeee1] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                    CCC 9-Chapter Instant MCQ Tests
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Select a chapter to begin targeted MCQ practice with instant result verification:
                  </p>
                </div>
                <span className="text-xs font-extrabold px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-900 shadow-2xs">
                  1000+ MCQs
                </span>
              </div>

              {/* 9 Chapters MCQ Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {cccChapters.map((ch) => (
                  <Link
                    key={ch.number}
                    to={`/chapter-wise-mcq/ccc/${ch.number}`}
                    className="bg-white hover:bg-emerald-50/70 rounded-xl p-3.5 sm:p-4 border border-emerald-200/80 shadow-2xs hover:shadow-xs hover:border-emerald-400 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                    title={`Practice Chapter ${ch.number} MCQs: ${ch.title}`}
                  >
                    <div className="h-9 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      {getCccChapterIcon(ch.number)}
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-emerald-700">
                      Chapter {ch.number}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium truncate max-w-full mt-0.5">
                      {ch.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-emerald-200/60">
              <span className="text-xs font-semibold text-emerald-900">
                🎯 Instant Score Tracker + Bilingual Hindi/English explanations enabled.
              </span>
              <div className="flex items-center gap-2 justify-end">
                <Link
                  to="/syllabus"
                  className="px-4 py-2 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 font-bold text-xs shadow-2xs transition-colors"
                >
                  View Syllabus
                </Link>
                <Link
                  to="/chapter-wise-mcq/ccc"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors"
                >
                  All 9 Chapters MCQs →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCHABLE & RESPONSIVE LIBREOFFICE SHORTCUT KEYS HUB */}
        <div id="shortcuts-section" className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-xs space-y-5 sm:space-y-6">
          
          {/* Header & Main Tabs */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full mb-1.5">
                  <Keyboard className="w-3.5 h-3.5 text-amber-700" />
                  <span>30%+ of CCC Exam Questions</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  LibreOffice Shortcut Keys Master Chart
                </h2>
                <p className="text-xs text-gray-500">
                  Complete official shortcuts for LibreOffice Writer, Calc & Impress in English & Hindi.
                </p>
              </div>

              {/* High Frequency Toggle Button */}
              <button
                type="button"
                onClick={() => setOnlyHighFrequency(!onlyHighFrequency)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  onlyHighFrequency
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${onlyHighFrequency ? 'fill-white text-white' : 'text-amber-600'}`} />
                <span>Top CCC MCQs Only ({highFreqCount})</span>
              </button>
            </div>

            {/* Suite Tabs (Writer, Calc, Impress) */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedSuite('All')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedSuite === 'All'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>All Suites</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/80 text-slate-700">
                  {libreOfficeShortcutCheatSheet.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSuite('Writer')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedSuite === 'Writer'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-white/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Writer</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedSuite === 'Writer' ? 'bg-blue-700 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {writerCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSuite('Calc')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedSuite === 'Calc'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-white/50'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                <span>Calc</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedSuite === 'Calc' ? 'bg-emerald-700 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {calcCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSuite('Impress')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedSuite === 'Impress'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-white/50'
                }`}
              >
                <Presentation className="w-3.5 h-3.5 shrink-0" />
                <span>Impress</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedSuite === 'Impress' ? 'bg-purple-700 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  {impressCount}
                </span>
              </button>
            </div>
          </div>

          {/* Search bar & Category Scrollbar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shortcut key or action (e.g., Ctrl+F2, Table, Superscript, Date, F5)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-slate-50/50 text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category horizontal pills scroll on mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                Showing <strong className="text-gray-900">{filteredShortcuts.length}</strong> of {libreOfficeShortcutCheatSheet.length} shortcuts
              </span>
              {(searchTerm || selectedSuite !== 'All' || selectedCategory !== 'All' || onlyHighFrequency) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSuite('All');
                    setSelectedCategory('All');
                    setOnlyHighFrequency(false);
                  }}
                  className="text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Reset all filters
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 1. MOBILE RESPONSIVE CARD-LIST VIEW (Visible on mobile/tablet < md) */}
          {/* ========================================================================= */}
          <div className="block md:hidden space-y-2.5">
            {filteredShortcuts.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                <Keyboard className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="text-sm font-bold text-gray-700">No shortcut keys found</p>
                <p className="text-xs text-gray-500">Try changing your search keyword or selected category</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSuite('All');
                    setSelectedCategory('All');
                    setOnlyHighFrequency(false);
                  }}
                  className="mt-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
                >
                  Show All Shortcuts
                </button>
              </div>
            ) : (
              filteredShortcuts.map((item, idx) => {
                const isWriter = item.module.includes('Writer');
                const isCalc = item.module.includes('Calc');
                const isImpress = item.module.includes('Impress');

                return (
                  <div
                    key={`${item.module}-${item.shortcut}-${idx}`}
                    className="p-3.5 bg-slate-50/70 hover:bg-amber-50/30 rounded-xl border border-gray-200 transition-all space-y-2.5"
                  >
                    {/* Top row: Module Pill, Category, High Frequency Star, Copy Button */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isWriter
                            ? 'bg-blue-100 text-blue-800'
                            : isCalc
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {item.module.replace('LibreOffice ', '')}
                        </span>

                        <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {item.category}
                        </span>

                        {item.isHighFrequency && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" /> CCC MCQ
                          </span>
                        )}
                      </div>

                      {/* Quick copy button */}
                      <button
                        type="button"
                        onClick={() => handleCopy(item.shortcut)}
                        title="Copy shortcut"
                        className="p-1.5 text-gray-400 hover:text-gray-700 bg-white rounded-lg border border-gray-200 active:scale-95 transition-all cursor-pointer shrink-0"
                      >
                        {copiedShortcut === item.shortcut ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Action Description */}
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 leading-snug">
                        {item.description}
                      </h4>
                      {item.hindiDescription && (
                        <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                          {item.hindiDescription}
                        </p>
                      )}
                    </div>

                    {/* Keyboard Keycaps */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {item.keys ? (
                        item.keys.map((k, ki) => (
                          <span key={ki} className="inline-flex items-center gap-1">
                            <kbd className="px-2 py-1 rounded bg-slate-900 text-amber-300 font-mono font-bold text-[11px] border border-slate-700 shadow-2xs">
                              {k}
                            </kbd>
                            {ki < item.keys.length - 1 && (
                              <span className="text-gray-400 font-bold text-xs">+</span>
                            )}
                          </span>
                        ))
                      ) : (
                        <kbd className="px-2 py-1 rounded bg-slate-900 text-amber-300 font-mono font-bold text-[11px] border border-slate-700 shadow-2xs">
                          {item.shortcut}
                        </kbd>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ========================================================================= */}
          {/* 2. DESKTOP STRUCTURED TABLE VIEW (Visible on desktop >= md) */}
          {/* ========================================================================= */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-gray-200">
                  <th className="py-3 px-4 w-36">Program</th>
                  <th className="py-3 px-4">Function / Action</th>
                  <th className="py-3 px-4 w-36">Category</th>
                  <th className="py-3 px-4 text-right w-56">Shortcut Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredShortcuts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                      No shortcut keys match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredShortcuts.map((item, idx) => {
                    const isWriter = item.module.includes('Writer');
                    const isCalc = item.module.includes('Calc');

                    return (
                      <tr key={idx} className="hover:bg-amber-50/40 transition-colors group">
                        {/* Program / Module */}
                        <td className="py-3 px-4 font-semibold text-gray-900 align-top">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                            isWriter
                              ? 'bg-blue-100 text-blue-800'
                              : isCalc
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {item.module.replace('LibreOffice ', '')}
                          </span>
                        </td>

                        {/* Description English + Hindi */}
                        <td className="py-3 px-4 align-top">
                          <div className="flex items-start gap-1.5">
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                <span>{item.description}</span>
                                {item.isHighFrequency && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" /> CCC MCQ
                                  </span>
                                )}
                              </div>
                              {item.hindiDescription && (
                                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                                  {item.hindiDescription}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-gray-500 font-medium align-top">
                          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        </td>

                        {/* Keycap Badge with Copy Action */}
                        <td className="py-3 px-4 text-right align-top">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <div className="flex items-center gap-1">
                              {item.keys ? (
                                item.keys.map((k, ki) => (
                                  <span key={ki} className="inline-flex items-center gap-1">
                                    <kbd className="px-2 py-1 rounded bg-slate-900 text-amber-300 font-mono font-bold text-xs border border-slate-700 shadow-2xs">
                                      {k}
                                    </kbd>
                                    {ki < item.keys.length - 1 && (
                                      <span className="text-gray-400 font-bold text-xs">+</span>
                                    )}
                                  </span>
                                ))
                              ) : (
                                <kbd className="px-2.5 py-1 rounded bg-slate-900 text-amber-400 font-mono font-bold text-xs border border-slate-700 shadow-2xs">
                                  {item.shortcut}
                                </kbd>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopy(item.shortcut)}
                              title="Copy shortcut"
                              className="p-1 text-gray-300 group-hover:text-gray-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            >
                              {copiedShortcut === item.shortcut ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CCC HUB SPONSOR BANNER */}
        <div className="pt-6">
          <AdBanner slotId="ccc-shortcuts-bottom" format="horizontal" fallbackType="mock-test" />
        </div>

      </div>
    </div>
  );
}

