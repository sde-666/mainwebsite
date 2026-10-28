import { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  Star,
  Zap,
  Clock,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  X,
  MessageCircle,
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';
import { siteConfig } from '../data/config';
import { paidCourseService, extractYouTubeVideoId } from '../services/paidCourseService';
import { CourseItem, CourseChapter, CourseLesson } from '../types/paidCourse';
import { useAuth } from '../context/AuthContext';
import { ComingSoon } from '../components/ComingSoon';

export function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isGlobalComingSoon, setIsGlobalComingSoon] = useState<boolean>(false);
  
  // Quick Demo Video Modal
  const [demoModalLesson, setDemoModalLesson] = useState<{ lesson: CourseLesson; courseTitle: string } | null>(null);
  
  // Expanded FAQ items
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const { currentUser } = useAuth();
  const categoryScrollRef = useRef<HTMLDivElement>(null);

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
    { id: 'all', label: 'All Courses', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'm3', label: 'M3-R5 (Python)', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'm1', label: 'M1-R5 (IT Tools)', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'm2', label: 'M2-R5 (Web Design)', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'm4', label: 'M4-R5 (IoT)', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'ccc', label: 'CCC Exam', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'combo', label: 'Combo Batches', icon: <Star className="w-3.5 h-3.5" /> },
  ];

  // Filtering
  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.hindiTitle && c.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.overview.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // featured default
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

  const openQuickDemo = (course: CourseItem) => {
    const courseLessons = lessons.filter(l => l.courseId === course.id);
    const firstLesson = courseLessons.find(l => l.isFreePreview) || courseLessons[0];
    if (firstLesson) {
      setDemoModalLesson({
        lesson: firstLesson,
        courseTitle: course.title
      });
    }
  };

  if (isGlobalComingSoon) {
    return <ComingSoon isAllCourses />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16 antialiased">
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

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION — Deep gradient with animated glowing mesh
         ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] pt-14 pb-28 sm:pt-20 sm:pb-36">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[140px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto text-center space-y-5"
          >
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-white/[0.08] text-blue-300 border border-white/[0.08] backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Batches & Sequential Video Classes • 2026 Edition</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Learn Computer Science &
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"> Crack NIELIT Exams</span>
            </h1>
            
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Chapter-wise sequential HD video lectures, handwritten PDF formula notes, practical coding demonstrations, and 1000+ solved exam questions.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {[
                { icon: <Unlock className="w-3.5 h-3.5" />, text: 'First 2 Lectures Free', color: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/25' },
                { icon: <Video className="w-3.5 h-3.5" />, text: '1080p Sequential Classes', color: 'text-blue-300 bg-blue-500/15 border-blue-500/25' },
                { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: 'Mentorship by Er. Aditya', color: 'text-amber-300 bg-amber-500/15 border-amber-500/25' },
                { icon: <Users className="w-3.5 h-3.5" />, text: '50,000+ Enrolled Students', color: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/25' },
              ].map((item, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-sm ${item.color}`}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING CONTROL BAR — Search + Categories + Sorting
         ═══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-6xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-4 sm:p-5 space-y-3.5"
        >
          {/* Top row: Search + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses (e.g. O Level Python, LibreOffice, Web Design, CCC)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white font-medium transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto py-3 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="featured">Featured Batches</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills — horizontally scrollable on mobile */}
          <div 
            ref={categoryScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = cat.id === 'all' 
                ? courses.length 
                : courses.filter(c => c.category === cat.id).length;

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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-blue-700/80 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          COURSES GRID
         ═══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500">
            {sortedCourses.length === 0 
              ? 'No courses found' 
              : `Showing ${sortedCourses.length} course${sortedCourses.length !== 1 ? 's' : ''}`
            }
            {activeCategory !== 'all' && ` in "${categories.find(c => c.id === activeCategory)?.label}"`}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {sortedCourses.map((course, idx) => {
              const courseLessons = lessons.filter(l => l.courseId === course.id);
              const courseChapters = chapters.filter(c => c.courseId === course.id);
              const isEnrolled = paidCourseService.isUserEnrolled(currentUser?.uid, course.id, currentUser?.email);

              const discountPercent = course.originalPrice > course.price 
                ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
                : 0;

              return (
                <motion.div 
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img
                      src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60'}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/30" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-600/90 backdrop-blur-sm text-white">
                        {course.category.toUpperCase()}
                      </span>
                      {course.isComingSoon ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-sm text-slate-950 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Coming Soon</span>
                        </span>
                      ) : course.badge ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-400/90 backdrop-blur-sm text-slate-950">
                          {course.badge}
                        </span>
                      ) : null}
                    </div>

                    {/* Enrolled Badge */}
                    {isEnrolled && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-sm text-white">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Enrolled</span>
                        </span>
                      </div>
                    )}

                    {/* Bottom overlay: 2 Free Demos tag + Quick Demo Play Button */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                      <button
                        onClick={() => openQuickDemo(course)}
                        className="inline-flex items-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white transition-all cursor-pointer shadow-sm active:scale-95"
                        title="Watch Free Demo Lesson 1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Demo</span>
                      </button>

                      {course.duration && (
                        <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg font-mono text-[10px]">
                          {course.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h2 className="text-[15px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {course.title}
                      </h2>
                      
                      {course.hindiTitle && (
                        <p className="text-xs font-semibold text-slate-400 line-clamp-1">
                          {course.hindiTitle}
                        </p>
                      )}

                      <p className="text-[12.5px] text-slate-500 line-clamp-2 leading-relaxed">
                        {course.overview}
                      </p>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        {courseChapters.length || course.chaptersCount || 6} Chapters
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-blue-500" />
                        {courseLessons.length || course.lecturesCount || 18} Videos
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        PDF Notes
                      </span>
                    </div>

                    {/* Features Checklist */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[12px] text-slate-600">
                      {[
                        'Handwritten Theory & Formula PDF Notes',
                        'Solved Lab Practical Codes & CBT MCQs',
                        'Direct WhatsApp Mentorship by Aditya Sir'
                      ].map((feat, fi) => (
                        <div key={fi} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
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
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase mt-0.5">
                            <Zap className="w-3 h-3" />
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/courses/${course.id}`}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                            isEnrolled
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                          }`}
                        >
                          {isEnrolled ? (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Watch</span>
                            </>
                          ) : (
                            <>
                              <span>View Course</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </Link>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {sortedCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-16 space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No courses match your filter</h3>
            <p className="text-xs text-slate-500">Try a different search term or category.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSearchParams({}); }} 
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Reset all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          WHY LEARN WITH US / STATS
         ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] text-white rounded-3xl p-6 sm:p-12 shadow-2xl"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-cyan-500/10 blur-[60px]" />

            <div className="relative z-10 space-y-8">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/15">
                  <ShieldCheck className="w-3 h-3" />
                  Why Choose Skilldotpy?
                </span>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                  India's #1 Coaching for NIELIT Examinations
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every course is designed by Er. Aditya Pathak with high-yield concepts, exam-oriented notes, and direct WhatsApp doubt support.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: '50,000+', label: 'Students Mentored', sub: 'Across Web, Mobile App & YouTube', color: 'text-amber-400' },
                  { value: '100%', label: 'Updated 2026 Syllabus', sub: 'Strictly aligns with NIELIT R5.1 pattern', color: 'text-emerald-400' },
                  { value: 'Instant', label: 'Automatic Access', sub: 'Safe Razorpay payments & direct unlock', color: 'text-cyan-400' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 * i, duration: 0.5 }}
                    className="p-5 bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.06] text-center space-y-1.5 hover:bg-white/[0.07] transition-colors"
                  >
                    <span className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</span>
                    <p className="text-xs font-bold text-white">{stat.label}</p>
                    <p className="text-[11px] text-slate-400">{stat.sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STUDENT TESTIMONIALS & REVIEWS
         ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Real Student Reviews
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Trusted by Thousands of NIELIT Aspirants
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                name: 'Rahul Verma',
                exam: 'O Level M3-R5 Python (S-Grade)',
                comment: 'Aditya Sir explained Python concepts in Hindi so easily. The practical solved videos and notes helped me score an S Grade in my first attempt!',
                rating: 5
              },
              {
                name: 'Pooja Tiwari',
                exam: 'O Level M1-R5 IT Tools (A-Grade)',
                comment: 'LibreOffice Calc and Writer shortcuts PDF were pure gold. The sequential video classes made the whole syllabus crystal clear.',
                rating: 5
              },
              {
                name: 'Aman Srivastava',
                exam: 'CCC Exam (A-Grade)',
                comment: 'I prepared for just 2 weeks using Skilldotpy CCC video lectures and chapter notes. Cleared with A Grade smoothly!',
                rating: 5
              }
            ].map((review, ri) => (
              <div 
                key={ri} 
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, si) => (
                      <Star key={si} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{review.name}</h4>
                    <p className="text-[10px] font-semibold text-emerald-600">{review.exam}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          INTERACTIVE FAQS SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Got Questions?
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How do I access the course after paying?',
                a: 'Access is instantaneous! Upon successful Razorpay payment, your account is immediately unlocked. You can start watching all lectures and downloading notes right away on your phone or PC.'
              },
              {
                q: 'Can I watch demo classes before enrolling?',
                a: 'Yes! The first 2 video lectures and PDF notes of every single course are 100% FREE for all visitors. Just click on any course to preview.'
              },
              {
                q: 'Can I download the notes to my phone or print them?',
                a: 'Yes! All handwritten notes and formula sheets are available as downloadable PDF files that you can save offline and print.'
              },
              {
                q: 'How long will I have access to the lectures?',
                a: 'You get Lifetime Access! You can revisit any lesson as many times as you like, even across future exam cycles.'
              },
              {
                q: 'How does WhatsApp doubt mentorship work?',
                a: 'Enrolled students receive dedicated WhatsApp chat support directly with Er. Aditya Pathak to resolve coding errors, theory questions, and exam preparation queries.'
              }
            ].map((faq, fi) => {
              const isOpen = expandedFaqIndex === fi;
              return (
                <div 
                  key={fi}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setExpandedFaqIndex(isOpen ? null : fi)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pl-11">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          QUICK DEMO VIDEO MODAL
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {demoModalLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden max-w-3xl w-full text-white shadow-2xl space-y-0"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
                <div className="min-w-0 pr-3">
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Free Demo Lecture
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold truncate mt-1">
                    {demoModalLesson.lesson.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate">
                    {demoModalLesson.courseTitle}
                  </p>
                </div>
                <button
                  onClick={() => setDemoModalLesson(null)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="aspect-video w-full bg-black relative">
                {demoModalLesson.lesson.youtubeUrl || demoModalLesson.lesson.videoId ? (
                  <iframe
                    className="w-full h-full border-0"
                    src={`https://www.youtube-nocookie.com/embed/${demoModalLesson.lesson.videoId || extractYouTubeVideoId(demoModalLesson.lesson.youtubeUrl)}?autoplay=1&rel=0&modestbranding=1`}
                    title={demoModalLesson.lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                    Video unavailable
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-900 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Enjoying the demo? Unlock all remaining lectures, practical codes & PDF notes.
                </span>
                <Link
                  to={`/courses/${demoModalLesson.lesson.courseId}`}
                  onClick={() => setDemoModalLesson(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shrink-0 flex items-center gap-1.5 transition-colors"
                >
                  <span>Full Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Help CTA */}
      <a
        href="https://wa.me/919451992010"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
        title="Chat on WhatsApp with Er. Aditya"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold">
          Doubt Support
        </span>
      </a>

    </div>
  );
}
