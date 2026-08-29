import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowLeft, 
  BookOpen, 
  Sparkles,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { chapterMcqService } from '../services/chapterMcqService';
import { ChapterMeta, PaperMeta } from '../types/chapterMcq';

export function PaperChaptersList() {
  const { moduleId = 'm1-r5' } = useParams<{ moduleId: string }>();
  const [paper, setPaper] = useState<PaperMeta | undefined>(undefined);
  const [chapters, setChapters] = useState<ChapterMeta[]>([]);
  const [chapterCounts, setChapterCounts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const pMeta = chapterMcqService.getPaperMeta(moduleId);
    setPaper(pMeta);

    const chList = chapterMcqService.getModuleChapters(moduleId);
    setChapters(chList);

    const unsub = chapterMcqService.subscribe((items) => {
      const counts: { [key: number]: number } = {};
      items.filter(i => i.moduleId === moduleId).forEach((item) => {
        counts[item.chapterNumber] = (counts[item.chapterNumber] || 0) + 1;
      });
      setChapterCounts(counts);
      setChapters(chapterMcqService.getModuleChapters(moduleId));
      setPaper(chapterMcqService.getPaperMeta(moduleId));
    });

    return () => unsub();
  }, [moduleId]);

  const displayTitle = paper ? paper.title : 'Information Technology Tools and Network Basics';

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <SEO
        title={`${displayTitle} - Chapter-Wise MCQs | Skilldotpy`}
        description={`Practice all chapter-wise MCQs for ${displayTitle}. Instant feedback, detailed explanations, and complete NIELIT R5.1 exam coverage.`}
        canonicalUrl={`/chapter-wise-mcq/${moduleId}`}
      />

      {/* =========================================================================
          TOP BANNER (MATCHING IMAGE 2 DARK BLUE HEADER)
         ========================================================================= */}
      <section className="bg-[#1b365d] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl text-center">
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            {displayTitle}
          </h1>

          {/* Breadcrumbs matching image 2: "Home • Chapters • Information Technology Tools and Network Basics" */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300 mt-3 font-medium flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-400">•</span>
            <Link to="/chapter-wise-mcq" className="hover:text-white transition-colors">Chapters</Link>
            <span className="text-slate-400">•</span>
            <span className="text-slate-200">{displayTitle}</span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          FLOATING WHITE CONTAINER WITH ALL CHAPTERS (MATCHING IMAGE 2 GRID)
         ========================================================================= */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 lg:p-10">
          
          {/* Back & Switcher Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 flex-wrap gap-3">
            <Link
              to="/chapter-wise-mcq"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Papers
            </Link>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span>Paper Code:</span>
              <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded border border-blue-100">
                {paper?.code || moduleId.toUpperCase()}
              </span>
              <span>• {chapters.length} Chapters</span>
            </div>
          </div>

          {/* 3-Column Chapter Grid matching Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {chapters.map((ch) => {
              const liveCount = chapterCounts[ch.chapterNumber] || 0;
              const displayCount = liveCount > 0 ? liveCount : ch.mcqCount;

              return (
                <div
                  key={ch.chapterNumber}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Chapter Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 min-h-[3.2rem]">
                      {ch.title}
                    </h3>

                    {/* Green Dot Indicator & MCQ Count */}
                    <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-2xs shrink-0"></span>
                      <span>{displayCount} MCQs</span>
                    </div>
                  </div>

                  {/* Bottom Row: Chapter Number & "View MCQs" Teal Button */}
                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-500">
                      Chapter {ch.chapterNumber}
                    </span>

                    <Link
                      to={`/chapter-wise-mcq/${moduleId}/${ch.chapterNumber}`}
                      className="px-4 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      View MCQs
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Guide Strip */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              💡 <strong>Practice Tip:</strong> Click "View MCQs" on any chapter to start instant practice. Each answer is verified in real-time with comprehensive explanations.
            </p>
            <Link
              to={paper?.id ? (paper.id === 'ccc' ? '/ccc' : `/o-level/${paper.id}`) : '/o-level'}
              className="font-bold text-blue-600 hover:underline shrink-0"
            >
              Read Full Syllabus & Guide →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
