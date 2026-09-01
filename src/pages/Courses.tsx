import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Award, 
  Check, 
  Search, 
  BookOpen, 
  ArrowRight, 
  Video, 
  FileText, 
  Sparkles, 
  Lock, 
  Unlock, 
  Play, 
  ShieldCheck, 
  GraduationCap,
  Users,
  CheckCircle2
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { siteConfig } from '../data/config';
import { paidCourseService } from '../services/paidCourseService';
import { CourseItem, CourseChapter, CourseLesson } from '../types/paidCourse';
import { useAuth } from '../context/AuthContext';
import { ComingSoon } from '../components/ComingSoon';

export function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isGlobalComingSoon, setIsGlobalComingSoon] = useState<boolean>(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubCourses = paidCourseService.subscribeCourses((items) => {
      setCourses(items.filter(c => c.isPublished));
    });
    const unsubChapters = paidCourseService.subscribeChapters(setChapters);
    const unsubLessons = paidCourseService.subscribeLessons(setLessons);
    const unsubComingSoon = paidCourseService.subscribeComingSoon(setIsGlobalComingSoon);
    const unsubEnrollments = paidCourseService.subscribeEnrollments(setEnrollments);

    return () => {
      unsubCourses();
      unsubChapters();
      unsubLessons();
      unsubComingSoon();
      unsubEnrollments();
    };
  }, []);

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'm3', label: 'M3-R5 (Python)' },
    { id: 'm1', label: 'M1-R5 (IT Tools)' },
    { id: 'm2', label: 'M2-R5 (Web Design)' },
    { id: 'm4', label: 'M4-R5 (IoT)' },
    { id: 'ccc', label: 'CCC Exam' },
    { id: 'combo', label: 'Combo Batches' },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.hindiTitle && c.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.overview.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: courses.map((course, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        description: course.overview,
        provider: {
          '@type': 'Organization',
          name: siteConfig.name,
          sameAs: siteConfig.url
        }
      }
    }))
  };

  if (isGlobalComingSoon) {
    return <ComingSoon isAllCourses />;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <SEO
        title="O Level Paid Courses & Video Master Batches (M1, M2, M3, M4) | Skilldotpy"
        description="Join NIELIT O Level paid video courses & master batches. Complete theory, chapter-wise notes, test series, practical lab sessions & 2 free demo lectures per module."
        canonicalUrl="/courses"
        keywords={[
          'o level paid course',
          'o level paid batch in hindi',
          'nielit o level video course',
          'o level complete master batch m1 m2 m3 m4',
          'o level python paid course',
          'ccc masterclass video batch',
          'skilldotpy paid courses'
        ]}
        schema={courseSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Paid Courses', url: '/courses' }
        ]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Target Batches & Sequential Video Classes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Learn Computer Science & Crack NIELIT Exams
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Chapter-wise sequential HD video lectures, handwritten PDF formula notes, practical coding demonstrations, and 1000+ solved exam questions.
          </p>

          {/* Freemium Highlight Box */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-emerald-600 font-extrabold">
              <Unlock className="w-4 h-4" />
              <span>First 2 Lectures & 2 PDFs 100% Free</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <Video className="w-4 h-4" />
              <span>Unlisted HD Video Classes</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Mentorship by Er. Aditya Pathak</span>
            </span>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses (e.g. O Level Python, LibreOffice, Web Design, CCC)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs font-medium"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'all') {
                      searchParams.delete('category');
                      setSearchParams(searchParams);
                    } else {
                      setSearchParams({ category: cat.id });
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredCourses.map((course) => {
            const courseLessons = lessons.filter(l => l.courseId === course.id);
            const courseChapters = chapters.filter(c => c.courseId === course.id);
            const isEnrolled = paidCourseService.isUserEnrolled(currentUser?.uid, course.id, currentUser?.email);

            const discountPercent = course.originalPrice > course.price 
              ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
              : 0;

            return (
              <div 
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Thumbnail & Badge */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60'}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                  
                  {/* Category & Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                      {course.category.toUpperCase()}
                    </span>
                    {course.isComingSoon ? (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                        <span>Coming Soon</span>
                      </span>
                    ) : course.badge ? (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                        {course.badge}
                      </span>
                    ) : null}
                  </div>

                  {/* Free Demo Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                    <span className="inline-flex items-center gap-1 bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 rounded-lg">
                      <Unlock className="w-3 h-3" />
                      <span>2 Free Demo Lessons</span>
                    </span>
                    {course.duration && (
                      <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-lg font-mono">
                        {course.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {course.title}
                    </h2>
                    
                    {course.hindiTitle && (
                      <p className="text-xs font-semibold text-slate-500 line-clamp-1">
                        {course.hindiTitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.overview}
                    </p>
                  </div>

                  {/* Features Checklist */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{courseChapters.length || course.chaptersCount || 6} Chapters & {courseLessons.length || course.lecturesCount || 18} Video Lectures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Handwritten Theory & Formula PDF Notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Solved Lab Practical Codes & CBT MCQs</span>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">
                          ₹{course.price}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="text-xs font-bold text-slate-400 line-through">
                            ₹{course.originalPrice}
                          </span>
                        )}
                      </div>
                      {discountPercent > 0 && (
                        <span className="text-[10px] font-black text-emerald-600 uppercase">
                          {discountPercent}% OFF Special Offer
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/courses/${course.id}`}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                        isEnrolled
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Course</span>
                        </>
                      ) : (
                        <>
                          <span>Watch Demo & Enroll</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Ad Banner for organic monetization */}
        <AdBanner format="horizontal" className="my-8" />

        {/* Student Trust & Guarantee Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto shadow-2xl space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Why Learn with Skilldotpy?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Zero to Master Coaching for NIELIT Examinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every course is handcrafted by Er. Aditya Pathak with high-yield concepts, exam-oriented notes, and direct WhatsApp doubt support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-center">
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-2xl font-black text-amber-400">50,000+</span>
              <p className="text-xs font-bold text-white">Students Trained</p>
              <p className="text-[11px] text-slate-400">Across YouTube, App and Web</p>
            </div>
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-2xl font-black text-emerald-400">100%</span>
              <p className="text-xs font-bold text-white">Updated R5.1 Syllabus</p>
              <p className="text-[11px] text-slate-400">Latest 2026 examination pattern</p>
            </div>
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-2xl font-black text-blue-400">Instant</span>
              <p className="text-xs font-bold text-white">Automatic Enrollment</p>
              <p className="text-[11px] text-slate-400">Safe payments via Razorpay</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
