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
  Lock
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { paidCourseService } from '../services/paidCourseService';
import { resourceService, formatDirectDownloadUrl } from '../services/resourceService';
import { CourseItem, CourseChapter, CourseLesson, CourseEnrollment } from '../types/paidCourse';
import { PurchasedResource, DynamicResource } from '../types/database';
import { StudentAuthModal } from '../components/auth/StudentAuthModal';
import { ResourcePreviewModal } from '../components/ResourcePreviewModal';

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

  // If user is not logged in, show prompt
  if (!currentUser) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <SEO 
          title="Student Dashboard - My Enrolled Courses & Notes | Skilldotpy"
          description="Access your purchased NIELIT O Level and CCC video batches, watch lectures, and download PDF notes."
        />

        <div className="container mx-auto px-4 max-w-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-md">
            <GraduationCap className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Student Dashboard
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Please sign in with your student account to access your enrolled video courses, practice assignments, and handwritten PDF notes.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Sign In to My Account
            </button>
            <Link
              to="/courses"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
            >
              Explore Paid Courses
            </Link>
          </div>
        </div>

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

  const handleDownloadPurchasedPdf = (note: PurchasedResource) => {
    const rawUrl = note.directPdfUrl || note.downloadUrl;
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
    } else {
      const matching = allResources.find(r => r.id === note.resourceId);
      if (matching) setViewingResource(matching);
    }
  };

  const handleOpenPurchasedViewer = (note: PurchasedResource) => {
    const matching = allResources.find(r => r.id === note.resourceId);
    if (matching) {
      setViewingResource(matching);
    } else {
      // Create temporary DynamicResource from note data
      setViewingResource({
        id: note.resourceId,
        title: note.resourceTitle,
        category: (note.category as any) || 'o-level',
        categoryLabel: 'Purchased Notes',
        moduleCode: note.moduleCode,
        description: 'Verified purchased note document in your student library.',
        fileType: (note.fileType as any) || 'PDF',
        fileSize: note.fileSize || '3.5 MB',
        downloadCount: 'Purchased',
        downloadUrl: note.downloadUrl,
        directPdfUrl: note.directPdfUrl,
        tags: ['Purchased', note.moduleCode || 'Notes'],
        isPaid: true,
        price: note.amountPaid
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <SEO 
        title="My Courses & Purchased Notes - Student Dashboard | Skilldotpy"
        description="Access all your enrolled NIELIT O Level and CCC video masterclasses, lecture playlists, and downloadable PDF study notes."
      />

      {/* PDF Viewer / Preview Modal */}
      <ResourcePreviewModal
        resource={viewingResource}
        onClose={() => setViewingResource(null)}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8">
        
        {/* User Profile Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Welcome back, {userProfile?.displayName || 'Student'}!
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {currentUser.email} • {enrollments.length} Video Batches • {purchasedNotes.length} PDF Notes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/resources"
              className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Browse Study Notes</span>
            </Link>
            <Link
              to="/courses"
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Browse Video Courses</span>
            </Link>
            <button
              onClick={() => logout()}
              className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>My Video Batches ({myCoursesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Purchased Notes & PDFs ({purchasedNotes.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'courses' ? "Search my courses..." : "Search purchased notes..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium shadow-2xs"
            />
          </div>
        </div>

        {/* TAB 1: VIDEO COURSES */}
        {activeTab === 'courses' && (
          <div>
            {myCoursesList.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-xs max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Courses Enrolled Yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    You haven't enrolled in any paid video course batches yet. Explore our structured NIELIT O Level and CCC masterclasses to start learning.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/20 transition-all"
                  >
                    <span>Explore All Video Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyCourses.map((course) => {
                  const courseLessons = lessons.filter(l => l.courseId === course.id);
                  const courseChapters = chapters.filter(c => c.courseId === course.id);

                  return (
                    <div 
                      key={course.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img
                          src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60'}
                          alt={course.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                            {course.category.toUpperCase()}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                          <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 rounded-lg">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Enrolled & Unlocked</span>
                          </span>
                          <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-lg font-mono">
                            {courseLessons.length || course.lecturesCount || 18} Lectures
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                            {course.title}
                          </h3>
                          {course.hindiTitle && (
                            <p className="text-xs font-semibold text-slate-500 line-clamp-1">
                              {course.hindiTitle}
                            </p>
                          )}
                          <p className="text-xs text-slate-600 line-clamp-2 pt-1">
                            {course.overview}
                          </p>
                        </div>

                        {/* Meta info & Action */}
                        <div className="pt-3 border-t border-slate-100 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                            <span>{courseChapters.length} Chapters</span>
                            <span>•</span>
                            <span>{course.duration || '30+ Hours'}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-bold">Lifetime Access</span>
                          </div>

                          <Link
                            to={`/courses/${course.id}`}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Continue Watching</span>
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PURCHASED NOTES & PDFS */}
        {activeTab === 'notes' && (
          <div>
            {purchasedNotes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-xs max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Paid Notes Purchased Yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Any premium handwritten notes, formula cheat sheets, or chapter PDFs you unlock will be saved here permanently for instant study and offline download.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to="/resources"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all"
                  >
                    <span>Browse Study Notes Library</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPurchasedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white rounded-3xl border border-emerald-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>UNLOCKED & ACTIVE</span>
                        </span>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {note.fileType || 'PDF'} • {note.fileSize || '3.5 MB'}
                        </span>
                      </div>

                      {note.moduleCode && (
                        <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block mb-1.5">
                          {note.moduleCode}
                        </span>
                      )}

                      <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                        {note.resourceTitle}
                      </h3>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>Paid: ₹{note.amountPaid || 49}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(note.purchasedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPurchasedViewer(note)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Read Online</span>
                      </button>

                      <button
                        onClick={() => handleDownloadPurchasedPdf(note)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
