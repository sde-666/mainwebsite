import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  FileText, 
  Code, 
  BookOpen, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Eye,
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { DynamicResource } from '../types/database';
import { resourceService } from '../services/resourceService';
import { resourceCategories } from '../data/resources';
import { PdfViewerModal } from '../components/PdfViewerModal';
import { useAuth } from '../context/AuthContext';

export function Resources() {
  const { isAdmin } = useAuth();
  const [resourcesList, setResourcesList] = useState<DynamicResource[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingResource, setViewingResource] = useState<DynamicResource | null>(null);

  useEffect(() => {
    const unsub = resourceService.subscribeResources((data) => {
      setResourcesList(data);
    });
    return unsub;
  }, []);

  const filteredResources = resourcesList.filter((res) => {
    let matchesCat = activeCategory === 'all';
    if (!matchesCat) {
      if (res.category === activeCategory) {
        matchesCat = true;
      } else if (activeCategory === 'm1-r5' && (res.moduleCode?.toLowerCase().includes('m1') || res.tags?.some(t => t.toLowerCase().includes('m1')))) {
        matchesCat = true;
      } else if (activeCategory === 'm2-r5' && (res.moduleCode?.toLowerCase().includes('m2') || res.tags?.some(t => t.toLowerCase().includes('m2')))) {
        matchesCat = true;
      } else if (activeCategory === 'm3-r5' && (res.moduleCode?.toLowerCase().includes('m3') || res.tags?.some(t => t.toLowerCase().includes('m3')))) {
        matchesCat = true;
      } else if (activeCategory === 'm4-r5' && (res.moduleCode?.toLowerCase().includes('m4') || res.tags?.some(t => t.toLowerCase().includes('m4')))) {
        matchesCat = true;
      } else if (activeCategory === 'practicals' && (res.category === 'practicals' || res.tags?.some(t => t.toLowerCase().includes('practical')))) {
        matchesCat = true;
      }
    }

    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.hindiTitle && res.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (res.tags && res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (res.moduleCode && res.moduleCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenPdf = (res: DynamicResource) => {
    setViewingResource(res);
    resourceService.recordDownload(res.id);
  };

  const handleDirectDownload = (res: DynamicResource) => {
    resourceService.recordDownload(res.id);
    const url = res.directPdfUrl || res.downloadUrl;
    if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/downloads/'))) {
      const link = document.createElement('a');
      link.href = url;
      const downloadFileName = url.startsWith('/downloads/') 
        ? url.split('/').pop() || `${res.id}.pdf`
        : `${res.id}.pdf`;
      link.setAttribute('download', downloadFileName);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setViewingResource(res);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <SEO
        title="NIELIT O Level & CCC Free PDF Notes, Syllabus, Old Papers Download"
        description="Download 100% free official NIELIT O Level (M1-R5, M2-R5, M3-R5 Python, M4-R5 IoT) & CCC study notes PDF, solved papers, Python practical scripts & LibreOffice cheatsheets by Skilldotpy."
        keywords={[
          'Skilldotpy notes',
          'Skilldotpy PDF download',
          'NIELIT O level free notes pdf download',
          'O level syllabus 2026 pdf',
          'O level python practical code download',
          'CCC free notes pdf Hindi',
          'LibreOffice shortcut cheat sheet pdf download',
          'NIELIT O level previous year question paper with answer'
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Study Resources & Notes', url: '/resources' }
        ]}
      />

      {/* Embedded PDF Viewer Modal */}
      <PdfViewerModal
        resource={viewingResource}
        onClose={() => setViewingResource(null)}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> 100% Free Study Materials & Syllabuses
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            NIELIT Free PDF Notes, Syllabus & Solved Papers
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Carefully curated chapter notes, past year solutions, official syllabuses, and lab source codes. Direct view & download with zero paywalls.
          </p>

          {isAdmin && (
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 bg-slate-900 text-amber-300 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Mode Active: Manage Chapters & Notes in CMS</span>
              </Link>
            </div>
          )}
        </div>

        {/* Featured Chapter-Wise Interactive Notes Portal Banner */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-blue-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> New Interactive Chapter Notes
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Read Notes Chapter-by-Chapter (Blog Format)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Structured NIELIT notes organized by Course &rarr; Chapter &rarr; Topic with bilingual Hindi/English explanations, diagrams, exam tips, and one-click print feature.
              </p>

              {/* Quick Course Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  to="/notes/m1-r5"
                  className="px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-xs font-bold text-blue-200 transition-colors"
                >
                  M1-R5.1 & CCC
                </Link>
                <Link
                  to="/notes/m2-r5"
                  className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/30 text-xs font-bold text-emerald-200 transition-colors"
                >
                  M2-R5.1 Web
                </Link>
                <Link
                  to="/notes/m3-r5"
                  className="px-3 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/30 text-xs font-bold text-amber-200 transition-colors"
                >
                  M3-R5.1 Python
                </Link>
                <Link
                  to="/notes/m4-r5"
                  className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 text-xs font-bold text-purple-200 transition-colors"
                >
                  M4-R5.1 IoT
                </Link>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                to="/notes/m1-r5/m1-ch1-intro-computer/m1-ch1-memory-systems"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Notes Reader →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* PRIME AD PLACEMENT: Resources Mid-Page Banner */}
        <AdBanner slotId="resources-mid-page" format="horizontal" fallbackType="app" />

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, paper (M1, M2, M3, M4, CCC, Python, LibreOffice, Syllabus)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Resources ({resourcesList.length})
            </button>
            {resourceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {res.categoryLabel || res.category}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400">
                    {res.fileType} • {res.fileSize}
                  </span>
                </div>

                {res.moduleCode && (
                  <span className="text-[10px] font-bold text-amber-600 block mb-1">
                    {res.moduleCode}
                  </span>
                )}

                <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {res.title}
                </h3>
                {res.hindiTitle && (
                  <p className="text-[11px] font-medium text-blue-600 mt-0.5">
                    {res.hindiTitle}
                  </p>
                )}

                <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-100">
                  {res.tags?.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <span className="text-[10px] text-gray-400 font-medium truncate">
                  📥 {typeof res.downloadCount === 'number' ? `${res.downloadCount}+` : res.downloadCount}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenPdf(res)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleDirectDownload(res)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 space-y-3">
            <FileText className="w-12 h-12 text-gray-300 mx-auto" />
            <h4 className="text-base font-bold text-gray-900">No resources found matching your search</h4>
            <p className="text-xs text-gray-500">Try searching for other keywords like "M1", "Python", "CCC" or "LibreOffice".</p>
          </div>
        )}

        {/* BOTTOM RESOURCES MONETIZATION BANNER */}
        <div className="pt-8">
          <AdBanner slotId="resources-grid-bottom" format="horizontal" fallbackType="notes" />
        </div>

      </div>
    </div>
  );
}
