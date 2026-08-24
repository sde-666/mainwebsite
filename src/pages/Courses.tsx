import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Award, 
  Check, 
  Smartphone, 
  Laptop, 
  Code, 
  Sparkles, 
  Search,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { courses } from '../data/courses';
import { siteConfig } from '../data/config';

export function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <SEO
        title="O Level & CCC Video Courses"
        description="Explore masterclass video courses for NIELIT O Level (M1-R5 to M4-R5), CCC exams, Python programming & LibreOffice with mentorship by Skilldotpy."
        keywords={[
          'Skilldotpy courses',
          'NIELIT O level online coaching',
          'O level python course in Hindi',
          'CCC online preparation course',
          'LibreOffice complete video course',
          'Skilldotpy live batch and video classes'
        ]}
        schema={courseSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Courses & Video Batches', url: '/courses' }
        ]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Target Batches & Structured Masterclasses
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Learn Computer Science & Crack NIELIT Exams
          </h1>
          <p className="text-sm text-gray-600">
            Structured courses with sequential HD videos, downloadable PDF notes, chapter tests, practical codes, and direct teacher mentorship.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses (e.g. O Level, Python, LibreOffice, Web Design, CCC)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Courses' },
              { id: 'o-level', label: '🏆 NIELIT O Level' },
              { id: 'ccc', label: '🎓 NIELIT CCC' },
              { id: 'programming', label: '💻 Programming Languages' },
              { id: 'office-suite', label: '📊 Office Suite (Libre/MS)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams(cat.id === 'all' ? {} : { category: cat.id })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    course.category === 'o-level'
                      ? 'bg-blue-100 text-blue-800'
                      : course.category === 'ccc'
                      ? 'bg-amber-100 text-amber-800'
                      : course.category === 'programming'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {course.categoryLabel}
                  </span>
                  {course.discountBadge && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {course.discountBadge}
                    </span>
                  )}
                </div>

                {course.code && (
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Code: {course.code}
                  </span>
                )}

                <h3 className="font-bold text-base text-gray-900 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-blue-600 font-semibold mt-0.5">
                  {course.hindiTitle}
                </p>

                <p className="text-xs text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {course.overview}
                </p>

                {/* Features list */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    What&apos;s Included:
                  </span>
                  {course.features.slice(0, 4).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-gray-900">{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">{course.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 block">{course.duration}</span>
                </div>

                <Link
                  to="/app"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Enroll in App</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* SPONSOR BANNER */}
        <AdBanner slotId="courses-grid-bottom" format="horizontal" fallbackType="mock-test" />

        {/* Promo App Banner */}
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Student App Exclusive
            </span>
            <h3 className="text-xl font-bold text-white">
              Access All Courses with Offline Video & Test Series
            </h3>
            <p className="text-xs text-slate-300">
              Download the Skilldotpy Android APK for direct teacher chat and real CBT test interface.
            </p>
          </div>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs shrink-0 shadow-lg"
          >
            <Smartphone className="w-4 h-4" /> Download Official APK
          </Link>
        </div>

      </div>
    </div>
  );
}
