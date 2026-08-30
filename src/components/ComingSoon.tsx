import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import { SEO } from './SEO';

interface ComingSoonProps {
  courseTitle?: string;
  courseCategory?: string;
  badge?: string;
  teacherName?: string;
  isAllCourses?: boolean;
}

export function ComingSoon({
  courseTitle,
  courseCategory,
  badge = 'Coming Soon',
  teacherName,
  isAllCourses = false
}: ComingSoonProps) {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center p-4">
      <SEO
        title={courseTitle ? `${courseTitle} - Coming Soon | Skilldotpy` : 'Coming Soon | Skilldotpy'}
        description="This content is coming soon."
      />
      
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8" />
        </div>
        
        <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-200 mb-4">
          {badge}
        </div>
        
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 leading-snug">
          {courseTitle ? courseTitle : 'Content'} is Coming Soon
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
          We are currently working hard to prepare this material. It will be available shortly. Stay tuned!
        </p>
        
        <Link
          to="/courses"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>
      </div>
    </div>
  );
}
