import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { Button } from '../components/Button';
import { paidCourseService, extractYouTubeVideoId } from '../services/paidCourseService';
import { CourseItem, CourseChapter, CourseLesson } from '../types/paidCourse';
import { useAuth } from '../context/AuthContext';
import { StudentAuthModal } from '../components/auth/StudentAuthModal';
import { openRazorpayCheckout } from '../utils/razorpay';
import { AdBanner } from '../components/AdBanner';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseItem | null>(null);
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  
  // Player state
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'overview' | 'notes'>('curriculum');
  
  // Auth & Enrollment modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectNotice, setAuthRedirectNotice] = useState('Please sign in or create an account to enroll.');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccessToast, setEnrollmentSuccessToast] = useState(false);

  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    if (!courseId) return;

    const unsubCourses = paidCourseService.subscribeCourses((cList) => {
      const found = cList.find(c => c.id === courseId);
      if (found) setCourse(found);
    });

    const unsubChapters = paidCourseService.subscribeChapters((chList) => {
      const filtered = chList.filter(ch => ch.courseId === courseId);
      setChapters(filtered.sort((a, b) => a.chapterNumber - b.chapterNumber));
    });

    const unsubLessons = paidCourseService.subscribeLessons((lList) => {
      const filtered = lList.filter(l => l.courseId === courseId);
      const sorted = filtered.sort((a, b) => {
        if (a.chapterNumber !== b.chapterNumber) return a.chapterNumber - b.chapterNumber;
        return a.lessonNumber - b.lessonNumber;
      });
      setLessons(sorted);
      
      // Select first lesson by default if none selected
      if (!selectedLesson && sorted.length > 0) {
        setSelectedLesson(sorted[0]);
      }
    });

    return () => {
      unsubCourses();
      unsubChapters();
      unsubLessons();
    };
  }, [courseId, selectedLesson]);

  // Check if current user is enrolled
  const isEnrolled = paidCourseService.isUserEnrolled(
    currentUser?.uid,
    currentUser?.email,
    courseId || ''
  );

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Course Not Found</h1>
        <p className="text-sm text-slate-600">The requested course might have been removed or is temporarily unavailable.</p>
        <Link to="/courses" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All Courses</span>
        </Link>
      </div>
    );
  }

  // Freemium Logic:
  // First 2 lessons of the course or lessons marked as isFreePreview are accessible to EVERYONE.
  // The rest are locked unless the user is enrolled.
  const isLessonUnlocked = (lesson: CourseLesson, index: number): boolean => {
    if (isEnrolled) return true;
    if (lesson.isFreePreview) return true;
    if (index < 2) return true; // Rule: first 2 lessons free
    return false;
  };

  const handleSelectLesson = (lesson: CourseLesson, index: number) => {
    const unlocked = isLessonUnlocked(lesson, index);
    if (!unlocked) {
      if (!currentUser) {
        setAuthRedirectNotice('This is a premium lecture. Please Sign In or Create an Account to unlock the full course.');
        setIsAuthModalOpen(true);
      } else {
        handleEnrollClick();
      }
      return;
    }
    setSelectedLesson(lesson);
  };

  const handleEnrollClick = () => {
    if (!currentUser) {
      setAuthRedirectNotice(`Please Sign In to purchase "${course.title}".`);
      setIsAuthModalOpen(true);
      return;
    }

    // Trigger Razorpay Checkout
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
      onError: (err) => {
        setIsEnrolling(false);
        alert('Payment could not be completed. Please try again.');
      }
    });
  };

  // Extract selected lesson YouTube Video ID
  const activeVideoId = selectedLesson?.videoId || extractYouTubeVideoId(selectedLesson?.youtubeUrl || '');
  const activeLessonIndex = selectedLesson ? lessons.findIndex(l => l.id === selectedLesson.id) : 0;
  const isSelectedLessonUnlocked = selectedLesson ? isLessonUnlocked(selectedLesson, activeLessonIndex) : true;

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SEO
        title={`${course.title} - Video Course & Notes | Skilldotpy`}
        description={course.overview}
        keywords={[
          course.title,
          `${course.category.toUpperCase()} video batch`,
          'NIELIT O level video lecture in hindi',
          'Skilldotpy paid courses'
        ]}
      />

      {/* Success Notification Toast */}
      {enrollmentSuccessToast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="p-4 bg-emerald-900 border border-emerald-500 rounded-2xl shadow-2xl flex items-center gap-3 text-white text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-extrabold text-emerald-300">Enrollment Successful!</p>
              <p className="text-[11px] text-emerald-100">All video lectures and PDF notes are now unlocked for you.</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Course Header */}
      <div className="bg-slate-900 text-white py-6 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Link
            to="/courses"
            className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to All Courses</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                  {course.category.toUpperCase()} BATCH
                </span>
                {course.badge && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    {course.badge}
                  </span>
                )}
                {isEnrolled && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Enrolled Student</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
                {course.title}
              </h1>

              {course.hindiTitle && (
                <p className="text-xs sm:text-sm font-semibold text-blue-200">
                  {course.hindiTitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 font-medium">
                <span>Teacher: <strong className="text-white">{course.teacherName || 'Er. Aditya Pathak'}</strong></span>
                <span>•</span>
                <span>Duration: <strong className="text-white">{course.duration || '35+ Hours'}</strong></span>
                <span>•</span>
                <span>Language: <strong className="text-white">{course.language || 'Hinglish (Hindi + English)'}</strong></span>
              </div>
            </div>

            {/* Quick Pricing Action Box */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row lg:flex-col items-center justify-between gap-4 shrink-0 min-w-[260px]">
              <div className="text-center sm:text-left lg:text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Course Fee</span>
                <div className="flex items-baseline justify-center sm:justify-start lg:justify-center gap-2 mt-0.5">
                  <span className="text-3xl font-black text-white">₹{course.price}</span>
                  {course.originalPrice > course.price && (
                    <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                  )}
                </div>
              </div>

              {isEnrolled ? (
                <div className="w-full py-2.5 px-4 bg-emerald-600/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Full Course Access Active</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  disabled={isEnrolling}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {isEnrolling ? 'Opening Checkout...' : `Enroll Now for ₹${course.price}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Workspace: Video Player on Left, Playlist & Chapters on Right */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ================= LEFT 8 COLS: VIDEO PLAYER & LECTURE DETAILS ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Embedded HD YouTube Player Frame */}
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video border border-slate-800 relative group">
              {isSelectedLessonUnlocked && activeVideoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedLesson?.title || 'Lecture Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-white space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Lock className="w-8 h-8" />
                  </div>
                  
                  <div className="max-w-md space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                      Premium Locked Lecture
                    </span>
                    <h3 className="text-lg font-black text-white">
                      {selectedLesson?.title || 'This video lecture is locked'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This lecture is part of the full {course.title}. Unlock all video lectures, handwritten PDF notes, and test papers.
                    </p>
                  </div>

                  <button
                    onClick={handleEnrollClick}
                    className="py-2.5 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
                  >
                    Unlock Full Course (₹{course.price})
                  </button>
                </div>
              )}
            </div>

            {/* Current Active Lesson Header */}
            {selectedLesson && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 uppercase">
                        Chapter {selectedLesson.chapterNumber} • Lecture {selectedLesson.lessonNumber}
                      </span>
                      {selectedLesson.isFreePreview ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Unlock className="w-3 h-3" />
                          <span>Free Preview Demo</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Paid Content</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                      {selectedLesson.title}
                    </h2>
                    {selectedLesson.hindiTitle && (
                      <p className="text-xs text-slate-500 font-medium">{selectedLesson.hindiTitle}</p>
                    )}
                  </div>

                  {/* Attached PDF Notes Download / View */}
                  {selectedLesson.hasPdf && (
                    <div className="shrink-0">
                      {isSelectedLessonUnlocked && selectedLesson.pdfUrl ? (
                        <a
                          href={selectedLesson.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold shadow-2xs transition-colors"
                        >
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>Download Chapter PDF</span>
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          onClick={handleEnrollClick}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold border border-slate-200 cursor-not-allowed"
                          title="Enroll to download PDF"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>PDF Notes Locked</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Course Information Tabs: Overview, Learning Outcomes, Features */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Course Overview & Syllabus
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  What You'll Learn
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <p className="text-sm">{course.overview}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    {course.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3 text-xs text-slate-700">
                  <h4 className="font-bold text-slate-900 text-sm">Key Learning Outcomes:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.learningOutcomes.map((outcome, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* In-article Ad Banner */}
            <AdBanner format="horizontal" className="my-6" />

          </div>

          {/* ================= RIGHT 4 COLS: CHAPTERS & LECTURE PLAYLIST ================= */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Playlist Container */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden sticky top-24">
              
              {/* Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span className="font-black text-xs uppercase tracking-wider">Course Curriculum</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {lessons.length} Lectures
                </span>
              </div>

              {/* Free Demo Reminder */}
              {!isEnrolled && (
                <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2 Free Demo Lessons</span>
                  </span>
                  <button
                    onClick={handleEnrollClick}
                    className="text-[11px] text-blue-700 font-extrabold hover:underline"
                  >
                    Unlock All →
                  </button>
                </div>
              )}

              {/* Chapters & Lessons Accordion List */}
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto divide-y divide-slate-100 p-2 space-y-2">
                {chapters.map((chapter) => {
                  const chLessons = lessons.filter(l => l.chapterId === chapter.id || l.chapterNumber === chapter.chapterNumber);

                  return (
                    <div key={chapter.id} className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/50">
                      {/* Chapter Title Bar */}
                      <div className="p-3 bg-slate-100/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                            {chapter.chapterNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-900 line-clamp-1">
                            {chapter.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {chLessons.length} Videos
                        </span>
                      </div>

                      {/* Lessons in Chapter */}
                      <div className="divide-y divide-slate-100">
                        {chLessons.map((les) => {
                          const globalIdx = lessons.findIndex(l => l.id === les.id);
                          const unlocked = isLessonUnlocked(les, globalIdx);
                          const isSelected = selectedLesson?.id === les.id;

                          return (
                            <button
                              key={les.id}
                              type="button"
                              onClick={() => handleSelectLesson(les, globalIdx)}
                              className={`w-full text-left p-3 flex items-start justify-between gap-2.5 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50/90 text-blue-900 border-l-4 border-blue-600'
                                  : 'hover:bg-white text-slate-700'
                              }`}
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200/80 text-slate-600'
                                }`}>
                                  <Play className="w-3 h-3 fill-current" />
                                </div>

                                <div className="min-w-0">
                                  <span className="text-xs font-bold block line-clamp-2 leading-snug">
                                    {les.title}
                                  </span>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                                    <span>{les.duration || '25:00'}</span>
                                    {les.hasPdf && (
                                      <>
                                        <span>•</span>
                                        <span className="text-blue-600 font-sans font-semibold">PDF Included</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 mt-1">
                                {unlocked ? (
                                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                    {isEnrolled ? 'Unlocked' : 'Free'}
                                  </span>
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Enrollment CTA */}
              {!isEnrolled && (
                <div className="p-4 bg-slate-900 text-white text-center space-y-2 border-t border-slate-800">
                  <p className="text-xs text-slate-300 font-medium">
                    Get Lifetime Access to All {lessons.length} Lectures & Notes
                  </p>
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
                  >
                    Enroll Now (₹{course.price})
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* Student Auth Modal (Sign in / Sign up before payment) */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectNotice={authRedirectNotice}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          // Resume enrollment after authentication
          setTimeout(() => handleEnrollClick(), 300);
        }}
      />

    </div>
  );
}
