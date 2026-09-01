import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Timer, 
  RotateCcw, 
  Award, 
  Smartphone,
  ArrowRight, 
  ArrowLeft,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  ShieldCheck,
  Check,
  Zap,
  Filter,
  Layers,
  GraduationCap,
  FileText,
  Monitor,
  Code,
  Cpu,
  Globe
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { quizService } from '../services/quizService';
import { DynamicQuizTest, QuizQuestionItem, UserTestResult } from '../types/database';
import { useAuth } from '../context/AuthContext';

// Color themes per module for visual appeal
const MODULE_THEMES: Record<string, { bg: string; text: string; border: string; badge: string; accent: string }> = {
  m1: {
    bg: 'bg-blue-50/50 hover:bg-blue-50/80',
    text: 'text-blue-700',
    border: 'border-blue-200/80 hover:border-blue-300',
    badge: 'bg-blue-600 text-white',
    accent: 'from-blue-600 to-indigo-600'
  },
  m2: {
    bg: 'bg-indigo-50/50 hover:bg-indigo-50/80',
    text: 'text-indigo-700',
    border: 'border-indigo-200/80 hover:border-indigo-300',
    badge: 'bg-indigo-600 text-white',
    accent: 'from-indigo-600 to-violet-600'
  },
  m3: {
    bg: 'bg-emerald-50/50 hover:bg-emerald-50/80',
    text: 'text-emerald-700',
    border: 'border-emerald-200/80 hover:border-emerald-300',
    badge: 'bg-emerald-600 text-white',
    accent: 'from-emerald-600 to-teal-600'
  },
  m4: {
    bg: 'bg-purple-50/50 hover:bg-purple-50/80',
    text: 'text-purple-700',
    border: 'border-purple-200/80 hover:border-purple-300',
    badge: 'bg-purple-600 text-white',
    accent: 'from-purple-600 to-fuchsia-600'
  },
  ccc: {
    bg: 'bg-amber-50/50 hover:bg-amber-50/80',
    text: 'text-amber-700',
    border: 'border-amber-200/80 hover:border-amber-300',
    badge: 'bg-amber-600 text-white',
    accent: 'from-amber-600 to-orange-600'
  }
};

const DEFAULT_THEME = {
  bg: 'bg-slate-50/50 hover:bg-slate-50/80',
  text: 'text-slate-700',
  border: 'border-slate-200 hover:border-slate-300',
  badge: 'bg-slate-800 text-white',
  accent: 'from-slate-700 to-slate-900'
};

export function MockTest() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState<DynamicQuizTest[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<DynamicQuizTest | null>(null);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [showMobilePalette, setShowMobilePalette] = useState(false);

  // Active Test Session State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [key: string]: boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [studentName, setStudentName] = useState('Student');

  // Subscribe to real-time tests from Firestore
  useEffect(() => {
    const unsub = quizService.subscribeQuizzes((data) => {
      setQuizzes(data);
    });
    return unsub;
  }, []);

  // Handle URL query parameters for module or direct test launch
  useEffect(() => {
    const modParam = searchParams.get('module');
    if (modParam && ['all', 'm1', 'm2', 'm3', 'm4', 'ccc'].includes(modParam.toLowerCase())) {
      setSelectedModuleFilter(modParam.toLowerCase());
    }
  }, [searchParams]);

  useEffect(() => {
    const testParam = searchParams.get('test');
    if (testParam && quizzes.length > 0 && !selectedQuiz) {
      const found = quizzes.find(q => q.id === testParam);
      if (found) {
        handleStartTest(found);
      }
    }
  }, [searchParams, quizzes, selectedQuiz]);

  // Filter quizzes for the directory
  const filteredQuizzes = quizzes.filter(q => {
    if (selectedModuleFilter === 'all') return true;
    return q.module === selectedModuleFilter;
  });

  // Calculate count per filter for badges
  const getFilterCount = (filterId: string) => {
    if (filterId === 'all') return quizzes.length;
    return quizzes.filter(q => q.module === filterId).length;
  };

  // Utility to shuffle an array (Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start a specific test
  const handleStartTest = (quiz: DynamicQuizTest) => {
    // Shuffle the questions before starting
    const shuffledQuestions = shuffleArray(quiz.questions || []);

    setSelectedQuiz({
      ...quiz,
      questions: shuffledQuestions
    });
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setIsSubmitted(false);
    setShowMobilePalette(false);
    setTimeLeft((quiz.durationMinutes || 45) * 60);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Timer logic for active test
  useEffect(() => {
    if (!selectedQuiz || isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedQuiz, isSubmitted, timeLeft]);

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleMarkForReview = (qId: string) => {
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = () => {
    if (!selectedQuiz) return;
    setIsSubmitted(true);
    setShowMobilePalette(false);

    // Calculate score
    const questions = selectedQuiz.questions || [];
    let score = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += (q.marks || 1);
      }
    });

    const totalMarks = selectedQuiz.totalMarks || questions.length || 1;
    const percentage = Math.round((score / totalMarks) * 100);
    let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (percentage >= 85) grade = 'S';
    else if (percentage >= 75) grade = 'A';
    else if (percentage >= 65) grade = 'B';
    else if (percentage >= 55) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const result: UserTestResult = {
      testId: selectedQuiz.id,
      testTitle: selectedQuiz.title,
      studentName: studentName || 'Student',
      score,
      totalMarks,
      percentage,
      passed: score >= (selectedQuiz.passingMarks || 25),
      grade,
      timeTakenSeconds: ((selectedQuiz.durationMinutes || 45) * 60) - timeLeft,
      submittedAt: new Date().toISOString(),
      answers: userAnswers
    };

    quizService.saveTestResult(result);
  };

  const handleExitTest = () => {
    if (!isSubmitted) {
      if (!window.confirm('क्या आप सच में टेस्ट छोड़ना चाहते हैं? आपकी प्रगति सुरक्षित नहीं होगी। (Are you sure you want to exit the test?)')) return;
    }
    setSelectedQuiz(null);
    setIsSubmitted(false);
    setShowMobilePalette(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Active quiz variables
  const questions: QuizQuestionItem[] = selectedQuiz?.questions || [];
  const currentQ = questions[currentIndex] || questions[0];
  const answeredCount = Object.keys(userAnswers).length;
  
  let calculatedScore = 0;
  if (selectedQuiz) {
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        calculatedScore += (q.marks || 1);
      }
    });
  }
  const totalMarks = selectedQuiz?.totalMarks || questions.length || 1;
  const percentage = Math.round((calculatedScore / totalMarks) * 100);

  const filterTabs = [
    { id: 'all', label: 'All Tests', hindiLabel: 'सभी टेस्ट' },
    { id: 'm1', label: 'M1-R5', hindiLabel: 'IT Tools' },
    { id: 'm2', label: 'M2-R5', hindiLabel: 'Web Design' },
    { id: 'm3', label: 'M3-R5', hindiLabel: 'Python' },
    { id: 'm4', label: 'M4-R5', hindiLabel: 'IoT' },
    { id: 'ccc', label: 'CCC', hindiLabel: 'ट्रिपल सी' },
  ];

  return (
    <div className="bg-slate-50/70 min-h-screen py-6 sm:py-10">
      <SEO
        title="O Level & CCC Online Mock Test 2026 - NIELIT CBT Test Series"
        description="Practice NIELIT CBT pattern online mock tests in Hindi and English for O Level (M1-R5, M2-R5, M3-R5, M4-R5) & CCC. Instant grading, official timer and detailed solutions."
        keywords={[
          'Skilldotpy mock test',
          'NIELIT O Level online mock test free',
          'O Level M1-R5 mock test',
          'O Level M2-R5 web design mock test',
          'O Level M3-R5 python mock test in Hindi',
          'O Level M4-R5 IoT mock test',
          'CCC online mock test free 100 question',
          'NIELIT CBT exam practice online'
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Mock Test Portal', url: '/mock-test' }
        ]}
      />

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-6xl space-y-6">
        
        {/* ================= VIEW 1: TEST DIRECTORY (WHEN NO TEST IS ACTIVE) ================= */}
        {!selectedQuiz && (
          <div className="space-y-6">
            
            {/* Header & Hero Card */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-md border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>100% फ्री ऑनलाइन CBT मॉक टेस्ट (NIELIT R5.1 पैटर्न)</span>
                  </div>
                  
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                    NIELIT O Level & CCC Online CBT Test Series
                  </h1>
                  
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    परीक्षा से पहले अपनी तैयारी जांचें! टाइमर, नेगेटिव मार्किंग रहित NIELIT मानक एवं प्रत्येक प्रश्न के हिंदी समाधान के साथ।
                  </p>
                  
                  {/* Quick Feature Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/10 text-slate-200 px-2.5 py-1 rounded-lg">
                      <Timer className="w-3 h-3 text-amber-400" /> टाइमर सिमुलेटर
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/10 text-slate-200 px-2.5 py-1 rounded-lg">
                      <Award className="w-3 h-3 text-emerald-400" /> तुरंत रिजल्ट व ग्रेड
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/10 text-slate-200 px-2.5 py-1 rounded-lg">
                      <BookOpen className="w-3 h-3 text-blue-300" /> हिंदी एवं इंग्लिश प्रश्न
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="shrink-0">
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs shadow-xs transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-900" />
                      <span>Admin: Add / Edit Quizzes</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* TOP STICKY / COMPACT FILTER BUTTONS BAR */}
            <div className="sticky top-16 z-20 bg-slate-50/95 backdrop-blur-md py-2 -mx-3 px-3 sm:mx-0 sm:px-0">
              <div className="bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-slate-200 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 sm:gap-1.5 min-w-max">
                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-slate-400 text-xs font-bold border-r border-slate-200 mr-1">
                    <Filter className="w-3.5 h-3.5 text-blue-600" />
                    <span>विषय (Filter):</span>
                  </div>

                  {filterTabs.map((filter) => {
                    const count = getFilterCount(filter.id);
                    const isActive = selectedModuleFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedModuleFilter(filter.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all shrink-0 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                            : 'bg-slate-100/70 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        <span>{filter.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="hidden lg:flex items-center text-[11px] font-semibold text-slate-500 shrink-0 pr-2">
                  <span>कुल उपलब्ध टेस्ट: <strong>{filteredQuizzes.length}</strong></span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* VIEW MODE A: "ALL PAPERS" (4-Test Card Grid with Syllabus & All Tests)     */}
            {/* ========================================================================= */}
            {selectedModuleFilter === 'all' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {[
                  {
                    module: 'm1',
                    title: 'IT Tools and Network Basics',
                    hindiTitle: 'सूचना प्रौद्योगिकी उपकरण और नेटवर्क मूल बातें',
                    badge: 'M1-R5.1',
                    bg: 'bg-[#e9f2fa]',
                    border: 'border-[#cde0f2]',
                    syllabusLink: '/syllabus',
                    tests: [
                      { id: 'm1-test-1', num: 1, title: 'Test 1: Fundamentals & OS', sub: '50 MCQs • 45 Mins' },
                      { id: 'm1-test-2', num: 2, title: 'Test 2: LibreOffice Suite', sub: '50 MCQs • 45 Mins' },
                      { id: 'm1-test-3', num: 3, title: 'Test 3: Internet & Banking', sub: '50 MCQs • 45 Mins' },
                      { id: 'm1-test-4', num: 4, title: 'Test 4: Grand Exam Simulator', sub: '100 MCQs • 90 Mins' },
                    ]
                  },
                  {
                    module: 'm2',
                    title: 'Web Designing and Publishing',
                    hindiTitle: 'वेब डिजाइनिंग और प्रकाशन',
                    badge: 'M2-R5.1',
                    bg: 'bg-[#e9f2fa]',
                    border: 'border-[#cde0f2]',
                    syllabusLink: '/syllabus',
                    tests: [
                      { id: 'm2-test-1', num: 1, title: 'Test 1: HTML5 Structure', sub: '50 MCQs • 45 Mins' },
                      { id: 'm2-test-2', num: 2, title: 'Test 2: CSS3 & Flexbox', sub: '50 MCQs • 45 Mins' },
                      { id: 'm2-test-3', num: 3, title: 'Test 3: JS & DOM Scripting', sub: '50 MCQs • 45 Mins' },
                      { id: 'm2-test-4', num: 4, title: 'Test 4: Grand Exam Simulator', sub: '100 MCQs • 90 Mins' },
                    ]
                  },
                  {
                    module: 'm3',
                    title: 'Python Programming',
                    hindiTitle: 'पायथन प्रोग्रामिंग भाषा',
                    badge: 'M3-R5.1',
                    bg: 'bg-[#ebf5fa]',
                    border: 'border-[#cfe4f2]',
                    syllabusLink: '/syllabus',
                    tests: [
                      { id: 'm3-test-1', num: 1, title: 'Test 1: Python Basics', sub: '50 MCQs • 45 Mins' },
                      { id: 'm3-test-2', num: 2, title: 'Test 2: Sequence Types', sub: '50 MCQs • 45 Mins' },
                      { id: 'm3-test-3', num: 3, title: 'Test 3: Functions & NumPy', sub: '50 MCQs • 45 Mins' },
                      { id: 'm3-test-4', num: 4, title: 'Test 4: Flagship 100 MCQs', sub: '100 MCQs • 90 Mins' },
                    ]
                  },
                  {
                    module: 'm4',
                    title: 'Internet of Things (IOT)',
                    hindiTitle: 'इंटरनेट ऑफ थिंग्स एवं अनुप्रयोग',
                    badge: 'M4-R5.1',
                    bg: 'bg-[#eaf5f2]',
                    border: 'border-[#cce8e0]',
                    syllabusLink: '/syllabus',
                    tests: [
                      { id: 'm4-test-1', num: 1, title: 'Test 1: IoT Architecture', sub: '50 MCQs • 45 Mins' },
                      { id: 'm4-test-2', num: 2, title: 'Test 2: Sensors & Arduino', sub: '50 MCQs • 45 Mins' },
                      { id: 'm4-test-3', num: 3, title: 'Test 3: Protocols & Security', sub: '50 MCQs • 45 Mins' },
                      { id: 'm4-test-4', num: 4, title: 'Test 4: Grand Exam Simulator', sub: '100 MCQs • 90 Mins' },
                    ]
                  },
                  {
                    module: 'ccc',
                    title: 'Course on Computer Concepts (CCC)',
                    hindiTitle: 'ट्रिपल सी संपूर्ण ऑनलाइन परीक्षा सिमुलेटर',
                    badge: 'CCC NIELIT',
                    bg: 'bg-[#fef8ee]',
                    border: 'border-[#fce3b8]',
                    syllabusLink: '/ccc-hub',
                    tests: [
                      { id: 'ccc-test-1', num: 1, title: 'Test 1: Computer Fundamentals', sub: '50 MCQs • 45 Mins' },
                      { id: 'ccc-test-2', num: 2, title: 'Test 2: LibreOffice & Web', sub: '50 MCQs • 45 Mins' },
                      { id: 'ccc-test-3', num: 3, title: 'Test 3: Cyber Security & Banking', sub: '50 MCQs • 45 Mins' },
                      { id: 'ccc-test-4', num: 4, title: 'Test 4: Official 100 MCQs Simulator', sub: '100 MCQs • 90 Mins' },
                    ]
                  }
                ].map((paper) => (
                  <div
                    key={paper.module}
                    className={`${paper.bg} border ${paper.border} rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                            {paper.title}
                          </h3>
                          <p className="text-xs text-blue-700 font-semibold mt-0.5">
                            {paper.hindiTitle}
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs shrink-0">
                          {paper.badge}
                        </span>
                      </div>

                      {/* 4 Tests Grid (2x2) */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {paper.tests.map((t) => {
                          // Find matching test from state
                          const targetTest = quizzes.find(q => q.id === t.id);

                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                if (targetTest) {
                                  handleStartTest(targetTest);
                                } else {
                                  // Fallback direct start
                                  const fallback = quizzes.find(q => q.module === paper.module) || quizzes[0];
                                  if (fallback) handleStartTest(fallback);
                                }
                              }}
                              className="bg-white hover:bg-blue-50/60 active:scale-[0.98] rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
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
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <Link
                        to={paper.syllabusLink}
                        className="px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                      >
                        View Syllabus
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedModuleFilter(paper.module);
                          setSearchParams({ module: paper.module });
                        }}
                        className="px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                      >
                        All Tests
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW MODE B: FILTERED MODULE TESTS VIEW (Detailed List / Grid)            */}
            {/* ========================================================================= */}
            {selectedModuleFilter !== 'all' && (
              <div className="space-y-4 pt-2">
                
                {/* Back to All Papers Action */}
                <div className="flex items-center justify-between bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedModuleFilter('all');
                        setSearchParams({});
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>सभी पेपर्स देखें (Back to All Papers)</span>
                    </button>
                    <span className="text-xs font-bold text-slate-500 hidden sm:inline">•</span>
                    <span className="text-xs font-bold text-blue-700 hidden sm:inline">
                      {filteredQuizzes.length} ऑनलाइन CBT टेस्ट उपलब्ध
                    </span>
                  </div>

                  <Link
                    to="/syllabus"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2"
                  >
                    पाठ्यक्रम (Syllabus) देखें
                  </Link>
                </div>

                {/* Tests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredQuizzes.map((quiz, idx) => {
                    const testNumber = idx + 1;

                    return (
                      <div
                        key={quiz.id}
                        className="relative bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
                      >
                        {/* Red Circular Number Sticker Overlay */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-white z-10">
                          {testNumber}
                        </div>

                        {/* Test Name & Details */}
                        <div className="my-2 space-y-1.5 pl-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {quiz.moduleLabel || quiz.module.toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                              <Timer className="w-3.5 h-3.5 text-slate-400" />
                              <span>{quiz.durationMinutes || 45} मिनट</span>
                            </span>
                          </div>

                          <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                            {quiz.title}
                          </h3>

                          {quiz.hindiTitle && (
                            <p className="text-xs font-bold text-blue-700">
                              {quiz.hindiTitle}
                            </p>
                          )}

                          {quiz.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                              {quiz.description}
                            </p>
                          )}
                        </div>

                        {/* Test Info Pills & Start Button */}
                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <div className="text-[11px] text-slate-600 font-medium">
                            <span>{quiz.questions?.length || 50} MCQs</span>
                            <span className="mx-1.5 text-slate-300">•</span>
                            <span>पूर्णांक: {quiz.totalMarks || 50}</span>
                          </div>

                          <button
                            onClick={() => handleStartTest(quiz)}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs transition-all"
                          >
                            <span>Start Test</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredQuizzes.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3 p-6">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">कोई टेस्ट नहीं मिला (No Tests Found)</h4>
                <p className="text-xs text-slate-500">इस विषय में नए टेस्ट जल्द ही जोड़े जाएंगे। अन्य विषयों का चयन करें।</p>
                <button
                  onClick={() => {
                    setSelectedModuleFilter('all');
                    setSearchParams({});
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  सभी टेस्ट देखें (View All Tests)
                </button>
              </div>
            )}

            {/* Bottom Info Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-100 text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                  🎓
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">क्या आप NIELIT O Level व CCC की थ्योरी पढ़ना चाहते हैं?</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">सभी 4 पेपर्स और ट्रिपल सी के संपूर्ण हिंदी नोट्स एवं महत्वपूर्ण फॉर्मूले मुफ्त में उपलब्ध हैं।</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/notes"
                  className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg font-bold text-xs transition-colors shadow-2xs flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>नोट्स पढ़ें</span>
                </Link>
                <Link
                  to="/o-level-result-calculator"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors shadow-2xs"
                >
                  <span>60:40 कैलकुलेटर</span>
                </Link>
              </div>
            </div>

            {/* In-Directory High-Value Ad Placement */}
            <AdBanner slotId="mocktest-directory-bottom" format="horizontal" fallbackType="app" />

          </div>
        )}

        {/* ================= VIEW 2: ACTIVE TEST SESSION OR RESULT ================= */}
        {selectedQuiz && (
          <div className="space-y-6">
            {/* Sticky/Top Navigation Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExitTest}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>बाहर आएं (Exit)</span>
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                      {selectedQuiz.moduleLabel || selectedQuiz.module}
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {selectedQuiz.title}
                    </h2>
                  </div>
                </div>
              </div>

              {!isSubmitted ? (
                <div className="flex items-center gap-3">
                  {/* Timer Badge */}
                  <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm font-black border shadow-2xs ${
                    timeLeft < 180 
                      ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    <Timer className={`w-4 h-4 ${timeLeft < 180 ? 'text-rose-600' : 'text-blue-600'}`} />
                    <span>{formatTime(timeLeft)}</span>
                  </div>

                  {/* Mobile Palette Toggle */}
                  <button
                    onClick={() => setShowMobilePalette(prev => !prev)}
                    className="lg:hidden px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>प्रश्नावली ({currentIndex + 1}/{questions.length})</span>
                  </button>

                  <button
                    onClick={handleSubmitTest}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>सबमिट करें (Submit)</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartTest(selectedQuiz)}
                    className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>दोबारा दें (Retake)</span>
                  </button>
                  <button
                    onClick={handleExitTest}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    सभी टेस्ट देखें
                  </button>
                </div>
              )}
            </div>

            {/* RESULTS SCREEN */}
            {isSubmitted ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* Result Summary Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center space-y-6 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
                    <Award className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">NIELIT CBT Scorecard</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      {calculatedScore >= (selectedQuiz.passingMarks || 25) ? '🎉 बधाई! आप पास हो गए (Test Passed)' : '⚠️ पुनः अभ्यास की आवश्यकता है (Keep Practicing)'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      आधिकारिक NIELIT सीबीटी ग्रेडिंग प्रणाली के अनुसार मूल्यांकित
                    </p>
                  </div>

                  {/* 4 Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-400 block font-bold">प्राप्तांक (Your Score)</span>
                      <span className="text-2xl font-black text-blue-600">{calculatedScore} / {totalMarks}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-400 block font-bold">प्रतिशत (Percentage)</span>
                      <span className="text-2xl font-black text-slate-900">{percentage}%</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-400 block font-bold">NIELIT ग्रेड</span>
                      <span className={`text-2xl font-black ${percentage >= 75 ? 'text-emerald-600' : percentage >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                        ग्रेड {percentage >= 85 ? 'S' : percentage >= 75 ? 'A' : percentage >= 65 ? 'B' : percentage >= 55 ? 'C' : percentage >= 50 ? 'D' : 'F'}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-xs text-slate-400 block font-bold">कुल हल किए</span>
                      <span className="text-2xl font-black text-slate-900">{answeredCount} / {questions.length}</span>
                    </div>
                  </div>

                  {/* Grading Benchmark Key */}
                  <div className="text-[11px] text-slate-500 flex flex-wrap justify-center gap-3 sm:gap-4 pt-1 bg-slate-50 p-2.5 rounded-xl max-w-xl mx-auto border border-slate-200/60 font-semibold">
                    <span className="text-emerald-700">Grade S: ≥85% (उत्कृष्ट)</span>
                    <span className="text-blue-700">Grade A: 75-84%</span>
                    <span className="text-indigo-700">Grade B: 65-74%</span>
                    <span className="text-amber-700">Grade C: 55-64%</span>
                    <span className="text-orange-700">Grade D: 50-54%</span>
                    <span className="text-rose-700">Grade F: &lt;50% (फेल)</span>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleStartTest(selectedQuiz)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>दोबारा टेस्ट दें (Retake Test)</span>
                    </button>
                    <button
                      onClick={handleExitTest}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs sm:text-sm transition-all"
                    >
                      सभी टेस्ट देखें
                    </button>
                  </div>
                </div>

                {/* AD PLACEMENT 1: Test Result Banner */}
                <AdBanner slotId="mocktest-result-score-bottom" format="horizontal" fallbackType="app" />

                {/* Detailed Solution Review */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 space-y-6 shadow-xs">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                        विस्तृत उत्तर एवं हिंदी व्याख्या (Detailed Solutions)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">सभी {questions.length} प्रश्नों के सही उत्तर और स्पष्टीकरण देखें</p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    {questions.map((q, idx) => {
                      const userChoice = userAnswers[q.id];
                      const isCorrect = userChoice === q.correctIndex;
                      const isUnanswered = userChoice === undefined;

                      return (
                        <div
                          key={q.id || idx}
                          className={`p-4 sm:p-5 rounded-2xl border ${
                            isUnanswered
                              ? 'border-slate-200 bg-slate-50/60'
                              : isCorrect
                              ? 'border-emerald-200 bg-emerald-50/30'
                              : 'border-rose-200 bg-rose-50/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="space-y-1">
                              <span className="font-black text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                प्रश्न {idx + 1} / {questions.length}
                              </span>
                              <h4 className="font-bold text-sm sm:text-base text-slate-900">{q.question}</h4>
                              {q.hindiQuestion && (
                                <p className="text-xs sm:text-sm font-semibold text-slate-700">{q.hindiQuestion}</p>
                              )}
                            </div>

                            <div className="shrink-0">
                              {isUnanswered ? (
                                <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">
                                  हल नहीं किया
                                </span>
                              ) : isCorrect ? (
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> सही (+{q.marks || 1})
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> गलत उत्तर
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs sm:text-sm">
                            {q.options.map((opt, optIdx) => {
                              const isThisCorrect = optIdx === q.correctIndex;
                              const isThisUserChoice = optIdx === userChoice;

                              let bgClass = 'bg-white border-slate-200 text-slate-700';
                              if (isThisCorrect) {
                                bgClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                              } else if (isThisUserChoice && !isThisCorrect) {
                                bgClass = 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-1 ring-rose-500';
                              }

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-3 rounded-xl border flex items-center justify-between ${bgClass}`}
                                >
                                  <span className="flex items-center gap-2">
                                    <strong className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-800">
                                      {String.fromCharCode(65 + optIdx)}
                                    </strong>
                                    <span>{opt}</span>
                                  </span>
                                  {isThisCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>

                          {q.explanation && (
                            <div className="mt-3 p-3 bg-white/90 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                              <span className="font-black text-blue-700 block flex items-center gap-1">
                                💡 उत्तर की व्याख्या (Concept & Explanation):
                              </span>
                              <p className="leading-relaxed text-slate-700">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AD PLACEMENT 2: End of Review Banner */}
                <AdBanner slotId="mocktest-result-solutions-bottom" format="horizontal" fallbackType="notes" />
              </div>
            ) : (
              /* LIVE TEST QUESTION SOLVING & PALETTE SPLIT */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Main Question Solving Area */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
                    {currentQ ? (
                      <>
                        {/* Question Meta Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                              प्रश्न {currentIndex + 1} of {questions.length}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                              +{currentQ.marks || 1} Mark
                            </span>
                          </div>

                          <button
                            onClick={() => toggleMarkForReview(currentQ.id)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                              markedForReview[currentQ.id]
                                ? 'bg-purple-100 text-purple-800 border-purple-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                          </button>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-2 py-1">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                            {currentQ.question}
                          </h3>
                          {currentQ.hindiQuestion && (
                            <p className="text-sm font-bold text-slate-700">
                              {currentQ.hindiQuestion}
                            </p>
                          )}
                        </div>

                        {/* Options Radio List */}
                        <div className="space-y-3 pt-1">
                          {currentQ.options.map((option, optIdx) => {
                            const isSelected = userAnswers[currentQ.id] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                                className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50/90 text-blue-950 font-extrabold ring-1 ring-blue-600 shadow-2xs'
                                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800 hover:bg-slate-50/60'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="leading-relaxed">{option}</span>
                                </div>

                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-slate-500 text-xs">
                        इस टेस्ट में कोई प्रश्न उपलब्ध नहीं है।
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-xs">
                    <button
                      onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> पिछला (Prev)
                    </button>

                    {userAnswers[currentQ?.id] !== undefined && (
                      <button
                        onClick={() => {
                          const updated = { ...userAnswers };
                          delete updated[currentQ.id];
                          setUserAnswers(updated);
                        }}
                        className="text-xs text-slate-400 hover:text-rose-600 underline font-medium"
                      >
                        उत्तर हटाएं (Clear)
                      </button>
                    )}

                    {currentIndex < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        अगला (Next) <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitTest}
                        className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                      >
                        सबमिट करें (Submit)
                      </button>
                    )}
                  </div>

                  {/* Non-intrusive Ad Banner in Exam Solving Window */}
                  <AdBanner slotId="mocktest-question-bottom" format="horizontal" fallbackType="app" />
                </div>

                {/* Right Side Palette Sidebar (Desktop & Mobile Drawer) */}
                <div className={`w-full bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs ${
                  showMobilePalette ? 'block fixed inset-x-4 top-20 bottom-10 z-40 overflow-y-auto' : 'hidden lg:block'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Question Palette</h4>
                      <p className="text-[11px] text-slate-500">प्रश्नों की सूची व स्थिति</p>
                    </div>
                    {showMobilePalette && (
                      <button
                        onClick={() => setShowMobilePalette(false)}
                        className="lg:hidden text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg"
                      >
                        बंद करें
                      </button>
                    )}
                  </div>

                  {/* Live Stats Summary Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800">
                      <span className="block text-xs font-black">{answeredCount}</span>
                      <span>Answered</span>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-xl border border-purple-100 text-purple-800">
                      <span className="block text-xs font-black">{Object.values(markedForReview).filter(Boolean).length}</span>
                      <span>Marked</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                      <span className="block text-xs font-black">{questions.length - answeredCount}</span>
                      <span>Pending</span>
                    </div>
                  </div>

                  {/* Interactive Question Numbers Grid */}
                  <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
                    {questions.map((q, idx) => {
                      const isAnswered = userAnswers[q.id] !== undefined;
                      const isMarked = markedForReview[q.id];
                      const isCurrent = idx === currentIndex;

                      let btnClass = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
                      if (isCurrent) {
                        btnClass = 'ring-2 ring-blue-600 font-black scale-105 shadow-2xs';
                      }
                      if (isMarked) {
                        btnClass += ' bg-purple-100 text-purple-800 border-purple-300 font-extrabold';
                      } else if (isAnswered) {
                        btnClass += ' bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold';
                      }

                      return (
                        <button
                          key={q.id || idx}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setShowMobilePalette(false);
                          }}
                          className={`w-full aspect-square rounded-xl text-xs flex items-center justify-center border transition-all ${btnClass}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sidebar Ad Placement */}
                  <div className="pt-2 border-t border-slate-100">
                    <AdBanner slotId="mocktest-palette-sidebar" format="rectangle" fallbackType="mock-test" />
                  </div>

                  <button
                    onClick={handleSubmitTest}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-colors shadow-2xs"
                  >
                    सबमिट करें (Submit Test)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
