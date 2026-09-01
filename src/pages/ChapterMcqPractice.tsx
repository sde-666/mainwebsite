import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Award, 
  BookOpen, 
  Check, 
  HelpCircle, 
  Layers, 
  Share2, 
  Bookmark, 
  ListOrdered, 
  ChevronLeft,
  ChevronRight,
  Flame,
  Volume2
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { chapterMcqService } from '../services/chapterMcqService';
import { ChapterMcqItem, ChapterMeta, PaperMeta } from '../types/chapterMcq';

export function ChapterMcqPractice() {
  const { moduleId = 'm1-r5', chapterNumber = '1' } = useParams<{ moduleId: string; chapterNumber: string }>();
  const navigate = useNavigate();

  const chapterNum = parseInt(chapterNumber, 10) || 1;

  const [paper, setPaper] = useState<PaperMeta | undefined>(undefined);
  const [chapterMeta, setChapterMeta] = useState<ChapterMeta | undefined>(undefined);
  const [questions, setQuestions] = useState<ChapterMcqItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // User answers map: { [questionId]: selectedOptionIndex (0-3) }
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  
  // Language preference: 'both' | 'en' | 'hi'
  const [langMode, setLangMode] = useState<'both' | 'en' | 'hi'>('both');
  
  // Bookmarks: set of question IDs
  const [bookmarks, setBookmarks] = useState<{ [qId: string]: boolean }>({});
  
  // Question Palette Drawer open/close
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  
  // End of chapter completion summary modal
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);

  // Utility to shuffle an array (Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const pMeta = chapterMcqService.getPaperMeta(moduleId);
    setPaper(pMeta);

    const cMeta = chapterMcqService.getChapterMeta(moduleId, chapterNum);
    setChapterMeta(cMeta);

    const mcqs = chapterMcqService.getByChapter(moduleId, chapterNum);
    setQuestions(shuffleArray(mcqs));
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompletedModalOpen(false);

    // Subscribe to real-time changes from Firestore
    const unsub = chapterMcqService.subscribe(() => {
      const updatedMcqs = chapterMcqService.getByChapter(moduleId, chapterNum);
      
      // Keep existing shuffled order but update contents, append any new questions
      setQuestions(prevQuestions => {
        const prevIds = prevQuestions.map(q => q.id);
        const newMcqs = updatedMcqs.filter(q => !prevIds.includes(q.id));
        
        const updatedList = prevQuestions.map(prevQ => {
           const found = updatedMcqs.find(q => q.id === prevQ.id);
           return found || prevQ;
        }).filter(q => updatedMcqs.some(uQ => uQ.id === q.id)); // Also remove deleted ones
        
        return [...updatedList, ...newMcqs];
      });

      const updatedCMeta = chapterMcqService.getChapterMeta(moduleId, chapterNum);
      setChapterMeta(updatedCMeta);
      const updatedPMeta = chapterMcqService.getPaperMeta(moduleId);
      setPaper(updatedPMeta);
    });

    return () => unsub();
  }, [moduleId, chapterNum]);

  // Current question item
  const currentQ = questions[currentIndex];

  // Calculate live stats
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  
  let correctCount = 0;
  let wrongCount = 0;

  questions.forEach((q) => {
    if (userAnswers[q.id] !== undefined) {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }
  });

  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Handle instant option click
  const handleSelectOption = (optIndex: number) => {
    if (!currentQ) return;
    if (userAnswers[currentQ.id] !== undefined) {
      // Already answered - clicking again allows re-attempting or is locked. Let's allow clicking to update if desired.
      setUserAnswers(prev => ({
        ...prev,
        [currentQ.id]: optIndex
      }));
      return;
    }

    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  // Toggle bookmark
  const toggleBookmark = (qId: string) => {
    setBookmarks(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Reset entire chapter test
  const handleResetChapter = () => {
    if (window.confirm('Are you sure you want to reset all answers and re-practice this chapter?')) {
      const mcqs = chapterMcqService.getByChapter(moduleId, chapterNum);
      setQuestions(shuffleArray(mcqs));
      setUserAnswers({});
      setCurrentIndex(0);
      setIsCompletedModalOpen(false);
    }
  };

  // Navigate to Next
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompletedModalOpen(true);
    }
  };

  // Navigate to Prev
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!currentQ || totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No MCQs Found for This Chapter</h2>
          <p className="text-xs text-slate-600 mb-6">
            Questions for {paper?.title} (Chapter {chapterNum}) have not been populated yet or were cleared.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                chapterMcqService.resetToSeed();
                window.location.reload();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Restore Standard MCQs
            </button>
            <Link
              to={`/chapter-wise-mcq/${moduleId}`}
              className="block w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Back to Chapter List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedAnswer = userAnswers[currentQ.id];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = isAnswered && selectedAnswer === currentQ.correctIndex;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between">
      <SEO
        title={`Chapter ${chapterNum}: ${chapterMeta?.title || 'MCQs'} - Practice | Skilldotpy`}
        description={`Interactive instant chapter-wise MCQ practice for ${paper?.title} Chapter ${chapterNum}. Get immediate feedback on each question with full Hindi and English explanations.`}
        canonicalUrl={`/chapter-wise-mcq/${moduleId}/${chapterNum}`}
      />

      {/* =========================================================================
          TOP STICKY HEADER & PROGRESS BAR
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          
          <div className="flex items-center justify-between gap-3">
            {/* Back to Chapters */}
            <div className="flex items-center gap-2">
              <Link
                to={`/chapter-wise-mcq/${moduleId}`}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                title="Back to All Chapters"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {paper?.code || moduleId.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Chapter {chapterNum}
                  </span>
                </div>
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                  {chapterMeta?.title || currentQ.chapterTitle || 'Chapter Practice'}
                </h1>
              </div>
            </div>

            {/* Score & Palette Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Score Badges */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {correctCount} Right
                </span>
                <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                  <XCircle className="w-3.5 h-3.5" /> {wrongCount} Wrong
                </span>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold text-slate-700 border border-slate-200">
                <button
                  onClick={() => setLangMode('both')}
                  className={`px-2 py-1 rounded ${langMode === 'both' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                >
                  Both
                </button>
                <button
                  onClick={() => setLangMode('hi')}
                  className={`px-2 py-1 rounded ${langMode === 'hi' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLangMode('en')}
                  className={`px-2 py-1 rounded ${langMode === 'en' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'}`}
                >
                  Eng
                </button>
              </div>

              {/* Question Palette Trigger */}
              <button
                onClick={() => setIsPaletteOpen(prev => !prev)}
                className={`p-2 rounded-lg border transition-colors ${
                  isPaletteOpen 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title="Open Question Palette"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          QUESTION PALETTE SLIDE-DOWN DRAWER
         ========================================================================= */}
      {isPaletteOpen && (
        <div className="bg-white border-b border-slate-200 shadow-lg px-4 py-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Question Palette ({answeredCount} / {totalQuestions} Answered)
              </span>
              <button
                onClick={handleResetChapter}
                className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Answers
              </button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-48 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCur = idx === currentIndex;
                let btnStyle = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
                
                if (ans !== undefined) {
                  if (ans === q.correctIndex) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                  } else {
                    btnStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
                  }
                }

                if (isCur) {
                  btnStyle += ' ring-2 ring-blue-500 ring-offset-1 scale-105';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPaletteOpen(false);
                    }}
                    className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN INTERACTIVE QUESTION CANVAS (ONE QUESTION AT A TIME)
         ========================================================================= */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
        
        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-8 relative">
          
          {/* Top Question Status Row */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-900 text-white shadow-2xs">
                Q {currentIndex + 1} / {totalQuestions}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                1 Mark
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  bookmarks[currentQ.id]
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                }`}
                title="Bookmark this question"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2 mb-6">
            {(langMode === 'both' || langMode === 'en') && (
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h2>
            )}

            {(langMode === 'both' || langMode === 'hi') && currentQ.hindiQuestion && (
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 leading-relaxed pt-1">
                {currentQ.hindiQuestion}
              </h3>
            )}
          </div>

          {/* =========================================================================
              4 OPTIONS WITH INSTANT RIGHT/WRONG FEEDBACK UPON TICK
             ========================================================================= */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
              const isSelected = selectedAnswer === optIdx;
              const isCorrectOption = optIdx === currentQ.correctIndex;
              const hindiOpt = currentQ.hindiOptions?.[optIdx];

              let cardClasses = 'bg-slate-50/80 hover:bg-blue-50/60 border-slate-200 text-slate-800';
              let badgeClasses = 'bg-white text-slate-700 border-slate-300';
              let statusIcon = null;

              if (isAnswered) {
                if (isCorrectOption) {
                  // The right answer turns vibrant emerald green
                  cardClasses = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                  badgeClasses = 'bg-emerald-600 text-white border-emerald-600';
                  statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                } else if (isSelected && !isCorrectOption) {
                  // The wrong answer chosen by student turns red
                  cardClasses = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold ring-1 ring-rose-400';
                  badgeClasses = 'bg-rose-600 text-white border-rose-600';
                  statusIcon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                } else {
                  // Other unselected options fade slightly
                  cardClasses = 'bg-slate-50/40 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 group cursor-pointer shadow-2xs ${cardClasses}`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs mt-0.5 ${badgeClasses}`}>
                      {optionLetter}
                    </span>

                    <div className="space-y-0.5 min-w-0">
                      {(langMode === 'both' || langMode === 'en') && (
                        <p className="text-xs sm:text-sm font-medium leading-relaxed">
                          {option}
                        </p>
                      )}
                      {(langMode === 'both' || langMode === 'hi') && hindiOpt && (
                        <p className="text-xs text-slate-600 leading-normal">
                          {hindiOpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {statusIcon}
                </button>
              );
            })}
          </div>

          {/* =========================================================================
              INSTANT EXPLANATION ACCORDION / BOX (SLIDES IN UPON ANSWERING)
             ========================================================================= */}
          {isAnswered && (
            <div className="mt-6 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className={`p-4 sm:p-5 rounded-xl border ${
                isCorrect 
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Instant Result: {isCorrect ? 'Correct Answer! (सही उत्तर)' : 'Incorrect (गलत उत्तर)'}</span>
                  </span>

                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200">
                    Correct Option: {String.fromCharCode(65 + currentQ.correctIndex)}
                  </span>
                </div>

                {/* Explanation Text in English & Hindi */}
                <div className="text-xs sm:text-[13px] leading-relaxed space-y-1.5 mt-2">
                  {currentQ.explanation && (
                    <p className="font-medium text-slate-800">
                      💡 <strong>Explanation:</strong> {currentQ.explanation}
                    </p>
                  )}
                  {currentQ.hindiExplanation && (
                    <p className="text-slate-700">
                      🇮🇳 <strong>व्याख्या:</strong> {currentQ.hindiExplanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* =========================================================================
          BOTTOM STICKY CONTROL BAR (PREV, NEXT, FINISH)
         ========================================================================= */}
      <footer className="sticky bottom-0 z-30 bg-white border-t border-slate-200 shadow-md py-3 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentIndex === 0
                ? 'opacity-40 bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200 shadow-2xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Quick Counter */}
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Question {currentIndex + 1} of {totalQuestions}
          </span>

          {/* Next or Finish Button */}
          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsCompletedModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Complete Chapter</span>
            </button>
          )}

        </div>
      </footer>

      {/* =========================================================================
          CHAPTER COMPLETION MODAL & SCORECARD
         ========================================================================= */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Chapter {chapterNum} Completed!
            </span>

            <h3 className="text-2xl font-black text-slate-900 mt-2">
              Practice Score Summary
            </h3>

            <p className="text-xs text-slate-600 mt-1">
              {chapterMeta?.title || 'Chapter Practice Complete'}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="p-2">
                <span className="text-xl font-black text-slate-900 block">{totalQuestions}</span>
                <span className="text-[11px] font-semibold text-slate-500">Total</span>
              </div>
              <div className="p-2 border-x border-slate-200">
                <span className="text-xl font-black text-emerald-600 block">{correctCount}</span>
                <span className="text-[11px] font-semibold text-slate-500">Correct</span>
              </div>
              <div className="p-2">
                <span className="text-xl font-black text-rose-600 block">{wrongCount}</span>
                <span className="text-[11px] font-semibold text-slate-500">Wrong</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs font-bold text-slate-600 mb-1">
                Accuracy Score: <strong className="text-blue-600">{accuracy}%</strong>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${accuracy >= 70 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setUserAnswers({});
                  setCurrentIndex(0);
                  setIsCompletedModalOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Re-Practice This Chapter
              </button>

              {chapterNum < (paper?.chaptersCount || 9) && (
                <button
                  onClick={() => {
                    navigate(`/chapter-wise-mcq/${moduleId}/${chapterNum + 1}`);
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Go to Chapter {chapterNum + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <Link
                to={`/chapter-wise-mcq/${moduleId}`}
                className="block w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Back to All Chapters
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
