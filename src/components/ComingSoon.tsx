import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  Bell, 
  BookOpen, 
  CheckCircle2, 
  ArrowLeft, 
  Mail, 
  ShieldCheck, 
  GraduationCap, 
  Play, 
  FileText,
  Check
} from 'lucide-react';
import { SEO } from './SEO';

interface ComingSoonProps {
  courseTitle?: string;
  courseCategory?: string;
  badge?: string;
  teacherName?: string;
  isAllCourses?: boolean;
}

export function ComingSoon({
  courseTitle,
  courseCategory,
  badge = 'Coming Soon / जल्द आ रहा है',
  teacherName = 'Er. Aditya Pathak',
  isAllCourses = false
}: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    try {
      const existing = JSON.parse(localStorage.getItem('skilldotpy_coming_soon_subscribers') || '[]');
      existing.push({ email, courseTitle: courseTitle || 'All Courses', date: Date.now() });
      localStorage.setItem('skilldotpy_coming_soon_subscribers', JSON.stringify(existing));
    } catch (e) {}
    setIsSubscribed(true);
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <SEO
        title={courseTitle ? `${courseTitle} - Coming Soon | Skilldotpy` : 'Paid Video Courses - Coming Soon | Skilldotpy'}
        description="We are preparing top-tier HD video lectures, chapter notes, and solved practical labs. Stay tuned!"
      />

      <div className="max-w-3xl w-full">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Courses</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden text-center p-8 sm:p-12 relative">
          {/* Subtle Decorative Background Aura */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider mb-6 shadow-2xs">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
            {courseTitle ? (
              <span>
                {courseTitle} <span className="text-blue-600">is getting ready!</span>
              </span>
            ) : (
              <span>
                Comprehensive Video Courses <span className="text-blue-600">Launching Very Soon!</span>
              </span>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-xl mx-auto leading-relaxed">
            {courseTitle
              ? `Our master instructor ${teacherName} is recording high-definition video lectures, creating comprehensive chapter-wise theory & formula PDF notes, and solving past year practicals for this batch.`
              : 'We are currently preparing full video batches with handwritten PDF notes, solved practical lab assignments, and CBT test series according to the latest NIELIT R5.1 curriculum.'}
          </p>

          {/* What to expect cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-8 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <Play className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-900">HD Video Lectures</h2>
              <p className="text-[11px] text-slate-500 leading-snug">
                Step-by-step Hindi & English video explanations from basic to advanced.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-900">Chapter PDF Notes</h2>
              <p className="text-[11px] text-slate-500 leading-snug">
                Color-coded formula sheets, handwritten diagrams, and high-yield notes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-900">Practical & MCQs</h2>
              <p className="text-[11px] text-slate-500 leading-snug">
                100% solved coding labs, live compiler practice, and CBT mock sets.
              </p>
            </div>
          </div>

          {/* Email Notification Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-lg mx-auto">
            {isSubscribed ? (
              <div className="py-2 text-emerald-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you! We'll notify you as soon as this course is uploaded.</span>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Get Notified on Launch & Early Bird Discount</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-black transition-colors shadow-md shrink-0 cursor-pointer"
                  >
                    Notify Me
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  No spam. We'll only send a single email with the launch announcement and promo code.
                </p>
              </form>
            )}
          </div>

          {/* Alternative Links while waiting */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600">
            <span>While you wait, explore free resources:</span>
            <Link to="/chapter-wise-mcq" className="text-blue-600 hover:underline">
              Chapter Wise MCQs
            </Link>
            <span>•</span>
            <Link to="/mock-test" className="text-blue-600 hover:underline">
              Online Mock Tests
            </Link>
            <span>•</span>
            <Link to="/syllabus" className="text-blue-600 hover:underline">
              Official Syllabus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
