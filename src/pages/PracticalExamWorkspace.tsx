import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  RotateCcw,
  Sparkles,
  Award,
  Send,
  Loader2,
  BookOpen,
  FileCheck,
  ChevronRight,
  Printer,
  Eye,
  EyeOff,
  Columns,
  Maximize,
  Minimize,
  PanelLeftClose,
  PanelLeftOpen,
  FileText
} from 'lucide-react';
import { getPracticalTestById, evaluatePracticalExam, submitPracticalExam } from '../services/practicalService';
import { PracticalTestSet, PracticalScorecard } from '../types/practical';
import { PythonEditor } from '../components/practical/PythonEditor';
import { WebEditor } from '../components/practical/WebEditor';
import { ArduinoEditor } from '../components/practical/ArduinoEditor';
import { GeneralEditor } from '../components/practical/GeneralEditor';
import { AiCodeAssistantModal } from '../components/practical/AiCodeAssistantModal';
import { NielitLogo } from '../components/NielitLogo';
import { Bot } from 'lucide-react';

type QuestionPanelSize = 'hidden' | 'compact' | 'normal' | 'wide';

export const PracticalExamWorkspace: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<PracticalTestSet | null>(null);
  const [loading, setLoading] = useState(true);

  // Exam Workflow State: 'coding' | 'viva' | 'scorecard'
  const [examStep, setExamStep] = useState<'coding' | 'viva' | 'scorecard'>('coding');

  // Active coding question index (0, 1, 2)
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Question Sidebar Sizing & Visibility State
  const [questionPanelSize, setQuestionPanelSize] = useState<QuestionPanelSize>('normal');

  // Student Answers & Code per Question
  const [questionFiles, setQuestionFiles] = useState<{ [qId: string]: { [filename: string]: string } }>({});
  const [questionLogs, setQuestionLogs] = useState<{ [qId: string]: string }>({});
  const [reviewedQuestions, setReviewedQuestions] = useState<{ [qId: string]: boolean }>({});

  // Viva Voce typed answers
  const [vivaAnswers, setVivaAnswers] = useState<{ [vId: string]: string }>({});

  // Student details
  const [studentName, setStudentName] = useState('NIELIT Candidate');

  // Timer State (50 minutes default in seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(50 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // AI Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [scorecard, setScorecard] = useState<PracticalScorecard | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Load Practical Test
  useEffect(() => {
    async function loadTest() {
      if (!testId) return;
      setLoading(true);
      const data = await getPracticalTestById(testId);
      if (data) {
        setTest(data);
        setSecondsRemaining(data.durationMinutes * 60);

        // Initialize starter files
        const initFiles: { [qId: string]: { [filename: string]: string } } = {};
        data.questions.forEach((q) => {
          initFiles[q.id] = { ...q.starterCode };
        });
        setQuestionFiles(initFiles);

        // Initialize empty viva answers
        const initViva: { [vId: string]: string } = {};
        data.vivaQuestions.forEach((v) => {
          initViva[v.id] = '';
        });
        setVivaAnswers(initViva);
      }
      setLoading(false);
    }
    loadTest();
  }, [testId]);

  // Set the browser tab title directly (native API — cannot duplicate,
  // unlike routing this through react-helmet-async on React 19).
  useEffect(() => {
    if (test) {
      document.title = `${test.paperCode} Practical Exam | ${test.title}`;
    }
  }, [test]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!isTimerRunning || examStep === 'scorecard') return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, examStep]);

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min : ${String(secs).padStart(2, '0')} sec`;
  };

  if (loading || !test) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <Loader2 className="w-10 h-10 animate-spin text-[#e65100] mb-4" />
        <p className="text-sm text-slate-600 font-semibold">Initializing NIELIT Practical Lab Workspace...</p>
      </div>
    );
  }

  const currentQ = test.questions[currentQIndex];
  const currentFiles = questionFiles[currentQ.id] || currentQ.starterCode;

  // Check if current question has been modified / attempted
  const isQuestionAttempted = (qId: string, starter: { [k: string]: string }) => {
    const active = questionFiles[qId];
    if (!active) return false;
    const starterStr = Object.values(starter).join('').trim();
    const activeStr = Object.values(active).join('').trim();
    return activeStr.length > 5 && (activeStr !== starterStr || (questionLogs[qId] && questionLogs[qId].length > 0));
  };

  const attemptedCount = test.questions.filter((q) => isQuestionAttempted(q.id, q.starterCode)).length;

  const handleFilesChange = (newFiles: { [filename: string]: string }) => {
    setQuestionFiles((prev) => ({
      ...prev,
      [currentQ.id]: newFiles
    }));
  };

  const handleRunComplete = (output: string) => {
    setQuestionLogs((prev) => ({
      ...prev,
      [currentQ.id]: output
    }));
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code for this question back to original starter boilerplate?')) {
      setQuestionFiles((prev) => ({
        ...prev,
        [currentQ.id]: { ...currentQ.starterCode }
      }));
    }
  };

  const handleApplyAiFix = (fixedCode: string) => {
    const fileKeys = Object.keys(currentFiles);
    const mainKey = fileKeys[0] || (currentQ.language === 'python' ? 'solution.py' : 'main');
    handleFilesChange({
      ...currentFiles,
      [mainKey]: fixedCode
    });
  };

  const toggleMarkForReview = () => {
    setReviewedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  // Final Submit Handler
  const handleFinalSubmit = async () => {
    setIsEvaluating(true);

    const attemptedQuestionsPayload = test.questions.map((q) => ({
      questionId: q.id,
      questionNumber: q.number,
      code: questionFiles[q.id] || q.starterCode,
      outputLog: questionLogs[q.id] || 'Executed successfully'
    }));

    const vivaPayload = test.vivaQuestions.map((v) => ({
      questionId: v.id,
      question: v.question,
      answer: vivaAnswers[v.id] || ''
    }));

    try {
      const generatedScorecard = await evaluatePracticalExam(
        test,
        attemptedQuestionsPayload,
        vivaPayload
      );

      setScorecard(generatedScorecard);
      setExamStep('scorecard');

      // Save submission to Firestore
      await submitPracticalExam({
        testId: test.id,
        paperCode: test.paperCode,
        module: test.module,
        studentName,
        attemptedQuestions: attemptedQuestionsPayload,
        vivaAnswers: vivaPayload,
        scorecard: generatedScorecard,
        timeSpentSeconds: test.durationMinutes * 60 - secondsRemaining,
        submittedAt: Date.now()
      });
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Render appropriate IDE
  const renderEditor = () => {
    switch (currentQ.language) {
      case 'python':
        return (
          <PythonEditor
            files={currentFiles}
            onChange={handleFilesChange}
            onRunComplete={handleRunComplete}
          />
        );
      case 'html':
        return (
          <WebEditor
            files={currentFiles}
            onChange={handleFilesChange}
            onRunComplete={handleRunComplete}
          />
        );
      case 'arduino':
        return (
          <ArduinoEditor
            files={currentFiles}
            onChange={handleFilesChange}
            onRunComplete={handleRunComplete}
            wokwiDiagramJson={currentQ.wokwiDiagramJson}
          />
        );
      default:
        return (
          <GeneralEditor
            files={currentFiles}
            onChange={handleFilesChange}
            onRunComplete={handleRunComplete}
          />
        );
    }
  };

  // Layout widths based on questionPanelSize
  const getQuestionColumnClass = () => {
    switch (questionPanelSize) {
      case 'hidden':
        return 'hidden';
      case 'compact':
        return 'lg:col-span-3'; // 25% width
      case 'wide':
        return 'lg:col-span-5'; // ~42% width
      case 'normal':
      default:
        return 'lg:col-span-4'; // ~33% width
    }
  };

  const getEditorColumnClass = () => {
    switch (questionPanelSize) {
      case 'hidden':
        return 'lg:col-span-11'; // Takes all remaining space beside palette
      case 'compact':
        return 'lg:col-span-8';
      case 'wide':
        return 'lg:col-span-6';
      case 'normal':
      default:
        return 'lg:col-span-7';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Same react-helmet-async React-19 duplicate-tag bug as SEO.tsx would
          apply here too — this page isn't in the sitemap/prerendered, so
          there's no static tag to conflict with, but for consistency we
          just set document.title directly instead of routing through
          Helmet at all. */}

      {/* Top NIELIT Signature Header Bar */}
      <header className="bg-[#e65100] text-white px-4 py-2.5 flex items-center justify-between shadow-md select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-white px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1.5">
            <NielitLogo size="xs" className="h-5" />
            <span className="text-xs font-black text-slate-900 tracking-wider uppercase">
              {test.paperCode}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold hidden md:inline truncate max-w-md">
            {test.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Digital Countdown Timer */}
          {examStep !== 'scorecard' && (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-lg font-mono font-bold text-xs sm:text-sm shadow-inner transition-colors ${
                secondsRemaining < 300
                  ? 'bg-rose-900 text-rose-100 animate-pulse border border-rose-400'
                  : 'bg-black/30 text-white border border-white/20'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-white/20 rounded-md text-white text-xs transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      {examStep === 'coding' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sub Navigation Strip */}
          <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs flex-wrap gap-2 shadow-2xs">
            <div className="flex items-center gap-3">
              {/* Question Sidebar Toggle & Resizer */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
                <button
                  onClick={() =>
                    setQuestionPanelSize((prev) => (prev === 'hidden' ? 'normal' : 'hidden'))
                  }
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    questionPanelSize === 'hidden'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                  }`}
                  title="Toggle Question Panel Visibility to maximize code workspace"
                >
                  {questionPanelSize === 'hidden' ? (
                    <>
                      <PanelLeftOpen className="w-3.5 h-3.5" />
                      <span>Show Question</span>
                    </>
                  ) : (
                    <>
                      <PanelLeftClose className="w-3.5 h-3.5" />
                      <span>Hide Question</span>
                    </>
                  )}
                </button>

                {questionPanelSize !== 'hidden' && (
                  <div className="hidden sm:flex items-center gap-0.5 pl-1 border-l border-slate-300 ml-1">
                    <button
                      onClick={() => setQuestionPanelSize('compact')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        questionPanelSize === 'compact' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Compact Question Panel (25% width)"
                    >
                      25%
                    </button>
                    <button
                      onClick={() => setQuestionPanelSize('normal')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        questionPanelSize === 'normal' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Standard Question Panel (33% width)"
                    >
                      33%
                    </button>
                    <button
                      onClick={() => setQuestionPanelSize('wide')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        questionPanelSize === 'wide' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Expanded Question Panel (42% width)"
                    >
                      42%
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">
                  Question {currentQ.number} of {test.questions.length}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Attempted: {attemptedCount} / {test.requiredQuestionsCount} Required
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Part A: 80 Marks (Solve Any 2) • Part B: 20 Marks (Viva)
              </span>
              <button
                onClick={() => setExamStep('viva')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>Proceed to Viva Voce (Step 2)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Three-Column Coding Workspace Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-slate-100">
            {/* Left Column: Problem Statement & Requirements (Resizable / Collapsible) */}
            {questionPanelSize !== 'hidden' && (
              <div
                className={`${getQuestionColumnClass()} bg-white border-r border-slate-200 p-4 sm:p-5 overflow-y-auto flex flex-col justify-between shadow-2xs`}
              >
                <div className="space-y-4">
                  {/* Question Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {currentQ.number}
                      </span>
                      <div>
                        <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                          Question No. {currentQ.number}
                        </h2>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">
                          {test.paperCode} • {currentQ.language.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        {currentQ.marks} Marks
                      </span>
                      <button
                        onClick={() => setQuestionPanelSize('hidden')}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                        title="Collapse Question Panel"
                      >
                        <PanelLeftClose className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {currentQ.title}
                    </p>
                    <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      {currentQ.description}
                    </div>
                  </div>
                </div>

                {/* Left Column Bottom Status */}
                <div className="pt-3 border-t border-slate-200 mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Language: <strong className="text-slate-800">{currentQ.language.toUpperCase()}</strong></span>
                  <span
                    className={`font-semibold ${
                      isQuestionAttempted(currentQ.id, currentQ.starterCode)
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {isQuestionAttempted(currentQ.id, currentQ.starterCode)
                      ? '● Attempted'
                      : '○ Not Attempted'}
                  </span>
                </div>
              </div>
            )}

            {/* Center Column: Full Interactive Editor */}
            <div className={`${getEditorColumnClass()} bg-slate-100 p-2 overflow-hidden flex flex-col`}>
              {renderEditor()}
            </div>

            {/* Right Column: Question Switcher Palette (1, 2, 3) */}
            <div className="lg:col-span-1 bg-white border-l border-slate-200 p-2.5 flex flex-col items-center justify-between shadow-2xs">
              <div className="space-y-3 w-full">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                  Questions
                </span>

                <div className="flex flex-col gap-2">
                  {test.questions.map((q, idx) => {
                    const attempted = isQuestionAttempted(q.id, q.starterCode);
                    const marked = reviewedQuestions[q.id];
                    const isCurrent = currentQIndex === idx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`w-full py-2.5 rounded-lg font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer border ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400/40'
                            : marked
                            ? 'bg-amber-500 text-white border-amber-600'
                            : attempted
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-sm font-extrabold">{q.number}</span>
                        <span className="text-[9px] font-medium opacity-90">
                          {attempted ? 'Done' : '40M'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-[9px] text-slate-600 w-full pt-3 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span> Attempted
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Review
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-200 border border-slate-300"></span> Unsolved
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer Bar */}
          <div className="bg-white px-4 py-2.5 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 shrink-0 shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <button
                onClick={() => setCurrentQIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
                disabled={currentQIndex === test.questions.length - 1}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAiAssistantOpen(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                title="AI Code Assistant: Explain logic, fix bugs, or get viva tips"
              >
                <Bot className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Code Helper</span>
              </button>

              <button
                onClick={handleResetCode}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset this question to starter boilerplate"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Starter Code
              </button>

              <button
                onClick={toggleMarkForReview}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  reviewedQuestions[currentQ.id]
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                {reviewedQuestions[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
              </button>

              <button
                onClick={() => setExamStep('viva')}
                className="bg-[#e65100] hover:bg-[#ef6c00] text-white font-bold text-xs px-5 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Save Code & Go to Viva Voce</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Viva Voce Round (Light Mode) */}
      {examStep === 'viva' && (
        <div className="flex-1 bg-slate-50 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  Part B: Viva Voce (20 Marks)
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  Official Viva Voce Examination ({test.paperCode})
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Type your clear, concise conceptual explanations for the questions below. Evaluated automatically via AI rubrics.
                </p>
              </div>

              <button
                onClick={() => setExamStep('coding')}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Coding
              </button>
            </div>

            {/* Viva Questions List */}
            <div className="space-y-4">
              {test.vivaQuestions.map((vq, index) => (
                <div
                  key={vq.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {vq.question}
                        </h4>
                        {vq.hindiQuestion && (
                          <p className="text-xs text-blue-700 mt-0.5">
                            {vq.hindiQuestion}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                      {vq.marks} Marks
                    </span>
                  </div>

                  <textarea
                    value={vivaAnswers[vq.id] || ''}
                    onChange={(e) =>
                      setVivaAnswers((prev) => ({
                        ...prev,
                        [vq.id]: e.target.value
                      }))
                    }
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-y leading-relaxed"
                    placeholder="Type your structured answer here (definitions, key differences, syntax)..."
                  />
                </div>
              ))}
            </div>

            {/* Student Name & Submission Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-700">Candidate Name:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleFinalSubmit}
                disabled={isEvaluating}
                className="inline-flex items-center justify-center gap-2 bg-[#e65100] hover:bg-[#ef6c00] disabled:opacity-50 text-white font-extrabold text-sm px-7 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating via AI Engine...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Practical Exam (Final)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: AI Evaluated Scorecard (Light Mode) */}
      {examStep === 'scorecard' && scorecard && (
        <div className="flex-1 bg-slate-100 p-4 sm:p-8 overflow-y-auto text-slate-900">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Printable Scorecard Container */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <div className="flex items-center gap-3">
                  <NielitLogo size="sm" className="h-8" />
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      NIELIT O Level Practical Examination Result
                    </h2>
                    <p className="text-xs text-slate-500">
                      Revision 5.1 Assessment • Paper: {test.paperCode} ({test.module})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer border border-slate-200"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Result
                  </button>
                  <Link
                    to="/practical-practice"
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-xs"
                  >
                    Practice Another Test
                  </Link>
                </div>
              </div>

              {/* Main Scorecard Gauge Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-center sm:border-r border-slate-200 pb-3 sm:pb-0">
                  <span className="text-xs text-slate-500 font-semibold block">Total Score</span>
                  <span className="text-3xl font-black text-slate-900">
                    {scorecard.totalScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
                  </span>
                </div>

                <div className="text-center sm:border-r border-slate-200 pb-3 sm:pb-0">
                  <span className="text-xs text-slate-500 font-semibold block">Official Grade</span>
                  <span
                    className={`text-3xl font-black ${
                      scorecard.grade === 'S' || scorecard.grade === 'A'
                        ? 'text-emerald-600'
                        : scorecard.grade === 'F'
                        ? 'text-rose-600'
                        : 'text-blue-600'
                    }`}
                  >
                    Grade {scorecard.grade}
                  </span>
                </div>

                <div className="text-center sm:border-r border-slate-200 pb-3 sm:pb-0">
                  <span className="text-xs text-slate-500 font-semibold block">Part A: Coding (80M)</span>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    {scorecard.codingScore} / 80
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-xs text-slate-500 font-semibold block">Part B: Viva (20M)</span>
                  <span className="text-2xl font-extrabold text-amber-700">
                    {scorecard.vivaScore} / 20
                  </span>
                </div>
              </div>

              {/* Overall Feedback Banner */}
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Examiner Evaluation Summary:
                </span>
                <p className="text-xs text-blue-950 leading-relaxed">
                  {scorecard.overallFeedback}
                </p>
              </div>

              {/* Question-wise Coding Breakdown */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" /> Part A: Practical Coding Evaluation (80 Marks)
                </h3>

                <div className="space-y-3">
                  {scorecard.questionEvaluations.map((qe) => (
                    <div
                      key={qe.questionNumber}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          Question {qe.questionNumber}: {qe.questionTitle}
                        </span>
                        <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
                          {qe.marksAwarded} / {qe.maxMarks} Marks
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong>Feedback:</strong> {qe.examinerRemarks}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {qe.strengths && qe.strengths.length > 0 && (
                          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900 border border-emerald-200">
                            <strong>Strengths:</strong>
                            <ul className="list-disc pl-4 mt-1 space-y-0.5">
                              {qe.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {qe.mistakes && qe.mistakes.length > 0 && (
                          <div className="p-2.5 bg-amber-50 rounded-lg text-amber-900 border border-amber-200">
                            <strong>Areas for Improvement:</strong>
                            <ul className="list-disc pl-4 mt-1 space-y-0.5">
                              {qe.mistakes.map((m, i) => (
                                <li key={i}>{m}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viva Voce Breakdown */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" /> Part B: Viva Voce Evaluation (20 Marks)
                </h3>

                <div className="space-y-3">
                  {scorecard.vivaEvaluations.map((ve, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Q{i + 1}: {ve.question}</span>
                        <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          {ve.marksAwarded} / {ve.maxMarks} Marks
                        </span>
                      </div>
                      <p className="text-slate-600">
                        <strong>Your Answer:</strong> {ve.studentAnswer}
                      </p>
                      <p className="text-slate-800">
                        <strong>Teacher Remarks:</strong> {ve.feedback}
                      </p>
                      {ve.idealAnswerSnippet && (
                        <div className="p-2 bg-slate-100 rounded text-slate-700">
                          <strong>Model Solution:</strong> {ve.idealAnswerSnippet}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Code Assistant & Viva Tips Modal */}
      {currentQ && (
        <AiCodeAssistantModal
          isOpen={isAiAssistantOpen}
          onClose={() => setIsAiAssistantOpen(false)}
          code={Object.values(currentFiles || {}).join('\n')}
          language={currentQ.language || 'python'}
          questionTitle={`Question ${currentQ.number}: ${currentQ.title}`}
          questionDescription={currentQ.description}
          onApplyFix={handleApplyAiFix}
        />
      )}
    </div>
  );
};
