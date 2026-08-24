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
  Star
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
        title="NIELIT CCC Syllabus, Notes & LibreOffice Guide"
        description="Crack NIELIT CCC exam in 15 days with Grade S. Complete 9 chapters syllabus breakdown, 100+ searchable LibreOffice Writer/Calc/Impress shortcuts table, free PDF notes & CBT mock test by Skilldotpy."
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
        
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">CCC Chapter Notes</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Read all 9 chapter notes online with key formulas, shortcut keys & exam tips.
              </p>
            </div>
            <Link to="/notes" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-2">
              Read Online Notes →
            </Link>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">CCC Online Mock Test</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Practice real 100-question computer-based mock tests with live scoring & countdown.
              </p>
            </div>
            <Link to="/mock-test" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline pt-2">
              Start Free CBT Test →
            </Link>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">Official Syllabus PDF</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Download the official NIELIT 80-hour course outline with chapter distributions.
              </p>
            </div>
            <a
              href="/downloads/ccc-syllabus.pdf"
              download="NIELIT-CCC-Official-Syllabus.pdf"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline pt-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Syllabus PDF →</span>
            </a>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">Skilldotpy CCC Batch</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Complete crash course with 500+ repeated questions, PDF notes and video lessons.
              </p>
            </div>
            <Link to="/app" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline pt-2">
              Enroll via App →
            </Link>
          </div>
        </div>

        {/* 9 CHAPTERS SYLLABUS LIST */}
        <div id="syllabus" className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full inline-block">
                Full 80-Hour Syllabus Breakdown
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                NIELIT CCC All 9 Chapters in Detail
              </h2>
              <p className="text-xs text-gray-500">
                Official chapter-wise topic breakdown covering computer basics, LibreOffice suite, internet & digital finance.
              </p>
            </div>
            
            <a
              href="/downloads/ccc-syllabus.pdf"
              download="NIELIT-CCC-Official-Syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-2xs shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Syllabus PDF</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cccChapters.map((chap) => (
              <div
                key={chap.number}
                className="p-5 rounded-2xl bg-slate-50/80 border border-gray-200/90 flex flex-col justify-between hover:border-blue-300 hover:bg-white transition-all shadow-2xs group"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {chap.number}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{chap.title}</h3>
                  </div>
                  <p className="text-[11px] font-semibold text-amber-700 mb-2.5 pl-0.5">{chap.hindiTitle}</p>
                  
                  <ul className="text-xs text-gray-600 space-y-1.5 pl-4 list-disc marker:text-amber-500">
                    {chap.topics.slice(0, 4).map((top, i) => (
                      <li key={i} className="line-clamp-1">{top}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                  <Link
                    to="/notes/ccc"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Read Notes →</span>
                  </Link>
                  <Link
                    to="/mock-test"
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-900"
                  >
                    MCQ Test →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

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

