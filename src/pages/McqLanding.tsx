import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Timer, 
  Sparkles, 
  Zap, 
  Award, 
  FileCheck2, 
  BookOpen, 
  Check, 
  Laptop, 
  Smartphone,
  Flame
} from 'lucide-react';
import { SEO } from '../components/SEO';

export function McqLanding() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="NIELIT MCQ Practice & Mock Tests | Skilldotpy"
        description="Choose between full 100-question CBT Mock Tests or interactive Chapter-Wise MCQs with instant feedback for NIELIT O Level (M1, M2, M3, M4) and CCC."
        canonicalUrl="/mcqs"
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-12 lg:py-16 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Official NIELIT R5.1 & CCC MCQ Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Select Your Preferred <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-200">MCQ Study Mode</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Practice with full 100-question timed exam simulations or master the syllabus concept-by-concept with instant answer explanations.
          </p>
        </div>
      </section>

      {/* TWO BIG CARDS SECTION */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
            
            {/* BIG CARD 1: FULL CBT MOCK TESTS */}
            <div className="group relative rounded-3xl bg-white border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Timer className="w-7 h-7" />
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Exam Simulator
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  MCQ Tests (Full CBT Mock)
                </h2>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Real 100-Question Timed CBT examination simulator designed as per official NIELIT guidelines with comprehensive score analytics.
                </p>

                {/* Feature Bullets */}
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>100 Questions • 90 Mins:</strong> Full length official paper simulation</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Real CBT Palette:</strong> Marked for review, answered & unanswered tabs</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Official Scorecard:</strong> Grade (S, A, B, C, D) & speed analysis</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>M1, M2, M3, M4 & CCC:</strong> Comprehensive test sets</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  to="/mock-test"
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-sm group-hover:gap-3 cursor-pointer"
                >
                  <span>Start Full CBT Mock Test</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* BIG CARD 2: CHAPTER WISE MCQ (INSTANT ANSWER) */}
            <div className="group relative rounded-3xl bg-white border-2 border-slate-200 hover:border-rose-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-xs group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                    <Layers className="w-7 h-7" />
                  </div>
                  <span className="bg-rose-100 text-rose-800 text-xs font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Result
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                  Chapter Wise MCQ
                </h2>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Interactive 1-by-1 practice with instant right/wrong answer feedback and bilingual explanations as soon as you select an option.
                </p>

                {/* Feature Bullets */}
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Instant Feedback:</strong> Tick an option & immediately see if it's correct</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Bilingual Explanations:</strong> Detailed reason in Hindi & English</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Chapter-by-Chapter:</strong> Master each topic before moving forward</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Graphic Paper Hub:</strong> Explore all chapters across M1, M2, M3, M4 & CCC</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  to="/chapter-wise-mcq"
                  className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-sm group-hover:gap-3 cursor-pointer"
                >
                  <span>Explore Chapter Wise MCQs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

          {/* Quick Help Strip */}
          <div className="mt-12 bg-blue-50/60 rounded-2xl border border-blue-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Want to revise theory notes first?</h4>
                <p className="text-xs text-slate-600">Read structured chapter-wise notes and download official PDF study materials.</p>
              </div>
            </div>

            <Link
              to="/notes"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs shrink-0"
            >
              <span>Browse Theory Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
