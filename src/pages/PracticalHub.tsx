import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Terminal,
  Cpu,
  FileText,
  Clock,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Layers,
  HelpCircle,
  Play,
  Filter,
  Monitor,
  Download
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getPracticalTests } from '../services/practicalService';
import { PracticalTestSet, PracticalModule } from '../types/practical';
import { NielitLogo } from '../components/NielitLogo';

export const PracticalHub: React.FC = () => {
  const [tests, setTests] = useState<PracticalTestSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  useEffect(() => {
    async function loadTests() {
      setLoading(true);
      const data = await getPracticalTests();
      setTests(data);
      setLoading(false);
    }
    loadTests();
  }, []);

  const filteredTests = selectedModule === 'all'
    ? tests
    : tests.filter((t) => t.module === selectedModule);

  const getModuleBadge = (mod: PracticalModule, paperCode: string) => {
    switch (mod) {
      case 'M3-R5':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <Terminal className="w-3.5 h-3.5" />,
          label: 'Python Programming (PR3)'
        };
      case 'M2-R5':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Code className="w-3.5 h-3.5" />,
          label: 'Web Designing (PR2)'
        };
      case 'M4-R5':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Cpu className="w-3.5 h-3.5" />,
          label: 'IoT & Arduino (PR4)'
        };
      default:
        return {
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <FileText className="w-3.5 h-3.5" />,
          label: 'IT Tools & Basics (PR1)'
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="O Level Practical Exam Simulator"
        description="Practice NIELIT O Level Practical exams (PR1 to PR4) with live Python compiler, Web design code runner, IoT simulation, Viva questions & solutions."
        keywords={[
          'Skilldotpy practical exam',
          'NIELIT O Level practical exam question paper',
          'O Level Python practical exam solutions',
          'O Level Web design practical exam code',
          'O Level IoT Arduino practical simulation',
          'O Level PR1 PR2 PR3 PR4 practice'
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Practical Exam Hub', url: '/practical-practice' }
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-blue-600/30 text-blue-300 font-bold px-3 py-1 rounded-full text-xs border border-blue-400/30">
                  <NielitLogo size="xs" className="h-3.5 invert" /> Official NIELIT R5.1 Pattern
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live Compiler & AI Viva Evaluation
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Practical Exam Practice <span className="text-blue-400">Lab Portal</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                Experience the authentic NIELIT Lab Examination environment with real-time in-browser code execution for <strong>Python (PR3)</strong>, <strong>Web Designing (PR2)</strong>, <strong>Arduino & IoT (PR4)</strong>, and <strong>IT Tools (PR1)</strong>.
              </p>
            </div>

            <button
              onClick={() => setShowInstructionsModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-sm self-start md:self-auto cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" /> Exam Rules & Marking Scheme
            </button>
          </div>

          {/* Key Exam Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-700/80">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 font-medium block">Total Marks</span>
              <span className="text-lg font-extrabold text-white">100 Marks</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 font-medium block">Coding Round</span>
              <span className="text-lg font-extrabold text-emerald-400">80 Marks (2 of 3)</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 font-medium block">Viva Voce Round</span>
              <span className="text-lg font-extrabold text-amber-400">20 Marks (4 Qs)</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] text-slate-400 font-medium block">Duration</span>
              <span className="text-lg font-extrabold text-blue-400">50 Minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Module Filter Tabs & Practical PDF Quick Download */}
        <div className="space-y-4 mb-8">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Need Solved Practical Programs in PDF?</h4>
                <p className="text-[11px] text-blue-200">Download verified Python scripts, Web Design code files & Arduino circuits with explanations.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <a
                href="/downloads/m3-r5-practical-codes.pdf"
                download="M3-R5-Python-Practical-Codes.pdf"
                className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              >
                <Download className="w-3 h-3" /> Python Codes PDF
              </a>
              <a
                href="/downloads/m2-r5-practical-codes.pdf"
                download="M2-R5-WebDesign-Practical-Codes.pdf"
                className="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              >
                <Download className="w-3 h-3" /> Web Codes PDF
              </a>
              <a
                href="/downloads/m4-r5-practical-codes.pdf"
                download="M4-R5-IoT-Arduino-Practical-Codes.pdf"
                className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              >
                <Download className="w-3 h-3" /> IoT Codes PDF
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-200 shadow-2xs overflow-x-auto">
              {[
                { id: 'all', label: 'All Practical Papers' },
                { id: 'M3-R5', label: 'PR3: Python Programming' },
                { id: 'M2-R5', label: 'PR2: Web Designing' },
                { id: 'M4-R5', label: 'PR4: IoT & Arduino' },
                { id: 'M1-R5', label: 'PR1: IT Tools & Basics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedModule(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedModule === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-gray-500 font-medium">
              Showing <strong>{filteredTests.length}</strong> Practical Exam Sets
            </span>
          </div>
        </div>

        {/* Test Cards Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 font-medium">Loading official practical sets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTests.map((test) => {
              const badge = getModuleBadge(test.module, test.paperCode);

              return (
                <div
                  key={test.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                        {badge.icon}
                        {badge.label} • {test.paperCode}
                      </span>
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                        100 Marks
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {test.title}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 mt-0.5">
                        {test.hindiTitle}
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {test.description}
                    </p>

                    {/* Question Summary Box */}
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                        Included Practical Tasks (Solve Any 2):
                      </span>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {test.questions.map((q) => (
                          <li key={q.id} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                              {q.number}
                            </span>
                            <span className="line-clamp-1">{q.title}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                        <span>+ {test.vivaQuestions.length} Viva Voce Questions (20 Marks)</span>
                        <span className="text-emerald-700 font-semibold">AI Grading Enabled</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.durationMinutes} Minutes</span>
                    </div>

                    <Link
                      to={`/practical-practice/${test.id}`}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                      <span>Start Practical Exam</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Instructions & Guidelines Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <NielitLogo size="xs" className="h-5" />
                <h3 className="text-base font-bold text-gray-900">NIELIT Practical Exam Guidelines</h3>
              </div>
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 space-y-1">
                <strong className="block font-bold">1. Structure of Practical Examination:</strong>
                <p>Total Examination Marks: <strong>100 Marks</strong> (Passing Requirement: 33%).</p>
                <p>• <strong>Part A (80 Marks):</strong> 3 Practical Coding Questions are given. The candidate is required to attempt <strong>ANY TWO</strong> questions (40 Marks each).</p>
                <p>• <strong>Part B (20 Marks):</strong> Viva Voce consisting of 3 to 4 conceptual questions.</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <strong className="text-gray-900 block font-bold">2. How to use the Interactive Workspace:</strong>
                <p>• <strong>Python (PR3):</strong> Type Python 3 code in the left editor and click "Run ▶" to execute in the in-browser WebAssembly terminal.</p>
                <p>• <strong>Web Designing (PR2):</strong> Switch between HTML, CSS, and JS tabs to build web interfaces with live real-time sandboxed preview.</p>
                <p>• <strong>IoT & Arduino (PR4):</strong> Write C++ Arduino sketches and interact with the virtual Uno board, push buttons, LDR darkness slider, and Serial Monitor.</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <strong className="text-gray-900 block font-bold">3. Viva Voce & Submission:</strong>
                <p>• After finishing the coding problems, click "Proceed to Viva". Type your concise answers in the provided fields and click "Final Submit".</p>
                <p>• The system uses AI to evaluate code logic, test cases, and viva conceptual clarity to generate an official NIELIT scorecard and grade.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                I Understand, Let's Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
