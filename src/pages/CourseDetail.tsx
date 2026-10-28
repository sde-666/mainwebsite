import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Check,
  Play, 
  Lock, 
  Unlock, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  ExternalLink,
  Users,
  Award,
  Video,
  Layers,
  GraduationCap,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Share2,
  BookOpen,
  MessageCircle,
  HelpCircle,
  FileCheck,
  Calendar,
  Eye,
  CheckCircle,
  Maximize2,
  Minimize2,
  RotateCw,
  FolderOpen,
  Zap,
  Globe,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { Button } from '../components/Button';
import { paidCourseService, extractYouTubeVideoId } from '../services/paidCourseService';
import { CourseItem, CourseChapter, CourseLesson } from '../types/paidCourse';
import { useAuth } from '../context/AuthContext';
import { StudentAuthModal } from '../components/auth/StudentAuthModal';
import { openRazorpayCheckout } from '../utils/razorpay';
import { ComingSoon } from '../components/ComingSoon';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseItem | null>(null);
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [isGlobalComingSoon, setIsGlobalComingSoon] = useState<boolean>(false);
  
  // Navigation tabs: 'curriculum' | 'notes' | 'overview' | 'faqs'
  const [activeTab, setActiveTab] = useState<'curriculum' | 'notes' | 'overview' | 'faqs'>('curriculum');
  
  // Active selection
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [lessonFilter, setLessonFilter] = useState<'all' | 'free' | 'notes' | 'completed'>('all');
  const [lessonSearchTerm, setLessonSearchTerm] = useState('');
  const [notesSearchTerm, setNotesSearchTerm] = useState('');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  
  // Full-Screen Video Player State (Mobile landscape aware)
  const [isFullScreenVideoOpen, setIsFullScreenVideoOpen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Auth & Razorpay Enrollment State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectNotice, setAuthRedirectNotice] = useState('Please sign in or create an account to enroll.');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccessToast, setEnrollmentSuccessToast] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  const { currentUser, userProfile } = useAuth();

  // Load completed lessons from localStorage
  useEffect(() => {
    if (courseId) {
      const saved = localStorage.getItem(`completed_lessons_${courseId}`);
      if (saved) {
        try {
          setCompletedLessonIds(JSON.parse(saved));
        } catch (e) {
          console.warn('Failed to parse completed lessons', e);
        }
      }
    }
  }, [courseId]);

  // Subscribe to real-time course data
  useEffect(() => {
    if (!courseId) return;

    const unsubCourses = paidCourseService.subscribeCourses((cList) => {
      const found = cList.find(c => c.id === courseId);
      if (found) setCourse(found);
    });

    const unsubChapters = paidCourseService.subscribeChapters((chList) => {
      const filtered = chList.filter(ch => ch.courseId === courseId);
      const sorted = filtered.sort((a, b) => a.chapterNumber - b.chapterNumber);
      setChapters(sorted);
    });

    const unsubLessons = paidCourseService.subscribeLessons((lList) => {
      const filtered = lList.filter(l => l.courseId === courseId);
      const sorted = filtered.sort((a, b) => {
        if (a.chapterNumber !== b.chapterNumber) return a.chapterNumber - b.chapterNumber;
        return a.lessonNumber - b.lessonNumber;
      });
      setLessons(sorted);
    });

    const unsubComingSoon = paidCourseService.subscribeComingSoon(setIsGlobalComingSoon);
    const unsubEnrollments = paidCourseService.subscribeEnrollments(setEnrollments);

    return () => {
      unsubCourses();
      unsubChapters();
      unsubLessons();
      unsubComingSoon();
      unsubEnrollments();
    };
  }, [courseId]);

  // Check if current user is enrolled
  const isEnrolled = paidCourseService.isUserEnrolled(
    currentUser?.uid,
    courseId || '',
    currentUser?.email
  );

  // Close full screen on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreenVideoOpen) {
        closeFullScreenVideo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenVideoOpen]);

  if (isGlobalComingSoon || (course && course.isComingSoon)) {
    return (
      <ComingSoon
        courseTitle={course?.title}
        courseCategory={course?.category}
        badge={course?.badge || 'Coming Soon'}
        teacherName={course?.teacherName || 'Er. Aditya Pathak'}
      />
    );
  }

  if (!course) {
    return (
      <div className="bg-[#f8fafc] min-h-screen py-24">
        <div className="container mx-auto px-4 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Course Not Found</h1>
          <p className="text-xs text-slate-600">The requested course batch might have been moved or is temporarily unavailable.</p>
          <Link to="/courses" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Browse All Courses</span>
          </Link>
        </div>
      </div>
    );
  }

  // Freemium Logic: First 2 lessons of the course or lessons marked as isFreePreview are accessible to EVERYONE.
  const isLessonUnlocked = (lesson: CourseLesson, index: number): boolean => {
    if (isEnrolled) return true;
    if (lesson.isFreePreview) return true;
    if (index < 2) return true; // First 2 lessons free rule
    return false;
  };

  const toggleLessonCompleted = (lessonId: string) => {
    setCompletedLessonIds(prev => {
      let updated: string[];
      if (prev.includes(lessonId)) {
        updated = prev.filter(id => id !== lessonId);
      } else {
        updated = [...prev, lessonId];
      }
      if (courseId) {
        localStorage.setItem(`completed_lessons_${courseId}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Trigger Full Screen Video Playback with Mobile Landscape Orientation
  const handleWatchLessonFullScreen = (lesson: CourseLesson, index: number) => {
    const unlocked = isLessonUnlocked(lesson, index);
    setSelectedLesson(lesson);
    setIsFullScreenVideoOpen(true);

    if (!unlocked && !currentUser) {
      setAuthRedirectNotice('This is a premium lecture. Please Sign In or Create an Account to unlock.');
      setIsAuthModalOpen(true);
      return;
    }

    // Try request browser fullscreen and lock orientation to landscape on mobile if supported
    setTimeout(() => {
      try {
        const el = videoContainerRef.current;
        if (el) {
          if (el.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
          } else if ((el as any).webkitRequestFullscreen) {
            (el as any).webkitRequestFullscreen();
          }
        }
        if (screen.orientation && (screen.orientation as any).lock) {
          (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } catch (err) {
        console.log('Fullscreen/Orientation request bypassed');
      }
    }, 100);
  };

  const closeFullScreenVideo = () => {
    setIsFullScreenVideoOpen(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      if (screen.orientation && (screen.orientation as any).unlock) {
        (screen.orientation as any).unlock();
      }
    } catch (e) {
      // ignore
    }
  };

  const handleEnrollClick = () => {
    if (!currentUser) {
      setAuthRedirectNotice(`Please Sign In to enroll in "${course.title}".`);
      setIsAuthModalOpen(true);
      return;
    }

    setIsEnrolling(true);
    openRazorpayCheckout({
      course,
      studentName: userProfile?.displayName || currentUser.displayName || 'Student',
      studentEmail: currentUser.email || 'student@skilldotpy.com',
      studentPhone: userProfile?.phoneNumber || '9876543210',
      userId: currentUser.uid,
      onSuccess: async (paymentId, orderId) => {
        try {
          await paidCourseService.enrollStudent({
            userId: currentUser.uid,
            studentEmail: currentUser.email || '',
            studentName: userProfile?.displayName || currentUser.displayName || 'Student',
            courseId: course.id,
            courseTitle: course.title,
            amountPaid: course.price,
            paymentId: paymentId,
            orderId: orderId
          });
          setEnrollmentSuccessToast(true);
          setTimeout(() => setEnrollmentSuccessToast(false), 5000);
        } catch (e) {
          console.error('Enrollment error:', e);
        } finally {
          setIsEnrolling(false);
        }
      },
      onDismiss: () => {
        setIsEnrolling(false);
      },
      onError: () => {
        setIsEnrolling(false);
        alert('Payment could not be completed. Please try again or contact support.');
      }
    });
  };

  // Selected chapter object
  const activeChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];
  const activeChapterLessons = lessons.filter(l => l.chapterId === activeChapter?.id || l.chapterNumber === activeChapter?.chapterNumber);

  // Active Lesson calculation for player
  const activeLessonIndex = selectedLesson ? lessons.findIndex(l => l.id === selectedLesson.id) : 0;
  const isSelectedLessonUnlocked = selectedLesson ? isLessonUnlocked(selectedLesson, activeLessonIndex) : true;
  const activeVideoId = selectedLesson?.videoId || extractYouTubeVideoId(selectedLesson?.youtubeUrl || '');

  // Next and Previous lesson handlers
  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      const prevLesson = lessons[activeLessonIndex - 1];
      setSelectedLesson(prevLesson);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      const nextLesson = lessons[activeLessonIndex + 1];
      setSelectedLesson(nextLesson);
    }
  };

  // Filter lessons in active chapter based on search & filter
  const displayedChapterLessons = activeChapterLessons.filter((l) => {
    const globalIdx = lessons.findIndex(item => item.id === l.id);
    const isFree = l.isFreePreview || globalIdx < 2;
    const isCompleted = completedLessonIds.includes(l.id);

    if (lessonFilter === 'free' && !isFree) return false;
    if (lessonFilter === 'notes' && !l.pdfUrl) return false;
    if (lessonFilter === 'completed' && !isCompleted) return false;

    if (lessonSearchTerm) {
      const q = lessonSearchTerm.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchHindi = l.hindiTitle?.toLowerCase().includes(q);
      return matchTitle || matchHindi;
    }
    return true;
  });

  // All Notes in this entire course
  const allCourseNotes = lessons.filter(l => Boolean(l.pdfUrl));
  const displayedAllNotes = allCourseNotes.filter(l => {
    if (!notesSearchTerm) return true;
    const q = notesSearchTerm.toLowerCase();
    return l.title.toLowerCase().includes(q) || 
      (l.pdfTitle && l.pdfTitle.toLowerCase().includes(q)) ||
      (l.hindiTitle && l.hindiTitle.toLowerCase().includes(q));
  });

  // Progress calculation
  const totalLessons = lessons.length;
  const completedCount = completedLessonIds.filter(id => lessons.some(l => l.id === id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const discountPercent = course.originalPrice > course.price 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-28 sm:pb-16 antialiased">
      <SEO
        title={`${course.title} - Video Lectures, DPPs & Handwritten Notes | Skilldotpy`}
        description={course.overview}
        keywords={[
          course.title,
          `${course.category.toUpperCase()} video batch`,
          'NIELIT O Level online course hindi',
          'Skilldotpy paid courses'
        ]}
      />

      {/* Success Notification Toast */}
      <AnimatePresence>
        {enrollmentSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm"
          >
            <div className="p-4 bg-emerald-600 border border-emerald-500 rounded-2xl shadow-2xl flex items-center gap-3 text-white text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <div>
                <p className="font-extrabold text-white">Enrollment Successful!</p>
                <p className="text-[11px] text-emerald-100">All video lectures and PDF study materials are now unlocked.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          HERO BANNER 
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] pt-8 pb-24 sm:pt-12 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-indigo-600/8 blur-[80px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative container mx-auto max-w-6xl">
          {/* Breadcrumbs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-xs text-slate-400 mb-5 font-medium flex-wrap"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link to="/courses" className="hover:text-white transition-colors">Paid Courses</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-300 truncate max-w-[240px]">{course.title}</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/20">
                  {course.category.toUpperCase()}
                </span>
                {course.badge && (
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/20">
                    {course.badge}
                  </span>
                )}
                {isEnrolled && (
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Enrolled
                  </span>
                )}
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Unlock className="w-3 h-3" />
                  2 Free Demo Lessons
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              {course.hindiTitle && (
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {course.hindiTitle}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                {course.overview}
              </p>

              {/* Meta Stats Badges */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-300 pt-1">
                <span className="flex items-center gap-1 bg-white/[0.06] px-2.5 py-1 rounded-lg">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  {chapters.length} Chapters
                </span>
                <span className="flex items-center gap-1 bg-white/[0.06] px-2.5 py-1 rounded-lg">
                  <Video className="w-3.5 h-3.5 text-blue-400" />
                  {lessons.length} HD Lectures
                </span>
                <span className="flex items-center gap-1 bg-white/[0.06] px-2.5 py-1 rounded-lg">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  {allCourseNotes.length} PDF Notes
                </span>
                {course.duration && (
                  <span className="flex items-center gap-1 bg-white/[0.06] px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {course.duration}
                  </span>
                )}
                <span className="flex items-center gap-1 bg-white/[0.06] px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Lifetime Access
                </span>
              </div>
            </div>

            {/* Desktop Enroll Card */}
            {!isEnrolled && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="hidden lg:block bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 min-w-[280px]"
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-white">₹{course.price}</span>
                  {course.originalPrice > course.price && (
                    <span className="text-sm font-bold text-slate-400 line-through">₹{course.originalPrice}</span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase mb-3">
                    <Zap className="w-3 h-3" />
                    {discountPercent}% OFF • LIMITED TIME
                  </span>
                )}
                <button
                  onClick={handleEnrollClick}
                  disabled={isEnrolling}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isEnrolling ? 'Processing...' : 'Enroll Now'}</span>
                </button>
                <div className="mt-3 space-y-1 text-[10px] text-slate-400 text-center">
                  <p>✓ Instant Unlock on Web & App</p>
                  <p>✓ Safe Razorpay Payment</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Progress bar for enrolled students */}
          {isEnrolled && totalLessons > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-white/[0.06] backdrop-blur-sm rounded-xl p-3.5 border border-white/[0.06]"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium mb-1.5">
                <span>Course Progress: {completedCount} of {totalLessons} lectures completed</span>
                <span className="font-bold text-cyan-300">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT CARD (Overlaps hero)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden"
        >
          {/* Main Navigation Tabs */}
          <div className="flex items-center justify-between px-4 sm:px-7 py-3 border-b border-slate-100 bg-slate-50/70 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => { setActiveTab('curriculum'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'curriculum'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curriculum ({chapters.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('notes'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'notes'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Notes ({allCourseNotes.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('overview'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Batch Details & Mentor</span>
              </button>

              <button
                onClick={() => { setActiveTab('faqs'); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'faqs'
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>FAQs & Help</span>
              </button>
            </div>

            {/* Quick Enroll pill in tab bar */}
            {!isEnrolled && (
              <button
                onClick={handleEnrollClick}
                disabled={isEnrolling}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-md shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Enroll ₹{course.price}</span>
              </button>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              TAB 1: CURRICULUM (CHAPTERS & LECTURES)
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'curriculum' && (
            <div className="p-4 sm:p-7">
              {!selectedChapterId ? (
                /* Chapter Grid */
                <div className="space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Course Chapters & Modules ({chapters.length})
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Select any chapter to view sequential HD lectures, free demo classes, and attached PDF notes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <Unlock className="w-3 h-3 text-emerald-500" />
                        <span>First 2 Lectures Free</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {chapters.map((chapter, ci) => {
                      const chLessons = lessons.filter(l => l.chapterId === chapter.id || l.chapterNumber === chapter.chapterNumber);
                      const chNotes = chLessons.filter(l => Boolean(l.pdfUrl));
                      const chCompleted = chLessons.filter(l => completedLessonIds.includes(l.id)).length;
                      const chProgress = chLessons.length > 0 ? Math.round((chCompleted / chLessons.length) * 100) : 0;

                      return (
                        <motion.div
                          key={chapter.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: ci * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                          onClick={() => setSelectedChapterId(chapter.id)}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg">
                                Chapter {chapter.chapterNumber}
                              </span>
                              {chProgress > 0 && (
                                <span className="text-[10px] font-bold text-emerald-600">
                                  {chProgress}% done
                                </span>
                              )}
                            </div>

                            <h3 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.8rem] group-hover:text-blue-600 transition-colors">
                              {chapter.title}
                            </h3>

                            {chapter.hindiTitle && (
                              <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-1">
                                {chapter.hindiTitle}
                              </p>
                            )}

                            <div className="flex items-center gap-3 mt-3.5 text-[11px] font-semibold text-slate-500">
                              <span className="flex items-center gap-1">
                                <Play className="w-3 h-3 text-blue-500" />
                                {chLessons.length} Videos
                              </span>
                              {chNotes.length > 0 && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3 text-amber-500" />
                                    {chNotes.length} PDFs
                                  </span>
                                </>
                              )}
                            </div>

                            {isEnrolled && chLessons.length > 0 && (
                              <div className="mt-3">
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                                    style={{ width: `${chProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {chCompleted > 0 ? `${chCompleted}/${chLessons.length} finished` : 'Sequential classes'}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 group-hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm transition-all group-hover:shadow-md">
                              <span>Open</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Chapter Lectures Detailed View */
                <div className="space-y-5">
                  {/* Chapter Control Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <button 
                      onClick={() => { setSelectedChapterId(null); setLessonSearchTerm(''); }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer w-fit"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to All Chapters</span>
                    </button>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {chapters.findIndex(c => c.id === selectedChapterId) > 0 && (
                        <button 
                          onClick={() => {
                            const idx = chapters.findIndex(c => c.id === selectedChapterId);
                            if (idx > 0) setSelectedChapterId(chapters[idx - 1].id);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Prev Ch</span>
                        </button>
                      )}
                      {chapters.findIndex(c => c.id === selectedChapterId) < chapters.length - 1 && (
                        <button 
                          onClick={() => {
                            const idx = chapters.findIndex(c => c.id === selectedChapterId);
                            if (idx < chapters.length - 1) setSelectedChapterId(chapters[idx + 1].id);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Next Ch</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Chapter Title & Filter Bar */}
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      Chapter {activeChapter?.chapterNumber}
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                      {activeChapter?.title}
                    </h2>
                    {activeChapter?.hindiTitle && (
                      <p className="text-xs text-slate-400 font-medium">
                        {activeChapter.hindiTitle}
                      </p>
                    )}
                  </div>

                  {/* Filter Pills & Search */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                      {[
                        { id: 'all', label: 'All Lectures' },
                        { id: 'free', label: 'Free Demos' },
                        { id: 'notes', label: 'With Notes' },
                        { id: 'completed', label: 'Completed' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setLessonFilter(tab.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            lessonFilter === tab.id
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative w-full sm:w-56">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search lectures..."
                        value={lessonSearchTerm}
                        onChange={(e) => setLessonSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {lessonSearchTerm && (
                        <button 
                          onClick={() => setLessonSearchTerm('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lecture Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {displayedChapterLessons.length === 0 ? (
                      <div className="col-span-full bg-slate-50 rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                        <Video className="w-10 h-10 text-slate-400 mx-auto" />
                        <h3 className="text-sm font-bold text-slate-800">No lectures match the filter</h3>
                        <p className="text-xs text-slate-500">Try changing the filter or clearing the search query.</p>
                      </div>
                    ) : (
                      displayedChapterLessons.map((lesson, idx) => {
                        const globalIdx = lessons.findIndex(l => l.id === lesson.id);
                        const unlocked = isLessonUnlocked(lesson, globalIdx);
                        const isCompletedEffective = completedLessonIds.includes(lesson.id);
                        const isFree = lesson.isFreePreview || globalIdx < 2;

                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className={`bg-white border rounded-2xl p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between group ${
                              isCompletedEffective 
                                ? 'border-emerald-200/90 bg-emerald-50/20' 
                                : 'border-slate-200/80'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-[11px] font-bold text-slate-400">
                                  Lecture {lesson.lessonNumber || idx + 1}
                                </span>

                                {isFree ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                    <Unlock className="w-3 h-3 text-emerald-500" />
                                    <span>Free Demo</span>
                                  </span>
                                ) : isEnrolled ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                    <Unlock className="w-3 h-3 text-blue-500" />
                                    <span>Unlocked</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                    <Lock className="w-3 h-3 text-amber-500" />
                                    <span>Locked</span>
                                  </span>
                                )}
                              </div>

                              <h3 
                                onClick={() => handleWatchLessonFullScreen(lesson, globalIdx)}
                                className="text-[14px] font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.6rem] group-hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                {lesson.title}
                              </h3>

                              {lesson.hindiTitle && (
                                <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-1">
                                  {lesson.hindiTitle}
                                </p>
                              )}

                              <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {lesson.duration || 'Full Video'}
                                </span>
                                {lesson.pdfUrl && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                                      <FileText className="w-3 h-3" />
                                      PDF Notes
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 gap-2">
                              <div className="flex items-center gap-2">
                                {unlocked ? (
                                  <button
                                    onClick={() => handleWatchLessonFullScreen(lesson, globalIdx)}
                                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>{isCompletedEffective ? 'Watch Again' : 'Watch Video'}</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleEnrollClick}
                                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Unlock ₹{course.price}</span>
                                  </button>
                                )}

                                {lesson.pdfUrl && (
                                  unlocked ? (
                                    <a
                                      href={lesson.pdfUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-200 text-slate-600 hover:text-amber-600 border border-transparent transition-all cursor-pointer"
                                      title="Download / View PDF Notes"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                    </a>
                                  ) : (
                                    <button
                                      onClick={handleEnrollClick}
                                      className="p-2 rounded-xl bg-slate-100 text-slate-400 cursor-pointer"
                                      title="Enroll to unlock Notes"
                                    >
                                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                                    </button>
                                  )
                                )}
                              </div>

                              <button 
                                onClick={() => toggleLessonCompleted(lesson.id)}
                                className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                                  isCompletedEffective 
                                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-200 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200'
                                }`}
                                title={isCompletedEffective ? 'Mark as Incomplete' : 'Mark as Completed'}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 2: ALL PDF STUDY NOTES
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'notes' && (
            <div className="p-4 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    Handwritten PDF Formula & Theory Notes ({allCourseNotes.length})
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Every lecture is accompanied by high-yield exam notes, LibreOffice shortcuts, and solved coding examples.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={notesSearchTerm}
                    onChange={(e) => setNotesSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  {notesSearchTerm && (
                    <button 
                      onClick={() => setNotesSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {displayedAllNotes.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">No PDF notes found</h3>
                  <p className="text-xs text-slate-500">PDF study materials will appear here as soon as they are uploaded.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {displayedAllNotes.map((noteLesson, idx) => {
                    const globalIdx = lessons.findIndex(l => l.id === noteLesson.id);
                    const unlocked = isLessonUnlocked(noteLesson, globalIdx);

                    return (
                      <motion.div
                        key={noteLesson.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.4 }}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                              Ch {noteLesson.chapterNumber} • Lecture {noteLesson.lessonNumber}
                            </span>
                            {unlocked ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                Unlocked
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Locked
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {noteLesson.pdfTitle || `${noteLesson.title} Notes`}
                          </h3>

                          {noteLesson.hindiTitle && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-medium">
                              {noteLesson.hindiTitle}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                          {unlocked ? (
                            <a
                              href={noteLesson.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </a>
                          ) : (
                            <button
                              onClick={handleEnrollClick}
                              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              <span>Enroll to Unlock Notes</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 3: COURSE OVERVIEW & MENTOR DETAILS
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="p-4 sm:p-7 space-y-8">
              {/* Highlights & Learning Outcomes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>What You Will Master</span>
                  </h3>
                  <div className="space-y-2.5">
                    {(course.learningOutcomes || [
                      'Complete theory coverage as per latest NIELIT R5.1 syllabus',
                      'Handwritten formula sheets, shortcut tables, and revision notes',
                      'Solved practical lab coding assignments and step-by-step guidance',
                      '1000+ chapter-wise CBT exam MCQs with detailed explanations',
                      'Previous years examination papers analysis and scoring strategies'
                    ]).map((outcome, oi) => (
                      <div key={oi} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <span>Batch Features & Benefits</span>
                  </h3>
                  <div className="space-y-2.5">
                    {(course.features || [
                      'Sequential 1080p HD Video lectures accessible anytime 24/7',
                      'Bilingual explanation (Hindi + English) designed for college students',
                      'Direct WhatsApp doubt support and mentorship',
                      'Mobile and Desktop compatible player with landscape orientation',
                      'Lifetime validity — re-watch anytime before your examination'
                    ]).map((feature, fi) => (
                      <div key={fi} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instructor Card */}
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-blue-500/10 blur-[80px]" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/25 shrink-0">
                    AP
                  </div>
                  <div className="space-y-2.5 text-center sm:text-left flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h4 className="text-lg font-black text-white">{course.teacherName || 'Er. Aditya Pathak'}</h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                        Lead Educator
                      </span>
                    </div>
                    <p className="text-xs text-blue-200 font-medium">
                      Founder, Skilldotpy • NIELIT Certified Educator & Tech Mentor
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Er. Aditya Pathak has mentored over 50,000+ students across India for NIELIT O Level, CCC, Python programming, and Web Technologies. His teaching focuses on zero-to-advanced conceptual clarity and high exam scores.
                    </p>
                    <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
                      <a
                        href="https://wa.me/919451992010"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 4: FAQS & DOUBT SUPPORT
             ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'faqs' && (
            <div className="p-4 sm:p-7 space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Got questions about this batch, payments, or access? Here are answers to the most common queries.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'How will I get access to the course after making payment?',
                    a: 'Access is completely automatic! The moment your payment via Razorpay succeeds, all locked video lectures and PDF notes in this course will instantly unlock for your account. You can watch immediately.'
                  },
                  {
                    q: 'Can I watch the videos on my smartphone?',
                    a: 'Yes, absolutely! The player is 100% mobile-friendly with automatic fullscreen landscape rotation, smooth playback controls, and offline notes viewing.'
                  },
                  {
                    q: 'Can I download the PDF notes to my device?',
                    a: 'Yes! All chapter notes, LibreOffice shortcut sheets, and Python lab code files can be downloaded directly to your phone or computer, and you can also print them for offline study.'
                  },
                  {
                    q: 'How long is the validity of this course?',
                    a: 'You get Lifetime Access! You can re-watch lectures and re-download notes as many times as you need before and after your NIELIT examination.'
                  },
                  {
                    q: 'How do I ask doubts or talk to Aditya Sir?',
                    a: 'Enrolled students can reach out directly via our dedicated student WhatsApp support line at +91 94519 92010 for syllabus doubts, practical errors, and exam guidance.'
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{item.q}</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed pl-6">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Card Footer */}
          <div className="px-5 sm:px-7 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              💡 <strong>Tip:</strong> Watch lectures sequentially. Free demos are available for everyone; full batch requires enrollment.
            </p>
            <Link
              to="/courses"
              className="font-bold text-blue-600 hover:text-blue-800 hover:underline shrink-0 transition-colors"
            >
              Explore All Batches →
            </Link>
          </div>

        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STICKY MOBILE BOTTOM BAR — Enrollment CTA for non-enrolled users
         ═══════════════════════════════════════════════════════════════ */}
      {!isEnrolled && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-3 lg:hidden safe-area-bottom shadow-2xl">
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">₹{course.price}</span>
                {course.originalPrice > course.price && (
                  <span className="text-xs font-bold text-slate-400 line-through">₹{course.originalPrice}</span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] font-black text-emerald-600 ml-1">{discountPercent}% OFF</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">All lectures + PDF notes</p>
            </div>
            <button
              onClick={handleEnrollClick}
              disabled={isEnrolling}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-blue-500/20 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isEnrolling ? 'Processing...' : 'Enroll Now'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          FULL SCREEN VIDEO PLAYER (WITH LANDSCAPE & PREV/NEXT SUPPORT)
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isFullScreenVideoOpen && selectedLesson && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            ref={videoContainerRef}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden"
            style={{ width: '100vw', height: '100vh' }}
          >
            {/* Top Bar */}
            <div className="bg-gradient-to-b from-black/90 via-black/50 to-transparent p-3 sm:p-4 flex items-center justify-between z-20 text-white">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={closeFullScreenVideo}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                  title="Back / Close Fullscreen"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white uppercase">
                      Ch {selectedLesson.chapterNumber} • L{selectedLesson.lessonNumber}
                    </span>
                    <h3 className="text-xs sm:text-sm font-extrabold truncate text-white">
                      {selectedLesson.title}
                    </h3>
                  </div>
                  {selectedLesson.hindiTitle && (
                    <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                      {selectedLesson.hindiTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Top Controls: Prev, Next, Mark Done, Close */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {activeLessonIndex > 0 && (
                  <button
                    onClick={handlePrevLesson}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Previous Lecture"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {activeLessonIndex < lessons.length - 1 && (
                  <button
                    onClick={handleNextLesson}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Next Lecture"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => toggleLessonCompleted(selectedLesson.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    completedLessonIds.includes(selectedLesson.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {completedLessonIds.includes(selectedLesson.id) ? 'Completed' : 'Mark Done'}
                  </span>
                </button>

                <button
                  onClick={closeFullScreenVideo}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close Full Screen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Center Stage */}
            <div className="flex-1 w-full h-full relative flex items-center justify-center bg-black">
              {isSelectedLessonUnlocked && activeVideoId ? (
                <iframe
                  className="w-full h-full border-0 absolute inset-0"
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`}
                  title={selectedLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              ) : (
                /* Premium Lock Overlay */
                <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-slate-950 to-blue-950 flex flex-col items-center justify-center p-6 text-center space-y-5 text-white">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-2xl"
                  >
                    <Lock className="w-10 h-10" />
                  </motion.div>
                  <div className="max-w-md space-y-2">
                    <h4 className="text-xl sm:text-2xl font-black">This Lecture is Locked</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Enroll in <strong>{course.title}</strong> to unlock all recorded video lectures, handwritten notes, and WhatsApp mentorship.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      closeFullScreenVideo();
                      handleEnrollClick();
                    }}
                    disabled={isEnrolling}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black shadow-2xl shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Unlock Full Batch for ₹{course.price}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Bar: Lesson Notes Download */}
            {selectedLesson.pdfUrl && (
              <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 flex items-center justify-between z-20 text-white">
                <div className="flex items-center gap-2 text-xs">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200 font-medium truncate">
                    {selectedLesson.pdfTitle || `${selectedLesson.title} Notes`}
                  </span>
                </div>
                <a
                  href={selectedLesson.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Notes</span>
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Auth Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectNotice={authRedirectNotice}
      />

    </div>
  );
}
