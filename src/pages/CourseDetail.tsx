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
  const [activeTab, setActiveTab] = useState<'chapters' | 'study-material'>('chapters');
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'lectures' | 'notes' | 'dpp'>('all');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  
  // Full-Screen Video Player State (Mobile landscape aware)
  const [isFullScreenVideoOpen, setIsFullScreenVideoOpen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Chapter Notes Modal State (Triggered when user clicks "Notes & more")
  
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
  }, [courseId, selectedChapterId]);

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
          DIRECT LEARNING VIEW: TABS (CHAPTERS & STUDY MATERIAL)
         ========================================================================= */}
      <div className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
          <button 
            onClick={() => { setActiveTab('chapters'); setSelectedChapterId(null); }}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'chapters' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Chapters
          </button>
          <button 
            onClick={() => { setActiveTab('study-material'); setSelectedChapterId(null); }}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'study-material' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Study Material
          </button>
        </div>

        {activeTab === 'chapters' && (
          <>
            {!selectedChapterId ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {chapters.map(chapter => {
                  const chLessons = lessons.filter(l => l.chapterId === chapter.id || l.chapterNumber === chapter.chapterNumber);
                  const formattedChNumber = String(chapter.chapterNumber).padStart(2, '0');
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapterId(chapter.id)}
                      className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-4 text-left shadow-2xs hover:shadow-md transition-all space-y-3 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">
                          CH - {formattedChNumber}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                        {chapter.title}
                      </h3>
                      <div className="text-xs font-semibold text-slate-500">
                        Lecture: {chLessons.length}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                <button 
                  onClick={() => setSelectedChapterId(null)}
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Chapters</span>
                </button>
                
                <div className="flex flex-wrap items-center gap-3 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded">CH - {String(activeChapter?.chapterNumber || 0).padStart(2, '0')}</span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">{activeChapter?.title}</h2>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">{activeChapterLessons.length} Lectures</span>
                </div>

                <div className="space-y-3.5">
                  {activeChapterLessons.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                      <Video className="w-10 h-10 text-slate-400 mx-auto" />
                      <h3 className="text-sm font-bold text-slate-800">No lectures found for this chapter</h3>
                      <p className="text-xs text-slate-500">Lectures will be uploaded soon by the admin.</p>
                    </div>
                  ) : (
                    activeChapterLessons.map((lesson, idx) => {
                      const globalIdx = lessons.findIndex(l => l.id === lesson.id);
                      const unlocked = isLessonUnlocked(lesson, globalIdx);
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      return (
                        <div key={lesson.id} className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300/80 shadow-2xs hover:shadow-sm transition-all overflow-hidden">
                          <div className="p-4 sm:p-5 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
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
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <span className="font-semibold text-slate-700">Lecture {lesson.lessonNumber || idx + 1}</span>
                                    <span>•</span>
                                    <span>{lesson.duration || '45m'}</span>
                                    {lesson.isFreePreview || globalIdx < 2 ? (
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">Free Demo</span>
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
                                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{lesson.hindiTitle}</p>
                                  )}
                                </div>
                              </div>
                              <button 
                                onClick={() => toggleLessonCompleted(lesson.id)}
                                className={`p-1.5 rounded-full transition-colors shrink-0 cursor-pointer ${isCompleted ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' : 'text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200'}`}
                                title={isCompleted ? 'Completed' : 'Mark as Completed'}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <button 
                                onClick={() => handleWatchLessonFullScreen(lesson, globalIdx)}
                                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md shadow-blue-500/20"
                              >
                                <Play className="w-3.5 h-3.5 fill-current text-white" />
                                <span>{isCompleted ? 'Resume (Full Screen)' : 'Watch'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'study-material' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {chapters.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <FolderOpen className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No study material found</h3>
              </div>
            )}
            {chapters.map(chapter => {
              const chNotes = lessons.filter(l => (l.chapterId === chapter.id || l.chapterNumber === chapter.chapterNumber) && !!l.pdfUrl);
              if (chNotes.length === 0) return null;
              return (
                <div key={chapter.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase shrink-0">
                      CH - {String(chapter.chapterNumber).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 truncate">{chapter.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chNotes.map(note => {
                      const globalIdx = lessons.findIndex(l => l.id === note.id);
                      const unlocked = isLessonUnlocked(note, globalIdx);
                      return (
                        <div key={note.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 group hover:border-blue-200 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                                {note.pdfTitle || `${note.title} - Notes`}
                              </h4>
                              {note.duration && (
                                <p className="text-[10px] text-slate-500 truncate">{note.duration}</p>
                              )}
                            </div>
                          </div>
                          {unlocked ? (
                            <a 
                              href={note.pdfUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-lg shrink-0 transition-colors shadow-2xs"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          ) : (
                            <button 
                              onClick={handleEnrollClick} 
                              className="w-8 h-8 flex items-center justify-center bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg shrink-0 transition-colors cursor-pointer"
                              title="Locked"
                            >
                              <Lock className="w-4 h-4 text-amber-600" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

      {/* Student Auth Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectNotice={authRedirectNotice}
      />

    </div>
  );
}
