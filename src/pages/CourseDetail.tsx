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
  Menu,
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
  FolderOpen
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { Button } from '../components/Button';
import { paidCourseService, extractYouTubeVideoId } from '../services/paidCourseService';
import { CourseItem, CourseChapter, CourseLesson } from '../types/paidCourse';
import { useAuth } from '../context/AuthContext';
import { StudentAuthModal } from '../components/auth/StudentAuthModal';
import { openRazorpayCheckout } from '../utils/razorpay';
import { AdBanner } from '../components/AdBanner';
import { ComingSoon } from '../components/ComingSoon';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseItem | null>(null);
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [isGlobalComingSoon, setIsGlobalComingSoon] = useState<boolean>(false);
  
  // Active selection
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'lectures' | 'notes' | 'dpp'>('all');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  
  // Full-Screen Video Player State (Mobile landscape aware)
  const [isFullScreenVideoOpen, setIsFullScreenVideoOpen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Chapter Notes Modal State (Triggered when user clicks "Notes & more")
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [activeNotesChapter, setActiveNotesChapter] = useState<CourseChapter | null>(null);
  
  // Auth & Razorpay Enrollment State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectNotice, setAuthRedirectNotice] = useState('Please sign in or create an account to enroll.');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccessToast, setEnrollmentSuccessToast] = useState(false);

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
      
      // Auto select first chapter if none selected
      if (sorted.length > 0 && !selectedChapterId) {
        setSelectedChapterId(sorted[0].id);
      }
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

    return () => {
      unsubCourses();
      unsubChapters();
      unsubLessons();
      unsubComingSoon();
    };
  }, [courseId, selectedChapterId]);

  // Check if current user is enrolled
  const isEnrolled = paidCourseService.isUserEnrolled(
    currentUser?.uid,
    currentUser?.email,
    courseId || ''
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
      <div className="bg-slate-50 min-h-screen py-24">
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
    setIsSidebarOpenMobile(false);

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
        // Lock screen orientation to landscape on mobile devices
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

  // Open Notes & More Modal for a specific Chapter or Lesson
  const handleOpenNotesAndMore = (chapter: CourseChapter) => {
    setActiveNotesChapter(chapter);
    setIsNotesModalOpen(true);
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

  // Active Lesson calculation
  const activeVideoId = selectedLesson?.videoId || extractYouTubeVideoId(selectedLesson?.youtubeUrl || '');
  const activeLessonIndex = selectedLesson ? lessons.findIndex(l => l.id === selectedLesson.id) : 0;
  const isSelectedLessonUnlocked = selectedLesson ? isLessonUnlocked(selectedLesson, activeLessonIndex) : true;

  // Filter lessons in active chapter based on PW tabs (All, Lectures, Notes, DPPs)
  const displayedLessons = activeChapterLessons.filter(l => {
    if (filterType === 'lectures') return true;
    if (filterType === 'notes') return Boolean(l.pdfUrl);
    if (filterType === 'dpp') return true;
    return true; // 'all'
  });

  // Notes uploaded in this chapter by admin
  const activeChapterNotes = activeChapterLessons.filter(l => Boolean(l.pdfUrl));

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 flex flex-col antialiased">
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
      {enrollmentSuccessToast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="p-4 bg-emerald-600 border border-emerald-500 rounded-2xl shadow-xl flex items-center gap-3 text-white text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <div>
              <p className="font-extrabold text-white">Enrollment Successful!</p>
              <p className="text-[11px] text-emerald-100">All video lectures and PDF study materials are now unlocked.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TOP COURSE HEADER BAR
         ========================================================================= */}
      <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-30 shadow-2xs">
        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
          
          {/* Left: Breadcrumb & Course Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/courses"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-600 transition-colors shrink-0"
              title="Back to All Courses"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                  {course.category.toUpperCase()}
                </span>
                <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                  {course.title}
                </h1>
              </div>
              {course.hindiTitle && (
                <p className="text-[11px] text-slate-500 truncate hidden md:block">
                  {course.hindiTitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: Enrollment Badge / Price CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200"
            >
              <Menu className="w-3.5 h-3.5 text-blue-600" />
              <span>Chapters</span>
            </button>

            {isEnrolled ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-emerald-700 text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                <span>Enrolled</span>
              </div>
            ) : (
              <button
                onClick={handleEnrollClick}
                disabled={isEnrolling}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Enroll Now ₹{course.price}</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* =========================================================================
          DIRECT LEARNING VIEW: ALL CHAPTERS SIDEBAR + ALL LECTURES PRESENT
         ========================================================================= */}
      <div className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ---------------------------------------------------------------------
              LEFT SIDEBAR: "ALL CHAPTERS" (Always Present)
             --------------------------------------------------------------------- */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-20 select-none">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    ALL CHAPTERS
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {chapters.length} Total
                </span>
              </div>

              <div className="p-2 space-y-1.5 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
                {chapters.map((chapter) => {
                  const isCurrent = chapter.id === activeChapter?.id;
                  const formattedChNumber = String(chapter.chapterNumber).padStart(2, '0');
                  const chLessons = lessons.filter(l => l.chapterId === chapter.id || l.chapterNumber === chapter.chapterNumber);

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        setSelectedChapterId(chapter.id);
                        if (chLessons.length > 0) {
                          setSelectedLesson(chLessons[0]);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-2.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50/90 border-l-4 border-blue-600 text-slate-900 shadow-2xs'
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                        isCurrent 
                          ? 'text-blue-700 bg-white border border-blue-200 font-extrabold' 
                          : 'text-slate-500 bg-slate-100'
                      }`}>
                        CH - {formattedChNumber}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs truncate ${isCurrent ? 'font-bold text-slate-900' : 'font-medium'}`}>
                          {chapter.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {chLessons.length} Lectures
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Mobile Slide-out Drawer for All Chapters */}
          {isSidebarOpenMobile && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsSidebarOpenMobile(false)} />
              <div className="relative w-80 bg-white h-full flex flex-col z-10 shadow-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase text-slate-900">All Chapters</h3>
                  </div>
                  <button onClick={() => setIsSidebarOpenMobile(false)} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1">
                  {chapters.map((ch) => {
                    const isCur = ch.id === activeChapter?.id;
                    const chLessons = lessons.filter(l => l.chapterId === ch.id || l.chapterNumber === ch.chapterNumber);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setSelectedChapterId(ch.id);
                          setIsSidebarOpenMobile(false);
                          if (chLessons.length > 0) setSelectedLesson(chLessons[0]);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left text-xs font-bold flex items-center gap-2 ${
                          isCur ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">CH - {String(ch.chapterNumber).padStart(2, '0')}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate">{ch.title}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{chLessons.length} Lectures</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              RIGHT MAIN AREA: ALL LECTURES PRESENT DIRECTLY FOR ACTIVE CHAPTER
             --------------------------------------------------------------------- */}
          <main className="flex-1 min-w-0 space-y-4 w-full">
            
            {/* LECTURE CARDS LIST (ALL LECTURES PRESENT) */}
            <div className="space-y-3.5">
              {activeChapterLessons.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                  <Video className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">No lectures found for this chapter</h3>
                  <p className="text-xs text-slate-500">
                    Lectures for {activeChapter?.title} will be uploaded soon by the admin.
                  </p>
                </div>
              ) : (
                activeChapterLessons.map((lesson, idx) => {
                  const globalIdx = lessons.findIndex(l => l.id === lesson.id);
                  const unlocked = isLessonUnlocked(lesson, globalIdx);
                  const isCompleted = completedLessonIds.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300/80 shadow-2xs hover:shadow-sm transition-all overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 space-y-4">
                        
                        {/* Content Row: Thumbnail + Meta + Title + Completed Checkmark */}
                        <div className="flex items-start justify-between gap-4">
                          
                          <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                            {/* Thumbnail Box with Red Play Button Overlay - Clicking launches Fullscreen */}
                            <div 
                              onClick={() => handleWatchLessonFullScreen(lesson, globalIdx)}
                              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 cursor-pointer group"
                            >
                              <img
                                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&auto=format&fit=crop&q=60'}
                                alt={lesson.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                </div>
                              </div>
                            </div>

                            {/* Title, Hindi Title, Duration, Badges */}
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <span className="font-semibold text-slate-700">Lecture {lesson.lessonNumber || idx + 1}</span>
                                <span>•</span>
                                <span>{lesson.duration || '45m'}</span>
                                {lesson.isFreePreview || globalIdx < 2 ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                    Free Demo
                                  </span>
                                ) : !isEnrolled ? (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>Locked</span>
                                  </span>
                                ) : null}
                              </div>

                              <h3 
                                onClick={() => handleWatchLessonFullScreen(lesson, globalIdx)}
                                className="text-sm sm:text-base font-bold text-slate-900 leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                {lesson.title}
                              </h3>

                              {lesson.hindiTitle && (
                                <p className="text-xs text-slate-500 font-medium line-clamp-1">
                                  {lesson.hindiTitle}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Completed Status Checkmark in Top Right */}
                          <button
                            onClick={() => toggleLessonCompleted(lesson.id)}
                            className={`p-1.5 rounded-full transition-colors shrink-0 cursor-pointer ${
                              isCompleted
                                ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                                : 'text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200'
                            }`}
                            title={isCompleted ? 'Completed' : 'Mark as Completed'}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>

                        </div>

                        {/* Action Buttons: [Watch] & [Notes & more] */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          {/* Watch Button: Plays in Full Screen & Landscape on Mobile */}
                          <button
                            onClick={() => handleWatchLessonFullScreen(lesson, globalIdx)}
                            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md shadow-blue-500/20"
                          >
                            <Play className="w-3.5 h-3.5 fill-current text-white" />
                            <span>{isCompleted ? 'Resume (Full Screen)' : 'Watch'}</span>
                          </button>

                          {/* Notes & more Button: Shows all notes uploaded in that chapter by admin */}
                          <button
                            onClick={() => activeChapter && handleOpenNotesAndMore(activeChapter)}
                            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition-all border border-slate-200 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-600" />
                            <span>Notes & more</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </main>

        </div>
      </div>

      {/* =========================================================================
          MODAL 1: FULL SCREEN VIDEO PLAYER (WITH AUTO-LANDSCAPE SUPPORT ON MOBILE)
         ========================================================================= */}
      {isFullScreenVideoOpen && selectedLesson && (
        <div 
          ref={videoContainerRef}
          className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden animate-in fade-in duration-200"
          style={{ width: '100vw', height: '100vh' }}
        >
          {/* Top Bar with Video Info & Close Controls */}
          <div className="bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 sm:p-5 flex items-center justify-between z-20 text-white">
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
                    Chapter {activeChapter?.chapterNumber || 1}
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

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleLessonCompleted(selectedLesson.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
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

          {/* Video Center Stage (Takes maximum screen area) */}
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
              /* Premium Freemium Lock Overlay */
              <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-slate-950 to-blue-950 flex flex-col items-center justify-center p-6 text-center space-y-4 text-white">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-2xl">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-2">
                  <h4 className="text-lg sm:text-xl font-bold">This Lecture is Locked</h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Enroll in <strong>{course.title}</strong> to unlock all recorded video lectures, handwritten notes, and WhatsApp mentorship.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeFullScreenVideo();
                    handleEnrollClick();
                  }}
                  disabled={isEnrolling}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-xl shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Unlock Full Batch for ₹{course.price}</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Bar: Attached Chapter Notes Download Link */}
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
        </div>
      )}

      {/* =========================================================================
          MODAL 2: "NOTES & MORE" (SHOWS ALL NOTES UPLOADED IN THAT CHAPTER BY ADMIN)
         ========================================================================= */}
      {isNotesModalOpen && activeNotesChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    CH - {String(activeNotesChapter.chapterNumber).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Chapter Study Material
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {activeNotesChapter.title}
                </h3>
                {activeNotesChapter.hindiTitle && (
                  <p className="text-xs text-slate-500 font-medium">
                    {activeNotesChapter.hindiTitle}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of uploaded Notes in this Chapter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Uploaded Chapter Notes & Formula PDFs
                </h4>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                  Admin Verified Material
                </span>
              </div>

              {activeChapterNotes.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No PDF notes uploaded for this chapter yet</p>
                  <p className="text-[11px] text-slate-500">
                    The admin will upload handwritten formula sheets and PDF guides for this chapter shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeChapterNotes.map((lesson, idx) => {
                    const globalIdx = lessons.findIndex(l => l.id === lesson.id);
                    const unlocked = isLessonUnlocked(lesson, globalIdx);

                    return (
                      <div
                        key={lesson.id}
                        className="p-4 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200 transition-colors flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">
                              {lesson.pdfTitle || `${lesson.title} - Chapter Notes PDF`}
                            </h5>
                            <p className="text-[10px] text-slate-500">
                              Lecture {lesson.lessonNumber || idx + 1} • {lesson.duration || 'Full Theory & Code Examples'}
                            </p>
                          </div>
                        </div>

                        {unlocked ? (
                          <a
                            href={lesson.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              setIsNotesModalOpen(false);
                              handleEnrollClick();
                            }}
                            className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Unlock Note</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Attached DPP & Additional Resources section */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Want to test your concepts?</span>
              <Link
                to="/mcq-test"
                onClick={() => setIsNotesModalOpen(false)}
                className="font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Attempt Chapter MCQ Test</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Student Auth Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectNotice={authRedirectNotice}
      />

    </div>
  );
}
