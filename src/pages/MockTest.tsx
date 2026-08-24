import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Timer, 
  RotateCcw, 
  Award, 
  Smartphone, 
  ArrowRight, 
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  ShieldCheck,
  FileCheck,
  Check
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { quizService } from '../services/quizService';
import { DynamicQuizTest, QuizQuestionItem, UserTestResult } from '../types/database';
import { useAuth } from '../context/AuthContext';

export function MockTest() {
  const { isAdmin } = useAuth();
  const [quizzes, setQuizzes] = useState<DynamicQuizTest[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<DynamicQuizTest | null>(null);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');

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

  // Filter quizzes for the directory
  const filteredQuizzes = quizzes.filter(q => {
    if (selectedModuleFilter === 'all') return true;
    return q.module === selectedModuleFilter;
  });

  // Start a specific test
  const handleStartTest = (quiz: DynamicQuizTest) => {
    setSelectedQuiz(quiz);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setIsSubmitted(false);
    setTimeLeft((quiz.durationMinutes || 45) * 60);
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
      if (!window.confirm('Are you sure you want to exit? Your current test progress will be lost.')) return;
    }
    setSelectedQuiz(null);
    setIsSubmitted(false);
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

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <SEO
        title="O Level & CCC Online Mock Test 2026"
        description="Practice NIELIT CBT pattern online mock tests for O Level (M1, M2, M3, M4) & CCC. Instant score, timer, detailed solutions & answers by Skilldotpy."
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
        
        {/* ================= VIEW 1: TEST DIRECTORY (WHEN NO TEST IS ACTIVE) ================= */}
        {!selectedQuiz && (
          <div className="space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-2 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" /> NIELIT Online CBT Test Simulator
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                NIELIT O Level & CCC Online CBT Test Series
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Choose a subject test below to start your timed Computer Based Test (CBT) with instant scoring and detailed explanations.
              </p>

              {isAdmin && (
                <div className="pt-2">
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 bg-slate-900 text-amber-300 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Admin Mode: Create or Edit MCQ Quizzes</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Tests' },
                { id: 'm1', label: 'M1-R5: IT Tools' },
                { id: 'm2', label: 'M2-R5: Web Design' },
                { id: 'm3', label: 'M3-R5: Python' },
                { id: 'm4', label: 'M4-R5: IoT' },
                { id: 'ccc', label: 'NIELIT CCC' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedModuleFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedModuleFilter === filter.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Quizzes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {quiz.moduleLabel || quiz.module}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5 text-gray-400" />
                        {quiz.durationMinutes} Mins
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {quiz.title}
                    </h3>
                    {quiz.hindiTitle && (
                      <p className="text-xs font-medium text-blue-600">
                        {quiz.hindiTitle}
                      </p>
                    )}

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                      <div className="bg-slate-50 p-2 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 block">Questions</span>
                        <span className="font-bold text-gray-800">{quiz.questions?.length || 0}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 block">Total Marks</span>
                        <span className="font-bold text-gray-800">{quiz.totalMarks}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 block">Pass Marks</span>
                        <span className="font-bold text-emerald-600">{quiz.passingMarks}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      👥 {quiz.totalAttempts || 0} students attempted
                    </span>

                    <button
                      onClick={() => handleStartTest(quiz)}
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
                    >
                      <span>Start Online Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredQuizzes.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 space-y-3">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-900">No Tests Found</h4>
                <p className="text-xs text-gray-500">New tests added by Admin will appear here dynamically.</p>
              </div>
            )}

            {/* In-Directory High-Value Ad Placement */}
            <AdBanner slotId="mocktest-directory-bottom" format="horizontal" fallbackType="app" />

          </div>
        )}

        {/* ================= VIEW 2: ACTIVE TEST SESSION OR RESULT ================= */}
        {selectedQuiz && (
          <div className="space-y-6">
            
            {/* Top Bar Navigation & Timer */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExitTest}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors"
                >
                  ← Exit Test
                </button>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                    {selectedQuiz.moduleLabel}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate max-w-md">
                    {selectedQuiz.title}
                  </h2>
                </div>
              </div>

              {!isSubmitted ? (
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold ${
                    timeLeft < 180 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span>Time Left: {formatTime(timeLeft)}</span>
                  </div>

                  <button
                    onClick={handleSubmitTest}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    Submit Test
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartTest(selectedQuiz)}
                  className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Test</span>
                </button>
              )}
            </div>

            {/* RESULTS SCREEN */}
            {isSubmitted ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Result Card */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 text-center space-y-6 shadow-sm">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                    <Award className="w-8 h-8" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">
                      {calculatedScore >= (selectedQuiz.passingMarks || 25) ? '🎉 Test Passed!' : 'Needs Practice'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Evaluated according to official NIELIT CBT grading benchmarks.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 block font-medium">Your Score</span>
                      <span className="text-2xl font-extrabold text-blue-600">{calculatedScore} / {totalMarks}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 block font-medium">Percentage</span>
                      <span className="text-2xl font-extrabold text-gray-900">{percentage}%</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 block font-medium">NIELIT Grade</span>
                      <span className={`text-2xl font-extrabold ${percentage >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        Grade {percentage >= 85 ? 'S' : percentage >= 75 ? 'A' : percentage >= 65 ? 'B' : percentage >= 55 ? 'C' : percentage >= 50 ? 'D' : 'F'}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100">
                      <span className="text-xs text-gray-400 block font-medium">Attempted</span>
                      <span className="text-2xl font-extrabold text-gray-900">{answeredCount} / {questions.length}</span>
                    </div>
                  </div>

                  {/* Grading Key */}
                  <div className="text-[11px] text-gray-400 flex flex-wrap justify-center gap-3 pt-2">
                    <span>Grade S: ≥85%</span>
                    <span>Grade A: 75-84%</span>
                    <span>Grade B: 65-74%</span>
                    <span>Grade C: 55-64%</span>
                    <span>Grade D: 50-54%</span>
                  </div>
                </div>

                {/* PRIME AD PLACEMENT 1: Test Result Banner */}
                <AdBanner slotId="mock-test-result-top" format="horizontal" fallbackType="app" />

                {/* Question by Question Detailed Solution Review */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6">
                  <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
                    Detailed Solutions & Explanations ({questions.length} Questions)
                  </h3>

                  <div className="space-y-6">
                    {questions.map((q, idx) => {
                      const userChoice = userAnswers[q.id];
                      const isCorrect = userChoice === q.correctIndex;
                      const isUnanswered = userChoice === undefined;

                      return (
                        <div
                          key={q.id || idx}
                          className={`p-5 rounded-2xl border ${
                            isUnanswered
                              ? 'border-gray-200 bg-gray-50/50'
                              : isCorrect
                              ? 'border-emerald-200 bg-emerald-50/30'
                              : 'border-rose-200 bg-rose-50/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <span className="font-bold text-xs text-blue-600 block mb-1">
                                Question {idx + 1} of {questions.length}
                              </span>
                              <h4 className="font-bold text-sm text-gray-900">{q.question}</h4>
                              {q.hindiQuestion && (
                                <p className="text-xs text-gray-600 mt-1">{q.hindiQuestion}</p>
                              )}
                            </div>

                            <div className="shrink-0">
                              {isUnanswered ? (
                                <span className="text-[11px] font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                  Not Attempted
                                </span>
                              ) : isCorrect ? (
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{q.marks || 1})
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> Incorrect
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                            {q.options.map((opt, optIdx) => {
                              const isThisCorrect = optIdx === q.correctIndex;
                              const isThisUserChoice = optIdx === userChoice;

                              let bgClass = 'bg-white border-gray-200 text-gray-700';
                              if (isThisCorrect) {
                                bgClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                              } else if (isThisUserChoice && !isThisCorrect) {
                                bgClass = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                              }

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-3 rounded-xl border flex items-center justify-between ${bgClass}`}
                                >
                                  <span>
                                    <strong className="mr-2 font-mono">
                                      {String.fromCharCode(65 + optIdx)}.
                                    </strong>
                                    {opt}
                                  </span>
                                  {isThisCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>

                          {q.explanation && (
                            <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
                              <span className="font-bold text-blue-700 block">💡 Concept & Explanation:</span>
                              <p className="leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PRIME AD PLACEMENT 2: End of Review Banner */}
                <AdBanner slotId="mock-test-result-bottom" format="horizontal" fallbackType="notes" />

              </div>
            ) : (
              /* LIVE TEST QUESTION SOLVING PALETTE */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Question Box */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs min-h-[460px]">
                  {currentQ ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                          Question {currentIndex + 1} of {questions.length}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleMarkForReview(currentQ.id)}
                            className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                              markedForReview[currentQ.id]
                                ? 'bg-purple-100 text-purple-700 border-purple-300'
                                : 'bg-slate-50 text-slate-600 border-gray-200 hover:bg-slate-100'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                          {currentQ.question}
                        </h3>
                        {currentQ.hindiQuestion && (
                          <p className="text-xs sm:text-sm font-medium text-gray-600">
                            {currentQ.hindiQuestion}
                          </p>
                        )}
                      </div>

                      {/* Options Radio List */}
                      <div className="space-y-2.5 pt-2">
                        {currentQ.options.map((option, optIdx) => {
                          const isSelected = userAnswers[currentQ.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                              className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold ring-1 ring-blue-600 shadow-2xs'
                                  : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                                  isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{option}</span>
                              </div>

                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 text-xs">
                      No questions in this test yet.
                    </div>
                  )}

                  {/* Navigation footer buttons */}
                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    {userAnswers[currentQ?.id] !== undefined && (
                      <button
                        onClick={() => {
                          const updated = { ...userAnswers };
                          delete updated[currentQ.id];
                          setUserAnswers(updated);
                        }}
                        className="text-[11px] text-gray-400 hover:text-rose-600 underline font-medium"
                      >
                        Clear Response
                      </button>
                    )}

                    {currentIndex < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitTest}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
                      >
                        Submit Test
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Side Question Palette Navigator */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 shadow-xs h-fit">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Question Palette</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Click any number to jump directly</p>
                  </div>

                  <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
                    {questions.map((q, idx) => {
                      const isAnswered = userAnswers[q.id] !== undefined;
                      const isMarked = markedForReview[q.id];
                      const isCurrent = idx === currentIndex;

                      let btnClass = 'bg-gray-100 text-gray-600 border-gray-200';
                      if (isCurrent) {
                        btnClass = 'ring-2 ring-blue-600 font-bold';
                      }
                      if (isMarked) {
                        btnClass += ' bg-purple-100 text-purple-700 border-purple-300 font-bold';
                      } else if (isAnswered) {
                        btnClass += ' bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
                      }

                      return (
                        <button
                          key={q.id || idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-full aspect-square rounded-xl text-xs flex items-center justify-center border transition-all ${btnClass}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-md bg-emerald-100 border border-emerald-300"></div>
                      <span>Answered ({answeredCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-md bg-purple-100 border border-purple-300"></div>
                      <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-md bg-gray-100 border border-gray-200"></div>
                      <span>Not Answered ({questions.length - answeredCount})</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitTest}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                  >
                    Finish & Submit Test
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
