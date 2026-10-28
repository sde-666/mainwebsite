import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Play, 
  FileText, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  User, 
  LogOut,
  ExternalLink,
  Search,
  Award,
  Eye,
  Calendar,
  Lock,
  ChevronRight,
  Video,
  Zap,
  X,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { paidCourseService } from '../services/paidCourseService';
import { resourceService, formatDirectDownloadUrl } from '../services/resourceService';
import { CourseItem, CourseChapter, CourseLesson, CourseEnrollment } from '../types/paidCourse';
import { PurchasedResource, DynamicResource } from '../types/database';
import { StudentAuthModal } from '../components/auth/StudentAuthModal';

export function MyCourses() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'courses' | 'notes'>('courses');
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [purchasedNotes, setPurchasedNotes] = useState<PurchasedResource[]>([]);
  const [allResources, setAllResources] = useState<DynamicResource[]>([]);
  const [viewingResource, setViewingResource] = useState<DynamicResource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubCourses = paidCourseService.subscribeCourses(setCourses);
    const unsubChapters = paidCourseService.subscribeChapters(setChapters);
    const unsubLessons = paidCourseService.subscribeLessons(setLessons);
    const unsubResources = resourceService.subscribeResources(setAllResources);

    const unsubEnroll = paidCourseService.subscribeEnrollments((allEnrollments) => {
      if (currentUser) {
        const myEnrollments = allEnrollments.filter(
          e => e.userId === currentUser.uid || (currentUser.email && e.studentEmail.toLowerCase() === currentUser.email.toLowerCase())
        );
        setEnrollments(myEnrollments);
      } else {
        setEnrollments([]);
      }
    });

    const unsubPurchases = resourceService.subscribePurchasedResources(
      currentUser?.uid,
      currentUser?.email || undefined,
      (purchases) => {
        setPurchasedNotes(purchases);
      }
    );

    return () => {
      unsubCourses();
      unsubChapters();
      unsubLessons();
      unsubResources();
      unsubEnroll();
      unsubPurchases();
    };
  }, [currentUser]);

  // If user is not logged in, show premium sign-in prompt
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <SEO 
          title="Student Dashboard - My Enrolled Courses & Notes | Skilldotpy"
          description="Access your purchased NIELIT O Level and CCC video batches, watch lectures, and download PDF notes."
        />

        {/* Hero section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] pt-20 pb-32">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
            <div className="absolute -bottom-32 -left-32 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px]" />
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative container mx-auto px-4 max-w-xl text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400"
            >
              <GraduationCap className="w-10 h-10" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="space-y-3"
            >
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Student Dashboard
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                Please sign in with your student account to access your enrolled video courses, practice assignments, and handwritten PDF notes.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Sign In to My Account
              </button>
              <Link
                to="/courses"
                className="w-full sm:w-auto px-7 py-3.5 bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                Explore Paid Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        <StudentAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          redirectNotice="Sign in to view your enrolled courses and purchased notes."
        />
      </div>
    );
  }

  // Get enrolled course objects
  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));
  const myCoursesList = courses.filter(c => enrolledCourseIds.has(c.id));

  // Filter with search
  const filteredMyCourses = myCoursesList.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPurchasedNotes = purchasedNotes.filter(n =>
    n.resourceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.moduleCode && n.moduleCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenPurchasedPdf = (note: PurchasedResource) => {
    const matching = allResources.find(r => r.id === note.resourceId);
    const targetUrl = matching?.directPdfUrl || matching?.downloadUrl || note.directPdfUrl || note.downloadUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadPurchasedPdf = (note: PurchasedResource) => {
    const matching = allResources.find(r => r.id === note.resourceId);
    const rawUrl = matching?.directPdfUrl || matching?.downloadUrl || note.directPdfUrl || note.downloadUrl;
    const downloadUrl = formatDirectDownloadUrl(rawUrl);
    if (downloadUrl && (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://') || downloadUrl.startsWith('/downloads/'))) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      const downloadFileName = downloadUrl.startsWith('/downloads/') 
        ? downloadUrl.split('/').pop() || `${note.resourceId}.pdf`
        : `${note.resourceTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      link.setAttribute('download', downloadFileName);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (rawUrl) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Calculate total progress across all enrolled courses
  const getTotalCompletedLessons = () => {
    let completed = 0;
    let total = 0;
    myCoursesList.forEach(course => {
      const courseLessons = lessons.filter(l => l.courseId === course.id);
      total += courseLessons.length;
      const saved = localStorage.getItem(`completed_lessons_${course.id}`);
      if (saved) {
        try {
          const ids = JSON.parse(saved);
          completed += ids.filter((id: string) => courseLessons.some(l => l.id === id)).length;
        } catch {}
      }
    });
    return { completed, total };
  };

  const { completed: totalCompleted, total: totalLessonsCount } = getTotalCompletedLessons();
  const overallProgress = totalLessonsCount > 0 ? Math.round((totalCompleted / totalLessonsCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <SEO 
        title="My Courses & Purchased Notes - Student Dashboard | Skilldotpy"
        description="Access all your enrolled NIELIT O Level and CCC video masterclasses, lecture playlists, and downloadable PDF study notes."
      />

      {/* ═══════════════════════════════════════════════════════════════
          HERO BANNER WITH USER PROFILE
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] pt-10 pb-20 sm:pt-14 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-indigo-600/8 blur-[80px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative container mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
                {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Welcome back, {userProfile?.displayName || 'Student'}!
                  </h1>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/15">
                    ✓ Verified
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/resources"
                className="px-3.5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.06] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Study Notes</span>
              </Link>
              <Link
                to="/courses"
                className="px-3.5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.06] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Browse Courses</span>
              </Link>
              <button
                onClick={() => logout()}
                className="px-3.5 py-2.5 bg-white/[0.06] hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/20 text-slate-400 border border-white/[0.06] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 grid grid-cols-3 gap-3 max-w-lg"
          >
            {[
              { value: myCoursesList.length, label: 'Video Batches', color: 'text-blue-400' },
              { value: purchasedNotes.length, label: 'PDF Notes', color: 'text-amber-400' },
              { value: `${overallProgress}%`, label: 'Progress', color: 'text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.06] px-3 py-2.5 text-center">
                <div className={`text-lg sm:text-xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN CONTENT AREA — Floating card
         ═══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl -mt-8 relative z-10 pb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden"
        >
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab('courses'); setSearchTerm(''); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'courses'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Batches ({myCoursesList.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('notes'); setSearchTerm(''); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes ({purchasedNotes.length})</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={activeTab === 'courses' ? "Search courses..." : "Search notes..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-7">
            {/* ═══════════ TAB 1: VIDEO COURSES ═══════════ */}
            {activeTab === 'courses' && (
              <AnimatePresence mode="wait">
                {myCoursesList.length === 0 ? (
                  <motion.div 
                    key="empty-courses"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-4 max-w-md mx-auto"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500 mx-auto">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900">No Courses Enrolled Yet</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        You haven't enrolled in any paid video course batches yet. Explore our structured NIELIT O Level and CCC masterclasses to start learning.
                      </p>
                    </div>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 transition-all active:scale-95"
                    >
                      <span>Explore All Video Courses</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="course-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {filteredMyCourses.map((course, idx) => {
                      const courseLessons = lessons.filter(l => l.courseId === course.id);
                      const courseChapters = chapters.filter(c => c.courseId === course.id);
                      
                      // Calculate progress
                      const saved = localStorage.getItem(`completed_lessons_${course.id}`);
                      let completedCount = 0;
                      if (saved) {
                        try {
                          const ids = JSON.parse(saved);
                          completedCount = ids.filter((id: string) => courseLessons.some(l => l.id === id)).length;
                        } catch {}
                      }
                      const courseProgress = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;

                      return (
                        <motion.div 
                          key={course.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                        >
                          {/* Thumbnail */}
                          <div className="relative aspect-video bg-slate-900 overflow-hidden">
                            <img
                              src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60'}
                              alt={course.title}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            
                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-blue-600/90 backdrop-blur-sm text-white">
                                {course.category.toUpperCase()}
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                              <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Enrolled</span>
                              </span>
                              <span className="bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg font-mono">
                                {courseLessons.length || course.lecturesCount || 18} Lectures
                              </span>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <h3 className="text-[15px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                                {course.title}
                              </h3>
                              {course.hindiTitle && (
                                <p className="text-xs font-semibold text-slate-400 line-clamp-1">
                                  {course.hindiTitle}
                                </p>
                              )}
                            </div>

                            {/* Progress */}
                            {courseLessons.length > 0 && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] font-semibold">
                                  <span className="text-slate-500">{completedCount}/{courseLessons.length} completed</span>
                                  <span className={`font-bold ${courseProgress >= 100 ? 'text-emerald-600' : 'text-blue-600'}`}>{courseProgress}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                                      courseProgress >= 100 
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                                        : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                    }`}
                                    style={{ width: `${courseProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Meta info & Action */}
                            <div className="pt-3 border-t border-slate-100 space-y-3">
                              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                <span>{courseChapters.length} Chapters</span>
                                <span className="text-slate-300">•</span>
                                <span>{course.duration || '30+ Hours'}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-emerald-600 font-bold">Lifetime</span>
                              </div>

                              <Link
                                to={`/courses/${course.id}`}
                                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>{courseProgress > 0 ? 'Continue Watching' : 'Start Watching'}</span>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* ═══════════ TAB 2: PURCHASED NOTES & PDFS ═══════════ */}
            {activeTab === 'notes' && (
              <AnimatePresence mode="wait">
                {purchasedNotes.length === 0 ? (
                  <motion.div
                    key="empty-notes"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-4 max-w-md mx-auto"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mx-auto">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900">No Paid Notes Purchased Yet</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Any premium handwritten notes, formula cheat sheets, or chapter PDFs you unlock will be saved here permanently for instant study and offline download.
                      </p>
                    </div>
                    <Link
                      to="/resources"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all active:scale-95"
                    >
                      <span>Browse Study Notes Library</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="notes-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {filteredPurchasedNotes.map((note, idx) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-sm hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Unlocked</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                              {note.fileType || 'PDF'} • {note.fileSize || '3.5 MB'}
                            </span>
                          </div>

                          {note.moduleCode && (
                            <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100 inline-block mb-2">
                              {note.moduleCode}
                            </span>
                          )}

                          <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {note.resourceTitle}
                          </h3>

                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                            <span>Paid: ₹{note.amountPaid || 49}</span>
                            <span>
                              {new Date(note.purchasedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => handleOpenPurchasedPdf(note)}
                            title="Open PDF in a new tab"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                            <span>Read Online</span>
                          </button>

                          <button
                            onClick={() => handleDownloadPurchasedPdf(note)}
                            title="Download PDF"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
