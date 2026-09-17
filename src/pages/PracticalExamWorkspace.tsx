import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  RotateCcw,
  Sparkles,
  Award,
  Send,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Printer,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
  Info,
  Image as ImageIcon,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Bot,
  PanelRightClose,
  PanelRightOpen,
  Save,
  Check,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { getPracticalTestById, evaluatePracticalExam, submitPracticalExam } from '../services/practicalService';
import { PracticalTestSet, PracticalScorecard } from '../types/practical';
import { PythonEditor } from '../components/practical/PythonEditor';
import { WebEditor } from '../components/practical/WebEditor';
import { ArduinoEditor } from '../components/practical/ArduinoEditor';
import { NielitOnlyOfficeEditor } from '../components/practical/NielitOnlyOfficeEditor';
import { NielitGalleryModal } from '../components/practical/NielitGalleryModal';
import { NielitInstructionModal } from '../components/practical/NielitInstructionModal';
import { NielitQuestionPalette } from '../components/practical/NielitQuestionPalette';
import { AiCodeAssistantModal } from '../components/practical/AiCodeAssistantModal';
import { NielitLogo } from '../components/NielitLogo';

export const PracticalExamWorkspace: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<PracticalTestSet | null>(null);
  const [loading, setLoading] = useState(true);

  // Exam Workflow State: 'coding' | 'viva' | 'scorecard'
  const [examStep, setExamStep] = useState<'coding' | 'viva' | 'scorecard'>('coding');

  // Active coding question index (0, 1, 2)
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Student Answers & Code per Question
  const [questionFiles, setQuestionFiles] = useState<{ [qId: string]: { [filename: string]: string } }>({});
  const [savedQuestionFiles, setSavedQuestionFiles] = useState<{ [qId: string]: { [filename: string]: string } }>({});
  const [questionLogs, setQuestionLogs] = useState<{ [qId: string]: string }>({});
  const [reviewedQuestions, setReviewedQuestions] = useState<{ [qId: string]: boolean }>({});

  // Navigation Confirmation & Save States
  const [isSaveSwitchModalOpen, setIsSaveSwitchModalOpen] = useState(false);
  const [pendingTargetIndex, setPendingTargetIndex] = useState<number | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Viva Voce typed answers
  const [vivaAnswers, setVivaAnswers] = useState<{ [vId: string]: string }>({});

  // Student details
  const [studentName, setStudentName] = useState('Aditya pathak');

  // Timer State (50 minutes default in seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(50 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Modals & Drawers
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [isQuestionWindowOpen, setIsQuestionWindowOpen] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Editor Appearance & Zoom
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
  const [fontScale, setFontScale] = useState(100); // 100% default
  const [runTrigger, setRunTrigger] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // AI Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [scorecard, setScorecard] = useState<PracticalScorecard | null>(null);

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
        setSavedQuestionFiles(initFiles);

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

  // Set browser tab title
  useEffect(() => {
    if (test) {
      document.title = `${test.paperCode} Practical Examination | NIELIT O Level`;
    }
  }, [test]);

  // Request browser Fullscreen automatically when practical exam starts
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const tryEnterFullscreen = async () => {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        } catch (err) {
          // Browser may require user gesture; fallback to first click
        }
      }
    };

    // Attempt immediately
    tryEnterFullscreen();

    // Fallback: trigger fullscreen on the first student click/interaction if blocked initially by browser security policy
    const onFirstUserGesture = () => {
      tryEnterFullscreen();
      window.removeEventListener('click', onFirstUserGesture);
      window.removeEventListener('keydown', onFirstUserGesture);
    };

    window.addEventListener('click', onFirstUserGesture, { once: true });
    window.addEventListener('keydown', onFirstUserGesture, { once: true });

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('click', onFirstUserGesture);
      window.removeEventListener('keydown', onFirstUserGesture);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn('Fullscreen toggle:', e);
    }
  };

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

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min : ${String(secs).padStart(2, '0')} sec`;
  };

  if (loading || !test) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <Loader2 className="w-10 h-10 animate-spin text-[#2B56C6] mb-4" />
        <p className="text-sm text-slate-600 font-semibold">Initializing NIELIT Practical Lab Workspace...</p>
      </div>
    );
  }

  const currentQ = test.questions[currentQIndex];
  const currentFiles = questionFiles[currentQ.id] || currentQ.starterCode;

  // Check if question has been modified / attempted
  const isQuestionAttempted = (qId: string) => {
    const q = test.questions.find((item) => item.id === qId);
    if (!q) return false;
    const active = questionFiles[qId];
    if (!active) return false;
    const starterStr = Object.values(q.starterCode).join('').trim();
    const activeStr = Object.values(active).join('').trim();
    return activeStr.length > 5 && (activeStr !== starterStr || (questionLogs[qId] && questionLogs[qId].length > 0));
  };

  const attemptedCount = test.questions.filter((q) => isQuestionAttempted(q.id)).length;
  const reviewCount = test.questions.filter((q) => reviewedQuestions[q.id]).length;
  const unattemptedCount = test.questions.length - attemptedCount;

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

  // Switch Question with Save Confirmation Dialog
  const requestQuestionChange = (targetIndex: number) => {
    if (targetIndex === currentQIndex || targetIndex < 0 || targetIndex >= test.questions.length) {
      return;
    }
    setPendingTargetIndex(targetIndex);
    setIsSaveSwitchModalOpen(true);
  };

  const handleConfirmSaveAndSwitch = () => {
    if (pendingTargetIndex === null) return;
    const activeWork = questionFiles[currentQ.id] || currentQ.starterCode;

    // 1. Commit and save to state
    setSavedQuestionFiles((prev) => ({
      ...prev,
      [currentQ.id]: { ...activeWork }
    }));
    setQuestionFiles((prev) => ({
      ...prev,
      [currentQ.id]: { ...activeWork }
    }));

    const savedQNum = currentQ.number;
    setCurrentQIndex(pendingTargetIndex);
    setIsSaveSwitchModalOpen(false);
    setPendingTargetIndex(null);

    setSaveToast(`Question No.${savedQNum} work saved successfully.`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleConfirmDiscardAndSwitch = () => {
    if (pendingTargetIndex === null) return;

    // Revert uncommitted changes back to last saved state
    const lastSaved = savedQuestionFiles[currentQ.id] || currentQ.starterCode;
    setQuestionFiles((prev) => ({
      ...prev,
      [currentQ.id]: { ...lastSaved }
    }));

    setCurrentQIndex(pendingTargetIndex);
    setIsSaveSwitchModalOpen(false);
    setPendingTargetIndex(null);
  };

  const handleManualSave = () => {
    const activeWork = questionFiles[currentQ.id] || currentQ.starterCode;
    setSavedQuestionFiles((prev) => ({
      ...prev,
      [currentQ.id]: { ...activeWork }
    }));
    setSaveToast(`Question No.${currentQ.number} work saved.`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset this question back to original starter template?')) {
      setQuestionFiles((prev) => ({
        ...prev,
        [currentQ.id]: { ...currentQ.starterCode }
      }));
    }
  };

  const toggleMarkForReview = () => {
    setReviewedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleRunCodeClick = () => {
    setRunTrigger((prev) => prev + 1);
  };

  // Final Submit Handler
  const handleFinalSubmit = async () => {
    setIsSubmitConfirmOpen(false);
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

  // Render appropriate workspace editor
  const renderEditor = () => {
    // PR1 / M1-R5 uses OnlyOffice suite (Writer / Calc / Impress)
    if (test.module === 'M1-R5' || currentQ.language === 'general') {
      return (
        <NielitOnlyOfficeEditor
          files={currentFiles}
          onChange={handleFilesChange}
          onRunComplete={handleRunComplete}
          questionTitle={currentQ.title}
          paperCode={test.paperCode}
          questionNumber={currentQ.number}
          theme={editorTheme}
          runTrigger={runTrigger}
        />
      );
    }

    if (currentQ.language === 'python') {
      return (
        <PythonEditor
          files={currentFiles}
          onChange={handleFilesChange}
          onRunComplete={handleRunComplete}
          theme={editorTheme}
          runTrigger={runTrigger}
        />
      );
    }

    if (currentQ.language === 'html') {
      return (
        <WebEditor
          files={currentFiles}
          onChange={handleFilesChange}
          onRunComplete={handleRunComplete}
          theme={editorTheme}
          runTrigger={runTrigger}
        />
      );
    }

    if (currentQ.language === 'arduino') {
      return (
        <ArduinoEditor
          files={currentFiles}
          onChange={handleFilesChange}
          onRunComplete={handleRunComplete}
          theme={editorTheme}
          runTrigger={runTrigger}
        />
      );
    }

    return (
      <NielitOnlyOfficeEditor
        files={currentFiles}
        onChange={handleFilesChange}
        onRunComplete={handleRunComplete}
        questionTitle={currentQ.title}
        paperCode={test.paperCode}
        questionNumber={currentQ.number}
      />
    );
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-white text-slate-800 flex flex-col font-sans select-none fixed inset-0">
      {/* 1. Official NIELIT Practical Top Header Bar matching all 8 screenshots */}
      <header className="bg-white border-b border-slate-200 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between select-none shrink-0 h-13 sm:h-14">
        {/* Left: Emblem + रा.इ.सू.प्रौ.सं / NIELIT + PR1 B4 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <img
              src="/nielit-emblem.svg"
              alt="NIELIT"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 tracking-tight">
                रा.इ.सू.प्रौ.सं
              </span>
              <span className="text-[11px] sm:text-xs font-black text-slate-900 tracking-wider">
                NIELIT
              </span>
            </div>
          </div>

          <div className="h-5 sm:h-6 w-[1px] bg-slate-200 mx-0.5 sm:mx-1" />

          {/* Paper / Batch Code (e.g. PR1 B4, PR2 B3, PR3 B2, PR4 B1) */}
          <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            {test.paperCode || 'PR1 B4'}
          </span>
        </div>

        {/* Right: Clock + Fullscreen Toggle + Instruction + Gallery + Candidate Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Countdown Timer with Clock Icon matching screenshot: '43 min : 42 sec' */}
          {examStep !== 'scorecard' && (
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs sm:text-sm bg-slate-50 px-2 py-1 rounded border border-slate-200">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
              <span className="tabular-nums font-mono">{formatTimer(secondsRemaining)}</span>
            </div>
          )}

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-xs font-medium bg-slate-100 hover:bg-slate-200 px-2 sm:px-2.5 py-1 rounded border border-slate-300"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-blue-700" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-blue-700" />
            )}
            <span className="hidden md:inline text-[11px] font-semibold text-slate-800">
              {isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
            </span>
          </button>

          {/* Instruction Button */}
          <button
            onClick={() => setIsInstructionOpen(true)}
            className="flex items-center gap-1 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-xs font-medium"
          >
            <Info className="w-4 h-4 text-slate-600" />
            <span className="text-[11px] sm:text-xs">Instruction</span>
          </button>

          {/* Gallery Button - only visible for ITN (PR1 / M1-R5) and WDP (PR2 / M2-R5) exams */}
          {(test.module === 'M1-R5' ||
            test.module === 'M2-R5' ||
            test.paperCode?.toUpperCase().includes('PR1') ||
            test.paperCode?.toUpperCase().includes('PR2') ||
            test.module?.toLowerCase().includes('it') ||
            test.module?.toLowerCase().includes('web')) && (
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="flex items-center gap-1 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-xs font-medium"
            >
              <ImageIcon className="w-4 h-4 text-slate-600" />
              <span className="text-[11px] sm:text-xs">Gallery</span>
            </button>
          )}

          {/* Candidate Profile Widget matching Screenshot */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col leading-tight text-left">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[100px] sm:max-w-[130px]">
                {studentName}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400">
                null
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      {examStep === 'coding' && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-slate-100">
          {/* 2. Subheader Bar matching Screenshots 2, 3, 4, 6 */}
          <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between select-none shrink-0 gap-2">
            {/* Left: Question No.1 + Refresh (↺) + Zoom (A+, A-) */}
            <div className="flex items-center gap-3">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Question No.{currentQ.number}
              </h2>

              <button
                onClick={handleResetCode}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Reset question code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                <button
                  onClick={() => setFontScale((s) => Math.min(130, s + 10))}
                  className="px-1.5 py-0.5 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                  title="Increase font size"
                >
                  A+
                </button>
                <button
                  onClick={() => setFontScale((s) => Math.max(80, s - 10))}
                  className="px-1.5 py-0.5 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer"
                  title="Decrease font size"
                >
                  A-
                </button>
              </div>

              {/* Question Window Show / Hide Button */}
              <button
                onClick={() => setIsQuestionWindowOpen((prev) => !prev)}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                  isQuestionWindowOpen
                    ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
                title={isQuestionWindowOpen ? 'Hide Question Window' : 'Show Question Window'}
              >
                {isQuestionWindowOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isQuestionWindowOpen ? 'Hide Question' : 'Show Question'}</span>
              </button>

              {/* Question Palette Show / Hide Button */}
              <button
                onClick={() => setIsPaletteOpen((prev) => !prev)}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                  isPaletteOpen
                    ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                }`}
                title={isPaletteOpen ? 'Hide Question Palette' : 'Show Question Palette'}
              >
                {isPaletteOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPaletteOpen ? 'Hide Palette' : 'Show Palette'}</span>
              </button>
            </div>

            {/* Right: Language Dropdown + Blue 'Run Code' button + Theme Toggle Circle */}
            <div className="flex items-center gap-3">
              {/* Language Selector Dropdown */}
              <div className="relative">
                <select
                  disabled
                  className="bg-white border border-slate-300 rounded px-3 py-1 text-xs font-semibold text-slate-800 shadow-2xs cursor-default appearance-none pr-7"
                  value={
                    currentQ.language === 'python'
                      ? 'Python (3.8.1)'
                      : currentQ.language === 'html'
                      ? 'HTML'
                      : currentQ.language === 'arduino'
                      ? 'Arduino C++'
                      : 'LibreOffice / ONLYOFFICE'
                  }
                >
                  <option>Python (3.8.1)</option>
                  <option>HTML</option>
                  <option>Arduino C++</option>
                  <option>LibreOffice / ONLYOFFICE</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
                  ▼
                </span>
              </div>

              {/* Blue 'Run Code' button matching Screenshots 2, 3, 4 */}
              <button
                onClick={handleRunCodeClick}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs px-4 py-1.5 rounded shadow-xs transition-colors cursor-pointer"
              >
                Run Code
              </button>

              {/* Theme Toggle Icon: Half Black / Half White Circle */}
              <button
                onClick={() => setEditorTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                className="w-6 h-6 rounded-full border border-slate-400 overflow-hidden relative cursor-pointer shadow-2xs"
                title="Toggle Light / Dark Editor Theme"
              >
                <div className="absolute inset-0 bg-white" />
                <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-slate-800" />
              </button>
            </div>
          </div>

          {/* 3. Middle Area: Left Sliding Question Window ↔ Right Editor Pane ↔ Slide-out Palette */}
          <div className="flex-1 min-h-0 flex overflow-hidden relative">
            {/* Left Sliding Question Window */}
            <div className="relative flex items-stretch z-20 select-none">
              {/* Slide-out Question Panel */}
              {isQuestionWindowOpen && (
                <div
                  className="w-72 sm:w-80 md:w-[340px] lg:w-[380px] bg-white border-r border-slate-300 p-4 sm:p-5 overflow-y-auto flex flex-col justify-between shrink-0 shadow-sm animate-in slide-in-from-left duration-200"
                  style={{ fontSize: `${fontScale}%` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                        Question Statement
                      </span>
                      <button
                        onClick={() => setIsQuestionWindowOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="Hide Question Window"
                      >
                        <PanelLeftClose className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Question Statement - Title Only */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 leading-snug text-sm sm:text-base">
                        {currentQ.number}. {currentQ.title}
                      </h3>
                    </div>

                    {/* Practical Marks Badge */}
                    <div className="pt-2">
                      <span className="inline-block bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2.5 py-1 rounded font-semibold">
                        Marks: {currentQ.marks}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 mt-6 text-[11px] text-slate-500">
                    <span>Solve ANY TWO practical questions. Click 'Submit Test' when finished.</span>
                  </div>
                </div>
              )}

              {/* Edge Handle Tab for expanding or collapsing Question Window */}
              {!isQuestionWindowOpen ? (
                <button
                  onClick={() => setIsQuestionWindowOpen(true)}
                  className="self-center bg-white border border-slate-300 border-l-0 rounded-r-md shadow-md py-3 px-1.5 flex flex-col items-center gap-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-all cursor-pointer z-30 group"
                  title="Show Question Window"
                  aria-label="Show Question Window"
                >
                  <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-[10px] font-bold writing-mode-vertical [writing-mode:vertical-rl] tracking-wider text-slate-700 uppercase">
                    Question
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setIsQuestionWindowOpen(false)}
                  className="self-center -mr-3 bg-white border border-slate-300 rounded-full shadow-md w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-transform cursor-pointer z-30"
                  title="Hide Question Window"
                  aria-label="Hide Question Window"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Middle Working Area */}
            <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden bg-slate-100 p-2">
              {renderEditor()}
            </div>

            {/* Right Slide-out Question Palette Drawer */}
            <NielitQuestionPalette
              questions={test.questions}
              currentIndex={currentQIndex}
              onSelectQuestion={(idx) => requestQuestionChange(idx)}
              isOpen={isPaletteOpen}
              onToggle={() => setIsPaletteOpen((prev) => !prev)}
              isAttempted={(qId) => isQuestionAttempted(qId)}
              isReviewed={(qId) => Boolean(reviewedQuestions[qId])}
            />
          </div>

          {/* 4. Bottom Action Footer Bar matching Screenshot */}
          <div className="bg-white border-t border-slate-300 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between select-none shrink-0 gap-2 z-30">
            {/* Left: Previous Question / Next Question Buttons + Save Button */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => requestQuestionChange(currentQIndex - 1)}
                disabled={currentQIndex === 0}
                className="bg-[#1E3A8A] hover:bg-[#172554] disabled:opacity-40 text-white font-semibold text-xs px-3.5 sm:px-5 py-1.5 sm:py-2 rounded shadow-xs transition-colors cursor-pointer"
              >
                Previous Question
              </button>

              <button
                onClick={() => requestQuestionChange(currentQIndex + 1)}
                disabled={currentQIndex === test.questions.length - 1}
                className="bg-[#1E3A8A] hover:bg-[#172554] disabled:opacity-40 text-white font-semibold text-xs px-3.5 sm:px-5 py-1.5 sm:py-2 rounded shadow-xs transition-colors cursor-pointer"
              >
                Next Question
              </button>

              <button
                onClick={handleManualSave}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
                title="Save work for this question"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save Work</span>
              </button>
            </div>

            {/* Right: Review Checkbox + Submit Test Button */}
            <div className="flex items-center gap-3 sm:gap-4">
              <label className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(reviewedQuestions[currentQ.id])}
                  onChange={toggleMarkForReview}
                  className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                />
                <span>Review</span>
              </label>

              <button
                onClick={() => setIsSubmitConfirmOpen(true)}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs px-4 sm:px-6 py-1.5 sm:py-2 rounded shadow-xs transition-colors cursor-pointer"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* 5. Official ThinkExam Copyright Footer matching Screenshot */}
          <div className="bg-[#f8fafc] border-t border-slate-200 py-1.5 px-4 text-center text-[10px] text-slate-500 select-none shrink-0">
            Copyright © 2025 Ginger Webs Pvt Ltd. All rights reserved. | Powered by thinkexam.com | Last updated:26-04-2023 | Version:TE_7.0.0.0
          </div>
        </div>
      )}

      {/* Step 2: Viva Voce Round */}
      {examStep === 'viva' && (
        <div className="flex-1 bg-slate-50 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Part B: Viva Voce (20 Marks)
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  Official Viva Voce Examination ({test.paperCode})
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Answer the conceptual questions below. Answers will be evaluated via AI rubrics according to NIELIT standards.
                </p>
              </div>

              <button
                onClick={() => setExamStep('coding')}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Practical Editor
              </button>
            </div>

            {/* Viva Questions */}
            <div className="space-y-4">
              {test.vivaQuestions.map((vq, index) => (
                <div
                  key={vq.id}
                  className="bg-white p-5 rounded-lg border border-slate-300 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded bg-[#2B56C6] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
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
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
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
                    className="w-full bg-slate-50 border border-slate-300 rounded p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600 resize-y leading-relaxed"
                    placeholder="Type your answer here..."
                  />
                </div>
              ))}
            </div>

            {/* Candidate Submission Bar */}
            <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-700">Candidate Name:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                onClick={handleFinalSubmit}
                disabled={isEvaluating}
                className="inline-flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded shadow-xs transition-colors cursor-pointer"
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

      {/* Step 3: AI Evaluated Scorecard */}
      {examStep === 'scorecard' && scorecard && (
        <div className="flex-1 bg-slate-100 p-4 sm:p-8 overflow-y-auto text-slate-900">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-300 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                <div className="flex items-center gap-3">
                  <img src="/nielit-emblem.svg" alt="NIELIT" className="h-10 w-10 object-contain" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      NIELIT O Level Practical Examination Result
                    </h2>
                    <p className="text-xs text-slate-500">
                      Assessment Result • Paper: {test.paperCode} ({test.module}) • Candidate: {studentName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer border border-slate-300"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Result
                  </button>
                  <Link
                    to="/practical-practice"
                    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-xs"
                  >
                    Practice Another Paper
                  </Link>
                </div>
              </div>

              {/* Total Score Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded border border-slate-200">
                <div className="text-center sm:border-r border-slate-200 pb-2 sm:pb-0">
                  <span className="text-xs text-slate-500 font-semibold block">Total Score</span>
                  <span className="text-2xl font-black text-slate-900">
                    {scorecard.totalScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                  </span>
                </div>

                <div className="text-center sm:border-r border-slate-200 pb-2 sm:pb-0">
                  <span className="text-xs text-slate-500 font-semibold block">Part A: Coding</span>
                  <span className="text-2xl font-bold text-blue-700">
                    {scorecard.codingScore} <span className="text-xs font-normal text-slate-500">/ 80</span>
                  </span>
                </div>

                <div className="text-center sm:border-r border-slate-200 pb-2 sm:pb-0">
                  <span className="text-xs text-slate-500 font-semibold block">Part B: Viva</span>
                  <span className="text-2xl font-bold text-indigo-700">
                    {scorecard.vivaScore} <span className="text-xs font-normal text-slate-500">/ 20</span>
                  </span>
                </div>

                <div className="text-center flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-500 font-semibold block">Result Status</span>
                  <span
                    className={`inline-block px-3 py-0.5 rounded text-xs font-extrabold ${
                      scorecard.passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {scorecard.passed ? 'PASSED' : 'NEEDS PRACTICE'}
                  </span>
                </div>
              </div>

              {/* Overall Feedback */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded text-xs text-blue-900 space-y-1">
                <span className="font-bold block text-sm">Examiner AI Evaluation Summary:</span>
                <p className="leading-relaxed">{scorecard.overallFeedback}</p>
              </div>

              {/* Breakdown Per Question */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Question Breakdown
                </h3>
                {scorecard.questionEvaluations.map((qb) => (
                  <div key={qb.questionNumber} className="border border-slate-200 rounded p-4 space-y-2 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        Question {qb.questionNumber}: {qb.questionTitle}
                      </span>
                      <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {qb.marksAwarded} / {qb.maxMarks} Marks
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{qb.examinerRemarks}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Test Confirmation Dialog */}
      {isSubmitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2B56C6] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Exam Submission</h3>
                <p className="text-xs text-slate-500">Summary of your current attempt</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Attempted Questions:</span>
                <strong className="text-blue-700">{attemptedCount} / {test.questions.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review:</span>
                <strong className="text-purple-700">{reviewCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Unattempted Questions:</span>
                <strong className="text-slate-600">{unattemptedCount}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Would you like to proceed to <strong>Viva Voce (Part B)</strong> before generating your final scorecard, or submit the test directly?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsSubmitConfirmOpen(false)}
                className="w-full sm:w-auto px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsSubmitConfirmOpen(false);
                  setExamStep('viva');
                }}
                className="w-full sm:w-auto px-4 py-1.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded shadow-xs cursor-pointer"
              >
                Proceed to Viva Voce
              </button>
              <button
                onClick={handleFinalSubmit}
                className="w-full sm:w-auto px-4 py-1.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded shadow-xs cursor-pointer"
              >
                Submit Exam Directly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save & Switch Question Confirmation Dialog */}
      {isSaveSwitchModalOpen && pendingTargetIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center shrink-0">
                <Save className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Save Your Work?</h3>
                <p className="text-xs text-slate-500">
                  Moving from Question No.{currentQ.number} to Question No.{test.questions[pendingTargetIndex].number}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1 text-slate-700">
              <p className="font-semibold text-slate-800">
                Do you want to save the code / work done on Question No.{currentQ.number}?
              </p>
              <p className="text-slate-500 text-[11px] pt-1">
                If you choose <strong className="text-blue-700">Save & Proceed</strong>, your code will be preserved and will be available whenever you return to this question.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setIsSaveSwitchModalOpen(false);
                  setPendingTargetIndex(null);
                }}
                className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDiscardAndSwitch}
                className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded border border-slate-300 cursor-pointer"
              >
                Don't Save
              </button>
              <button
                onClick={handleConfirmSaveAndSwitch}
                className="w-full sm:w-auto px-4 py-1.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xs text-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Gallery Modal */}
      <NielitGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      {/* Instructions Modal */}
      <NielitInstructionModal
        isOpen={isInstructionOpen}
        onClose={() => setIsInstructionOpen(false)}
        paperCode={test.paperCode}
        durationMinutes={test.durationMinutes}
      />

      {/* AI Code Assistant Modal */}
      <AiCodeAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        questionTitle={currentQ.title}
        questionDescription={currentQ.description}
        code={Object.values(currentFiles)[0] || ''}
        language={currentQ.language}
        onApplyFix={(fixed) => {
          const mainKey = Object.keys(currentFiles)[0] || 'solution';
          handleFilesChange({ ...currentFiles, [mainKey]: fixed });
        }}
      />
    </div>
  );
};
