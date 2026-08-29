import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Smartphone, 
  Layers, 
  Laptop, 
  CheckCircle2, 
  FileText, 
  Search, 
  GraduationCap,
  Calculator,
  BookOpen
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { oLevelModules, OLevelModule } from '../data/oLevelData';
import { AdBanner } from '../components/AdBanner';

export function OLevelHub() {
  const { moduleId } = useParams<{ moduleId?: string }>();
  const navigate = useNavigate();

  // Normalize active module ID
  const getInitialModuleId = () => {
    if (!moduleId) return 'm1-r5';
    const cleaned = moduleId.toLowerCase().replace('.', '-');
    if (cleaned.includes('m1')) return 'm1-r5';
    if (cleaned.includes('m2')) return 'm2-r5';
    if (cleaned.includes('m3')) return 'm3-r5';
    if (cleaned.includes('m4')) return 'm4-r5';
    if (cleaned.includes('practic')) return 'practicals';
    if (cleaned.includes('project')) return 'projects';
    return 'm1-r5';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialModuleId());
  const [chapterSearch, setChapterSearch] = useState('');

  // Sync state when URL param changes
  useEffect(() => {
    if (moduleId) {
      const target = getInitialModuleId();
      setActiveTab(target);
    }
  }, [moduleId]);

  const currentModule: OLevelModule = oLevelModules.find(m => m.id === activeTab) || oLevelModules[0];

  // Switch tab and optionally update URL
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'practicals' || tabId === 'projects') {
      navigate(`/o-level`);
    } else {
      navigate(`/o-level/${tabId}`);
    }
  };

  const filteredChapters = currentModule.chapters.filter(ch => 
    ch.title.toLowerCase().includes(chapterSearch.toLowerCase()) ||
    (ch.hindiTitle && ch.hindiTitle.includes(chapterSearch)) ||
    ch.topics.some(t => t.toLowerCase().includes(chapterSearch.toLowerCase()))
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO 
        title={`${currentModule.code}: ${currentModule.shortName} Notes & Syllabus`}
        description={`NIELIT O Level ${currentModule.code} (${currentModule.shortName}) complete study hub: Syllabus, chapter-wise notes, and marks weightage distribution.`}
        keywords={[
          `NIELIT O level ${currentModule.code}`,
          `${currentModule.shortName} syllabus pdf`,
          `${currentModule.code} chapter wise notes`,
          'Skilldotpy NIELIT O level',
          'O Level R5.1 marks distribution'
        ]}
      />

      {/* =========================================================================
          TOP BAR / HERO: NIELIT O Level Study Hub with Module Filter Buttons
         ========================================================================= */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-6 sm:py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                  NIELIT R5.1 Official Curriculum
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                  NSQF Level 4
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                NIELIT O Level Study Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Official syllabus, unit marks distribution, and chapter-wise study notes for theory and practical exams.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                to="/o-level-result-calculator"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors ring-2 ring-blue-400/30"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Result Calculator</span>
              </Link>
              <Link
                to="/mock-test"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CBT Mock Test</span>
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Get App</span>
              </Link>
            </div>
          </div>

          {/* Module-Wise Filter Buttons Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {oLevelModules.map((m) => {
              const isActive = activeTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleTabChange(m.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 ring-2 ring-blue-400/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {m.code.split('.')[0]}
                  </span>
                  <span>{m.shortName}</span>
                </button>
              );
            })}

            <button
              onClick={() => handleTabChange('practicals')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'practicals'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-indigo-400" />
              <span>Practical Labs</span>
            </button>

            <button
              onClick={() => handleTabChange('projects')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Project (PJ1)</span>
            </button>

            <Link
              to="/o-level-result-calculator"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer bg-emerald-700/80 text-white hover:bg-emerald-600 border border-emerald-500/50"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-200" />
              <span>Marks (60:40)</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          MAIN CLEAN CONTENT: 1. SYLLABUS DIV -> 2. CHAPTER WISE NOTES
         ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* =========================================================================
            DIV 1: SYLLABUS & MARKS WEIGHTAGE
           ========================================================================= */}
        {activeTab !== 'practicals' && activeTab !== 'projects' && (
          <section id="syllabus" className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
            
            {/* Header with Title & Download */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {currentModule.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {currentModule.weightage}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  {currentModule.title} — Syllabus & Marks Weightage
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official unit-wise marks allocation for {currentModule.code} CBT Theory Exam (100 Marks).
                </p>
              </div>

              <a
                href={currentModule.syllabusPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official Syllabus PDF</span>
              </a>
            </div>

            {/* Marks Distribution Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/80 text-slate-700 font-extrabold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Unit / Module Chapters</th>
                    <th className="py-2.5 px-4 text-right w-40">Written Exam Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentModule.marksDistribution.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        {item.unit}
                      </td>
                      <td className="py-2.5 px-4 text-right font-extrabold text-blue-700">
                        {item.writtenMarks} Marks
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50/60 font-black text-slate-900 border-t-2 border-blue-200">
                    <td className="py-2.5 px-4">Total CBT Theory Exam Marks</td>
                    <td className="py-2.5 px-4 text-right text-blue-900 font-black">100 Marks (100 MCQs)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Exam Highlights Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Duration</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">2 Hours (120 Mins)</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Passing Marks</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Min. 33% (33/100)</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Final Weightage</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">60% Theory + 40% Practical</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total Hours</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{currentModule.totalTheoryHours}h Theory + {currentModule.totalPracticalHours}h Lab</p>
              </div>
            </div>

          </section>
        )}

        {/* =========================================================================
            DIV 2: CHAPTER-WISE NOTES
           ========================================================================= */}
        {activeTab !== 'practicals' && activeTab !== 'projects' && (
          <section id="notes" className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    Chapter Notes
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Chapter-Wise Study Notes ({currentModule.chapters.length} Chapters)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select any chapter to read structured lecture notes, key definitions, and bilingual explanations.
                </p>
              </div>

              {/* Search Chapters */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chapter title or topics..."
                  value={chapterSearch}
                  onChange={(e) => setChapterSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Chapter Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChapters.map((chap) => {
                const chapterSlug = `${currentModule.id.replace('-r5', '')}-ch${chap.number}`;
                const notesUrl = `/notes/${currentModule.id}/${chapterSlug}`;

                return (
                  <div
                    key={chap.number}
                    className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/90 p-4 transition-all hover:shadow-md hover:border-blue-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                          Chapter {chap.number}
                        </span>
                        {chap.marksWeightage && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            {chap.marksWeightage}
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                        {chap.title}
                      </h4>
                      {chap.hindiTitle && (
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {chap.hindiTitle}
                        </p>
                      )}

                      {/* Topic Highlights */}
                      <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Key Topics Covered:
                        </span>
                        <ul className="text-xs text-slate-600 space-y-1">
                          {chap.topics.slice(0, 3).map((topic, tidx) => (
                            <li key={tidx} className="flex items-start gap-1.5 line-clamp-1">
                              <span className="text-blue-500 font-bold">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                          {chap.topics.length > 3 && (
                            <li className="text-[11px] text-slate-400 font-medium">
                              +{chap.topics.length - 3} more topics in reader
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {chap.theoryHours}h Theory • {chap.practicalHours}h Lab
                      </span>
                      <Link
                        to={notesUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Read Chapter Notes →</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredChapters.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                No chapters found matching "{chapterSearch}".
              </div>
            )}

          </section>
        )}

        {/* -------------------------------------------------------------------------
            STANDALONE VIEW: PRACTICAL EXAM HUB (PR1 to PR4)
           ------------------------------------------------------------------------- */}
        {activeTab === 'practicals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                NIELIT O Level Practical Examination (PR1, PR2, PR3, PR4)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Each practical paper carries 100 Marks (80 Marks Lab Problem Solving + 20 Marks Viva Voce). Minimum 33% is mandatory in practicals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">PR1-R5</span>
                  <h4 className="font-extrabold text-base text-slate-900 mt-2">IT Tools & Network Basics Lab</h4>
                  <p className="text-xs text-slate-500 mt-1">LibreOffice Writer mail merge, Calc formulas & Impress slide templates.</p>
                </div>
                <Link to="/practical-practice/pr1-it-1" className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">
                  <span>Open PR1 Practical Lab →</span>
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">PR2-R5</span>
                  <h4 className="font-extrabold text-base text-slate-900 mt-2">Web Design & Publishing Live Editor</h4>
                  <p className="text-xs text-slate-500 mt-1">HTML5 forms, CSS3 responsive grid layouts & JavaScript DOM manipulation.</p>
                </div>
                <Link to="/practical-practice/pr2-web-1" className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                  <span>Open PR2 Web Editor →</span>
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">PR3-R5</span>
                  <h4 className="font-extrabold text-base text-slate-900 mt-2">Python Programming Online Compiler</h4>
                  <p className="text-xs text-slate-500 mt-1">Algorithms, String manipulation, Lists, Tuples, Dictionaries & NumPy arrays.</p>
                </div>
                <Link to="/practical-practice/pr3-python-1" className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                  <span>Open Python IDE →</span>
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">PR4-R5</span>
                  <h4 className="font-extrabold text-base text-slate-900 mt-2">Internet of Things (IoT) Simulator</h4>
                  <p className="text-xs text-slate-500 mt-1">Arduino sketches, sensor interfacing, actuator control & serial monitor.</p>
                </div>
                <Link to="/practical-practice/pr4-iot-1" className="mt-4 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl">
                  <span>Open IoT Simulator →</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            STANDALONE VIEW: MANDATORY FINAL PROJECT (PJ1-R5)
           ------------------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                PJ1-R5.1 • Mandatory
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                NIELIT O Level Final Project Submission Guide
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Every candidate must submit a real-world software/hardware project synopsis and complete source code to receive the O Level Diploma Certificate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-blue-700">1. Eligibility</span>
                <p className="text-xs text-slate-600">Candidate must appear in or clear at least 2 theory modules before submitting project synopsis.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-emerald-700">2. Fee & Portal</span>
                <p className="text-xs text-slate-600">Project fee of ₹100 is submitted online via NIELIT Student Portal (student.nielit.gov.in).</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-purple-700">3. Expert Help</span>
                <p className="text-xs text-slate-600">Skilldotpy provides complete approved project source code, synopsis report, and viva guidance.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs"
              >
                <Smartphone className="w-4 h-4" />
                <span>Get Approved Project Source Code in App →</span>
              </Link>
            </div>
          </div>
        )}

        {/* Non-intrusive Ad Banner */}
        <AdBanner slotId="olevel-bottom-banner" format="horizontal" fallbackType="calculator" />

      </main>

    </div>
  );
}

