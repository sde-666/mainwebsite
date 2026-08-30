import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Video, 
  FileText, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  DollarSign, 
  ExternalLink,
  Sparkles,
  RefreshCw,
  X,
  Play,
  Layers,
  GraduationCap,
  Clock,
  Radio,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { paidCourseService, extractYouTubeVideoId } from '../../services/paidCourseService';
import { CourseItem, CourseChapter, CourseLesson, StudentEnrollment } from '../../types/paidCourse';

export function AdminPaidCoursesPanel() {
  const [activeTab, setActiveTab] = useState<'courses' | 'chapters-lessons' | 'enrollments'>('courses');
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [isGlobalComingSoon, setIsGlobalComingSoon] = useState<boolean>(false);
  
  // Modals
  const [editingCourse, setEditingCourse] = useState<Partial<CourseItem> | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const [editingChapter, setEditingChapter] = useState<Partial<CourseChapter> | null>(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  const [editingLesson, setEditingLesson] = useState<Partial<CourseLesson> | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  const [manualStudentEmail, setManualStudentEmail] = useState('');
  const [manualStudentName, setManualStudentName] = useState('');
  const [isManualEnrollModalOpen, setIsManualEnrollModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const unsubCourses = paidCourseService.subscribeCourses((cList) => {
      setCourses(cList);
      if (!selectedCourseId && cList.length > 0) {
        setSelectedCourseId(cList[0].id);
      }
    });

    const unsubChapters = paidCourseService.subscribeChapters((chList) => {
      setChapters(chList);
    });

    const unsubLessons = paidCourseService.subscribeLessons((lList) => {
      setLessons(lList);
    });

    const unsubEnrollments = paidCourseService.subscribeEnrollments((eList) => {
      setEnrollments(eList);
    });

    const unsubComingSoon = paidCourseService.subscribeComingSoon((val) => {
      setIsGlobalComingSoon(val);
    });

    return () => {
      unsubCourses();
      unsubChapters();
      unsubLessons();
      unsubEnrollments();
      unsubComingSoon();
    };
  }, [selectedCourseId]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const courseChapters = chapters
    .filter(ch => ch.courseId === selectedCourseId)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
  const courseLessons = lessons
    .filter(l => l.courseId === selectedCourseId)
    .sort((a, b) => {
      if (a.chapterNumber !== b.chapterNumber) return a.chapterNumber - b.chapterNumber;
      return a.lessonNumber - b.lessonNumber;
    });

  // Calculate stats
  const totalRevenue = enrollments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalStudents = new Set(enrollments.map(e => e.studentEmail?.toLowerCase())).size;

  // Toggle Global Coming Soon Mode
  const handleToggleGlobalComingSoon = async () => {
    try {
      const nextState = !isGlobalComingSoon;
      await paidCourseService.setComingSoonMode(nextState);
      if (nextState) {
        showToast('Coming Soon mode enabled for all paid courses! Visitors will now see the Coming Soon page.', 'success');
      } else {
        showToast('Coming Soon mode disabled. All published paid courses are now live for students!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update Coming Soon status', 'error');
    }
  };

  // Toggle Single Course Coming Soon
  const handleToggleCourseComingSoon = async (courseId: string) => {
    try {
      await paidCourseService.toggleCourseComingSoon(courseId);
      showToast('Course Coming Soon status updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update course', 'error');
    }
  };

  // ================= COURSE HANDLERS =================
  const handleOpenCreateCourse = () => {
    setEditingCourse({
      title: '',
      hindiTitle: '',
      subtitle: '',
      overview: '',
      badge: 'New 2026 Batch',
      category: 'm3',
      price: 499,
      originalPrice: 1499,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60',
      isPublished: true,
      teacherName: 'Er. Aditya Pathak',
      duration: '30+ Hours',
      language: 'Hinglish (Hindi + English)',
      features: [
        'HD Video Classes (Unlisted YouTube)',
        'Chapter-wise PDF Notes',
        'Solved Practical Lab Assignments',
        'Direct WhatsApp Doubt Mentorship'
      ],
      learningOutcomes: [
        'Master concepts with hands-on practice',
        'Pass NIELIT exam with S/A Grade'
      ]
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.title?.trim()) {
      showToast('Course title is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const saved = await paidCourseService.saveCourse(editingCourse);
      setSelectedCourseId(saved.id);
      setIsCourseModalOpen(false);
      setEditingCourse(null);
      showToast('Course saved and synchronized to Cloud Firestore!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save course', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (courseId: string) => {
    try {
      await paidCourseService.toggleCourseVisibility(courseId);
      showToast('Course visibility status updated');
    } catch (err: any) {
      showToast(err.message || 'Failed to update visibility', 'error');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course and all its chapters & lessons?')) {
      await paidCourseService.deleteCourse(courseId);
      showToast('Course deleted');
    }
  };

  // ================= CHAPTER HANDLERS =================
  const handleOpenCreateChapter = () => {
    if (!selectedCourseId) {
      showToast('Please select a course first', 'error');
      return;
    }
    const nextChapterNum = courseChapters.length + 1;
    setEditingChapter({
      courseId: selectedCourseId,
      chapterNumber: nextChapterNum,
      title: '',
      hindiTitle: '',
      description: ''
    });
    setIsChapterModalOpen(true);
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter || !editingChapter.title?.trim()) {
      showToast('Chapter title is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await paidCourseService.saveChapter(editingChapter);
      setIsChapterModalOpen(false);
      setEditingChapter(null);
      showToast('Chapter saved to Cloud Firestore!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save chapter', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (window.confirm('Are you sure you want to delete this chapter and all its lessons?')) {
      await paidCourseService.deleteChapter(chapterId);
      showToast('Chapter deleted');
    }
  };

  // ================= LESSON HANDLERS =================
  const handleOpenCreateLesson = (chapterId?: string, chapterNumber?: number) => {
    if (!selectedCourseId) {
      showToast('Please select a course first', 'error');
      return;
    }
    const targetChapter = courseChapters.find(c => c.id === chapterId) || courseChapters[0];
    const chNum = chapterNumber || targetChapter?.chapterNumber || 1;
    const existingLessons = courseLessons.filter(l => l.chapterNumber === chNum);
    const nextLesNum = existingLessons.length + 1;

    // By default, if it's among the first 2 lessons of the course, mark as free preview
    const isFirstTwo = courseLessons.length < 2;

    setEditingLesson({
      courseId: selectedCourseId,
      chapterId: chapterId || targetChapter?.id || '',
      chapterNumber: chNum,
      lessonNumber: nextLesNum,
      title: '',
      hindiTitle: '',
      duration: '25:00',
      videoType: 'youtube',
      youtubeUrl: '',
      hasPdf: true,
      pdfTitle: 'Chapter Notes PDF',
      pdfUrl: '',
      pdfPages: 10,
      isFreePreview: isFirstTwo
    });
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !editingLesson.title?.trim()) {
      showToast('Lesson title is required', 'error');
      return;
    }
    if (!editingLesson.youtubeUrl?.trim()) {
      showToast('YouTube video URL is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await paidCourseService.saveLesson(editingLesson);
      setIsLessonModalOpen(false);
      setEditingLesson(null);
      showToast('Video lecture & PDF saved to Cloud Firestore!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save lesson', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      await paidCourseService.deleteLesson(lessonId);
      showToast('Lesson deleted');
    }
  };

  // ================= MANUAL STUDENT ACCESS =================
  const handleGrantManualAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStudentEmail.trim()) {
      showToast('Student email is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await paidCourseService.grantManualAccess(
        manualStudentEmail.trim(), 
        selectedCourseId, 
        manualStudentName.trim() || 'Manual Student'
      );
      setManualStudentEmail('');
      setManualStudentName('');
      setIsManualEnrollModalOpen(false);
      showToast(`Access granted to ${manualStudentEmail}! Student can now watch all locked lessons.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to grant access', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Sync to Cloud
  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const res = await paidCourseService.syncAllToCloud();
      showToast(`Cloud Sync Complete! ${res.count} course items synchronized to Firestore.`);
    } catch (err: any) {
      showToast(err.message || 'Sync failed', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-bold ${
            toast.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-rose-950 border-rose-500 text-rose-200'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Top Banner & Quick Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Paid Courses & Video CMS
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span>Firebase-First Architecture</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Course, Chapter & Video Lectures Manager
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Add course videos (Unlisted YouTube links), attach PDF notes, create chapters, toggle course visibility, and manage enrolled students with automatic unlocking.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Global Coming Soon Switch */}
            <button
              onClick={handleToggleGlobalComingSoon}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isGlobalComingSoon
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle Coming Soon mode for all courses (Useful when preparing batches before launch)"
            >
              {isGlobalComingSoon ? <ToggleRight className="w-4 h-4 text-slate-950" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
              <span>{isGlobalComingSoon ? 'Coming Soon Mode: ON' : 'Coming Soon Mode: OFF'}</span>
            </button>

            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Sync all course data to Firebase Cloud Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync to Cloud'}</span>
            </button>

            <button
              onClick={() => setIsManualEnrollModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Grant Student Access</span>
            </button>

            <button
              onClick={handleOpenCreateCourse}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>
        </div>

        {/* Quick Analytics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Courses</span>
            <p className="text-lg font-black text-white mt-0.5">{courses.length}</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Published Active</span>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{courses.filter(c => c.isPublished).length}</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Enrolled Students</span>
            <p className="text-lg font-black text-blue-400 mt-0.5">{totalStudents}</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Revenue</span>
            <p className="text-lg font-black text-amber-400 mt-0.5">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Courses vs Chapters & Lectures vs Enrolled Students */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'courses', label: '1. Manage Courses', icon: Layers },
          { id: 'chapters-lessons', label: '2. Chapters, Videos & PDF Notes', icon: Video },
          { id: 'enrollments', label: `3. Enrolled Students (${enrollments.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: COURSES LIST ================= */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const chCount = chapters.filter(c => c.courseId === course.id).length;
              const lesCount = lessons.filter(l => l.courseId === course.id).length;
              const enrollCount = enrollments.filter(e => e.courseId === course.id).length;

              return (
                <div
                  key={course.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
                    course.isPublished
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/60 border-rose-950/60 opacity-85'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-800/60 uppercase">
                        {course.category.toUpperCase()}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleCourseComingSoon(course.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
                            course.isComingSoon
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                          }`}
                          title="Toggle Coming Soon status for this specific course"
                        >
                          <Clock className="w-3 h-3" />
                          <span>{course.isComingSoon ? 'Coming Soon' : 'Live'}</span>
                        </button>

                        <button
                          onClick={() => handleToggleVisibility(course.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-colors ${
                            course.isPublished
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/80'
                              : 'bg-rose-950/60 text-rose-300 border-rose-800/60 hover:bg-rose-900/80'
                          }`}
                          title="Click to toggle Visible / Hidden"
                        >
                          {course.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{course.isPublished ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {course.title}
                      </h3>
                      {course.hindiTitle && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-medium">
                          {course.hindiTitle}
                        </p>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {course.overview}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-base font-black text-white">₹{course.price}</span>
                        {course.originalPrice > course.price && (
                          <span className="text-[11px] text-slate-500 line-through ml-1.5">
                            ₹{course.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono space-x-2">
                        <span>{chCount} Chs</span>
                        <span>•</span>
                        <span>{lesCount} Lectures</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{enrollCount} Enrolled</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setActiveTab('chapters-lessons');
                      }}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Manage Lectures ({lesCount})</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={`/courses/${course.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Student View"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => {
                          setEditingCourse({ ...course });
                          setIsCourseModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Course Info"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: CHAPTERS, VIDEOS & PDF NOTES ================= */}
      {activeTab === 'chapters-lessons' && (
        <div className="space-y-6">
          {/* Course Selector Dropdown */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Selected Course:
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500 max-w-md"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} {c.isPublished ? '' : '(Hidden)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCreateChapter}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Chapter</span>
              </button>

              <button
                onClick={() => handleOpenCreateLesson()}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Video Lecture</span>
              </button>
            </div>
          </div>

          {/* Chapters & Lessons Accordions */}
          <div className="space-y-4">
            {courseChapters.map((ch) => {
              const chLessons = courseLessons.filter(l => l.chapterId === ch.id || l.chapterNumber === ch.chapterNumber);

              return (
                <div key={ch.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  {/* Chapter Header */}
                  <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        {ch.chapterNumber}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          Chapter {ch.chapterNumber}: {ch.title}
                        </h4>
                        {ch.hindiTitle && (
                          <p className="text-[11px] text-slate-400">{ch.hindiTitle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                        {chLessons.length} Lectures
                      </span>
                      <button
                        onClick={() => handleOpenCreateLesson(ch.id, ch.chapterNumber)}
                        className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1"
                        title="Add lecture to this chapter"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Lecture</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingChapter({ ...ch });
                          setIsChapterModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Edit Chapter Title"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteChapter(ch.id)}
                        className="p-1 text-rose-400 hover:text-rose-300"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons List in this Chapter */}
                  <div className="p-4 space-y-2">
                    {chLessons.map((les, idx) => (
                      <div
                        key={les.id || idx}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-blue-400">
                            <Video className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white">
                                {les.title}
                              </span>
                              {les.isFreePreview ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                                  <Unlock className="w-2.5 h-2.5" />
                                  <span>Free Demo</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Locked (Paid)</span>
                                </span>
                              )}
                            </div>

                            {les.hindiTitle && (
                              <p className="text-[10px] text-slate-400">{les.hindiTitle}</p>
                            )}

                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-1">
                              <span>Duration: {les.duration || '25:00'}</span>
                              <span>•</span>
                              <span>YT ID: {les.videoId || extractYouTubeVideoId(les.youtubeUrl)}</span>
                              {les.hasPdf && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-400 flex items-center gap-0.5">
                                    <FileText className="w-3 h-3" />
                                    <span>PDF Attached</span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={les.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1"
                            title="Test YouTube Video Link"
                          >
                            <Play className="w-3 h-3" />
                            <span className="hidden sm:inline">Play</span>
                          </a>

                          <button
                            onClick={() => {
                              setEditingLesson({ ...les });
                              setIsLessonModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                            title="Edit Lecture"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteLesson(les.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/30"
                            title="Delete Lecture"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {chLessons.length === 0 && (
                      <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                        <p className="text-xs text-slate-500">No lectures added in this chapter yet.</p>
                        <button
                          onClick={() => handleOpenCreateLesson(ch.id, ch.chapterNumber)}
                          className="mt-2 text-xs font-bold text-blue-400 hover:underline"
                        >
                          + Add First Lecture
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {courseChapters.length === 0 && (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No chapters found for this course.</p>
                <button
                  onClick={handleOpenCreateChapter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Create First Chapter
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: ENROLLED STUDENTS ================= */}
      {activeTab === 'enrollments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Enrolled Students Directory</h3>
              <p className="text-xs text-slate-400">All students who purchased courses via Razorpay or granted access by Admin</p>
            </div>

            <button
              onClick={() => setIsManualEnrollModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Grant Student Free Access</span>
            </button>
          </div>

          {/* Enrollments Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Student Name & Email</th>
                  <th className="p-3">Course Enrolled</th>
                  <th className="p-3">Amount Paid</th>
                  <th className="p-3">Payment / Txn ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {enrollments.map((en) => (
                  <tr key={en.id} className="hover:bg-slate-950/40">
                    <td className="p-3">
                      <span className="font-bold text-white block">{en.studentName || 'Student'}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{en.studentEmail}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-200">
                      {en.courseTitle}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      ₹{en.amountPaid}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-400">
                      {en.paymentId}
                    </td>
                    <td className="p-3 text-[11px] text-slate-400">
                      {new Date(en.enrolledAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        {en.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {enrollments.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs">
                No student enrollments found yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 1: ADD / EDIT COURSE ================= */}
      {isCourseModalOpen && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingCourse.id ? 'Edit Course Details' : 'Create New Paid Course'}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Course Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIELIT O Level Python (M3-R5.1) Complete Masterclass"
                  value={editingCourse.title || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Course Title (Hindi - Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ओ लेवल पायथन कम्पलीट वीडियो बैच + नोट्स"
                  value={editingCourse.hindiTitle || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, hindiTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={editingCourse.category || 'm3'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  >
                    <option value="m1">M1-R5 (IT Tools)</option>
                    <option value="m2">M2-R5 (Web Design)</option>
                    <option value="m3">M3-R5 (Python)</option>
                    <option value="m4">M4-R5 (IoT)</option>
                    <option value="ccc">CCC Exam</option>
                    <option value="combo">Combo All 4 Papers</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingCourse.price || 499}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingCourse.originalPrice || 1499}
                    onChange={(e) => setEditingCourse({ ...editingCourse, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Overview / Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.overview || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, overview: e.target.value })}
                  placeholder="Detailed course description..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={editingCourse.thumbnailUrl || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, thumbnailUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Teacher / Mentor Name</label>
                  <input
                    type="text"
                    value={editingCourse.teacherName || 'Er. Aditya Pathak'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, teacherName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={editingCourse.isPublished}
                    onChange={(e) => setEditingCourse({ ...editingCourse, isPublished: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <label htmlFor="isPublished" className="font-semibold text-white cursor-pointer text-xs">
                    Visible on website
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isComingSoon"
                    checked={!!editingCourse.isComingSoon}
                    onChange={(e) => setEditingCourse({ ...editingCourse, isComingSoon: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                  <label htmlFor="isComingSoon" className="font-semibold text-amber-300 cursor-pointer text-xs flex items-center gap-1">
                    <span>Show "Coming Soon" page (Pre-launch)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  {isSaving ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD / EDIT CHAPTER ================= */}
      {isChapterModalOpen && editingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingChapter.id ? 'Edit Chapter' : 'Add New Chapter to Course'}
              </h3>
              <button onClick={() => setIsChapterModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-24">
                  <label className="block font-semibold text-slate-300 mb-1">Ch No. *</label>
                  <input
                    type="number"
                    required
                    value={editingChapter.chapterNumber || 1}
                    onChange={(e) => setEditingChapter({ ...editingChapter, chapterNumber: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold text-slate-300 mb-1">Chapter Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Variables, Expressions & Operators"
                    value={editingChapter.title || ''}
                    onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Chapter Title (Hindi)</label>
                <input
                  type="text"
                  placeholder="e.g. वेरिएबल्स, एक्सप्रेशन्स एवं ऑपरेटर्स"
                  value={editingChapter.hindiTitle || ''}
                  onChange={(e) => setEditingChapter({ ...editingChapter, hindiTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsChapterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  {isSaving ? 'Saving...' : 'Save Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: ADD / EDIT LECTURE (YOUTUBE + PDF) ================= */}
      {isLessonModalOpen && editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  Video Lecture & Notes CMS
                </span>
                <h3 className="text-base font-bold text-white">
                  {editingLesson.id ? 'Edit Video Lecture' : 'Add Unlisted YouTube Video Lecture'}
                </h3>
              </div>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Chapter *</label>
                  <select
                    value={editingLesson.chapterId || ''}
                    onChange={(e) => {
                      const ch = courseChapters.find(c => c.id === e.target.value);
                      setEditingLesson({
                        ...editingLesson,
                        chapterId: e.target.value,
                        chapterNumber: ch?.chapterNumber || 1
                      });
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  >
                    {courseChapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        Ch {ch.chapterNumber}: {ch.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Duration (e.g. 28:45)</label>
                  <input
                    type="text"
                    placeholder="28:45"
                    value={editingLesson.duration || '25:00'}
                    onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Lecture Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. L03: Python Variables, Identifiers & Data Types"
                  value={editingLesson.title || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Lecture Title (Hindi)</label>
                <input
                  type="text"
                  placeholder="e.g. पायथन में वेरिएबल्स और डेटा टाइप्स"
                  value={editingLesson.hindiTitle || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, hindiTitle: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              {/* YouTube Video Link Field */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-amber-400">
                    Unlisted YouTube Video Link or Video ID *
                  </label>
                  <span className="text-[10px] text-slate-400">YouTube Player Embedded</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={editingLesson.youtubeUrl || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    const vId = extractYouTubeVideoId(url);
                    setEditingLesson({
                      ...editingLesson,
                      youtubeUrl: url,
                      videoId: vId
                    });
                  }}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                />
                {editingLesson.videoId && (
                  <p className="text-[10px] text-emerald-400 font-mono">
                    ✓ Valid Video ID Detected: {editingLesson.videoId}
                  </p>
                )}
              </div>

              {/* PDF Notes Field */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-blue-400">Attached PDF Notes URL</label>
                  <span className="text-[10px] text-slate-400">Google Drive / Cloud PDF Link</span>
                </div>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/... or direct PDF link"
                  value={editingLesson.pdfUrl || ''}
                  onChange={(e) => setEditingLesson({
                    ...editingLesson,
                    pdfUrl: e.target.value,
                    hasPdf: Boolean(e.target.value?.trim())
                  })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                />
                <input
                  type="text"
                  placeholder="PDF Notes Title (e.g. Chapter 2 Complete Handwritten Notes PDF)"
                  value={editingLesson.pdfTitle || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, pdfTitle: e.target.value })}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                />
              </div>

              {/* Free Preview Toggle */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Free Demo Preview Access</span>
                  <span className="text-[11px] text-slate-400">
                    If checked, all free visitors can watch this lecture without paying. (Course rule: first 2 are free).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editingLesson.isFreePreview}
                  onChange={(e) => setEditingLesson({ ...editingLesson, isFreePreview: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  {isSaving ? 'Saving...' : 'Save Lecture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: GRANT MANUAL ACCESS ================= */}
      {isManualEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Grant Free Student Course Access</h3>
              <button onClick={() => setIsManualEnrollModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrantManualAccess} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Course *</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikas Kumar"
                  value={manualStudentName}
                  onChange={(e) => setManualStudentName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Student Email *</label>
                <input
                  type="email"
                  required
                  placeholder="student@gmail.com"
                  value={manualStudentEmail}
                  onChange={(e) => setManualStudentEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsManualEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                >
                  {isSaving ? 'Granting...' : 'Grant Full Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
