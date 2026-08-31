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
  Tag,
  Lock,
  Unlock,
  CreditCard,
  Zap,
  Star,
  GraduationCap
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { DynamicResource, PurchasedResource } from '../types/database';
import { resourceService, formatDirectDownloadUrl } from '../services/resourceService';
import { resourceCategories } from '../data/resources';
import { ResourcePreviewModal } from '../components/ResourcePreviewModal';
import { useAuth } from '../context/AuthContext';
import { openResourceRazorpayCheckout } from '../utils/razorpay';
import { StudentAuthModal } from '../components/auth/StudentAuthModal';

export function Resources() {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const [resourcesList, setResourcesList] = useState<DynamicResource[]>([]);
  const [purchasedList, setPurchasedList] = useState<PurchasedResource[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewingResource, setPreviewingResource] = useState<DynamicResource | null>(null);

  // Auth Modal trigger
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState('');
  const [pendingUnlockResource, setPendingUnlockResource] = useState<DynamicResource | null>(null);
  const [isUnlockingId, setIsUnlockingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = resourceService.subscribeResources((data) => {
      setResourcesList(data);
    });
    return unsub;
  }, []);

  // Subscribe to user purchases
  useEffect(() => {
    const unsubPurchases = resourceService.subscribePurchasedResources(
      currentUser?.uid,
      currentUser?.email || undefined,
      (purchases) => {
        setPurchasedList(purchases);
      }
    );
    return unsubPurchases;
  }, [currentUser]);

  const isResourcePurchased = (resourceId: string): boolean => {
    return purchasedList.some(p => p.resourceId === resourceId) ||
      resourceService.isResourcePurchased(currentUser?.uid, resourceId, currentUser?.email || undefined);
  };

  const filteredResources = resourcesList.filter((res) => {
    // Price filter
    if (priceFilter === 'free' && res.isPaid) return false;
    if (priceFilter === 'paid' && !res.isPaid) return false;

    // Category filter
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

  const handleOpenPreview = (res: DynamicResource) => {
    setPreviewingResource(res);
  };

  const handleFreeDownload = (res: DynamicResource) => {
    resourceService.recordDownload(res.id);
    const rawUrl = res.directPdfUrl || res.downloadUrl;
    const downloadUrl = formatDirectDownloadUrl(rawUrl);
    if (downloadUrl && (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://') || downloadUrl.startsWith('/downloads/'))) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      const downloadFileName = downloadUrl.startsWith('/downloads/') 
        ? downloadUrl.split('/').pop() || `${res.id}.pdf`
        : `${res.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      link.setAttribute('download', downloadFileName);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setPreviewingResource(res);
    }
  };

  const handleDirectUnlock = (res: DynamicResource) => {
    if (!currentUser) {
      setPendingUnlockResource(res);
      setAuthNotice(`Please sign in with your student account to unlock and download "${res.title}".`);
      setIsAuthModalOpen(true);
      return;
    }

    const price = res.price || 49;
    setIsUnlockingId(res.id);

    openResourceRazorpayCheckout({
      resource: res,
      studentName: userProfile?.displayName || currentUser.displayName || 'Student',
      studentEmail: currentUser.email || 'student@skilldotpy.com',
      studentPhone: userProfile?.phoneNumber || '9876543210',
      onSuccess: async (paymentId, orderId) => {
        try {
          await resourceService.purchaseResource({
            userId: currentUser.uid,
            userEmail: currentUser.email || '',
            userName: userProfile?.displayName || currentUser.displayName || 'Student',
            resource: res,
            amountPaid: price,
            paymentId,
            orderId
          });

          setToastMessage(`Success! "${res.title}" unlocked and added to your My Courses.`);
          handleFreeDownload(res);
          setTimeout(() => setToastMessage(null), 5000);
        } catch (err) {
          console.error('Purchase processing error:', err);
        } finally {
          setIsUnlockingId(null);
        }
      },
      onDismiss: () => {
        setIsUnlockingId(null);
      },
      onError: (err) => {
        setIsUnlockingId(null);
        console.error('Payment failed:', err);
      }
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <SEO
        title="NIELIT O Level & CCC Study Notes (Free & Paid PDF) 2026"
        description="Download free and premium NIELIT O Level (M1-R5.1, M2-R5.1, M3-R5.1, M4-R5.1) and CCC handwritten PDF notes, solved papers, practical code files & formula sheets."
        keywords={[
          'O Level free notes pdf download',
          'O Level paid handwritten notes pdf',
          'NIELIT O Level M1 R5 notes pdf',
          'O Level Python notes pdf download',
          'CCC free notes pdf Hindi',
          'LibreOffice shortcut cheat sheet pdf',
          'NIELIT solved practical questions 2026',
          'Skilldotpy study resources'
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Study Notes & PDFs', url: '/resources' }
        ]}
      />

      {/* Secure 2-3 Page Preview & Unlock Modal */}
      <ResourcePreviewModal
        resource={previewingResource}
        onClose={() => setPreviewingResource(null)}
        onPurchaseSuccess={(res) => {
          setToastMessage(`Successfully unlocked ${res.title}! Check My Courses tab.`);
        }}
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-bounce max-w-md">
          <div className="p-4 bg-emerald-600 border border-emerald-500 rounded-2xl shadow-2xl flex items-center gap-3 text-white text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-100/80 text-blue-900 border border-blue-200 text-xs font-bold px-3.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> 
            <span>Official Study Portal • Free & Premium PDF Library</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            NIELIT O Level & CCC Study Notes & PDF Hub
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Access free official syllabuses, practical scripts, and high-scoring handwritten master notes. Read sample pages before unlocking, with 100% lifetime access in your student library.
          </p>

          {/* Quick Access Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free Official Syllabuses & Codes
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-bold">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Premium Handwritten Notes (₹39 - ₹49)
            </div>
            <Link
              to="/my-courses"
              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-full font-bold transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" /> My Purchased Notes ({purchasedList.length})
            </Link>
          </div>

          {isAdmin && (
            <div className="pt-1">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 bg-slate-900 text-amber-300 border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin CMS: Add or Set Notes Price & Preview Pages</span>
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
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Interactive Web Chapter Notes
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Read Notes Online Chapter-by-Chapter
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Structured NIELIT notes organized by Course &rarr; Chapter &rarr; Topic with bilingual Hindi/English explanations, diagrams, exam tips, and quick print mode.
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

        {/* Ad Banner */}
        <AdBanner slotId="resources-mid-page" format="horizontal" fallbackType="app" />

        {/* Search & Comprehensive Filters */}
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, paper (M1, M2, M3, M4, Python, CCC, LibreOffice, Syllabus)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
          </div>

          {/* Price Filter Pill Switches */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                priceFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Notes ({resourcesList.length})
            </button>
            <button
              onClick={() => setPriceFilter('free')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                priceFilter === 'free'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Free Only</span>
            </button>
            <button
              onClick={() => setPriceFilter('paid')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                priceFilter === 'paid'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Premium Paid Notes (₹)</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Papers
            </button>
            {resourceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

        {/* Resources Grid with Free / Paid Markers & Price Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const purchased = isResourcePurchased(res.id);
            const price = res.price || 49;
            const originalPrice = res.originalPrice || Math.round(price * 2.5);
            const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            const totalPages = res.totalPages || 45;
            const previewPages = res.previewPageCount || 3;

            return (
              <div
                key={res.id}
                className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-xl group relative overflow-hidden ${
                  res.isPaid 
                    ? 'border-amber-200/80 hover:border-amber-400 bg-gradient-to-b from-white via-white to-amber-50/20' 
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                {/* Free / Paid / Purchased Corner Marker */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {purchased ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>UNLOCKED & PURCHASED</span>
                    </span>
                  ) : res.isPaid ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>PREMIUM NOTES</span>
                      </span>
                      <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        ₹{price} <span className="line-through text-slate-400 font-normal text-[10px]">₹{originalPrice}</span>
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <span>100% FREE</span>
                    </span>
                  )}

                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {res.fileType} • {res.fileSize}
                  </span>
                </div>

                {/* Content Details */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {res.moduleCode && (
                      <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {res.moduleCode}
                      </span>
                    )}
                    <span className="text-[10px] font-medium text-slate-500">
                      {res.isPaid ? `${totalPages} Pages` : (res.categoryLabel || res.category)}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {res.title}
                  </h3>
                  {res.hindiTitle && (
                    <p className="text-[11px] font-medium text-blue-700 mt-0.5">
                      {res.hindiTitle}
                    </p>
                  )}

                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>

                  {/* Highlights if present */}
                  {res.isPaid && res.sampleHighlights && res.sampleHighlights.length > 0 && (
                    <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl space-y-1">
                      <p className="text-[10px] font-black text-amber-900 uppercase">Includes:</p>
                      <ul className="text-[11px] text-amber-800 space-y-0.5">
                        {res.sampleHighlights.slice(0, 2).map((h, i) => (
                          <li key={i} className="truncate flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-100">
                    {res.tags?.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                    <span>📥 {typeof res.downloadCount === 'number' ? `${res.downloadCount}+` : res.downloadCount} downloads</span>
                    {res.isPaid && !purchased && (
                      <span className="text-amber-700 font-bold">{previewPages} Pages Free Preview</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {purchased || !res.isPaid ? (
                      /* Free or Already Unlocked Actions */
                      <>
                        <button
                          onClick={() => handleOpenPreview(res)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>View PDF</span>
                        </button>

                        <button
                          onClick={() => handleFreeDownload(res)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </>
                    ) : (
                      /* Paid Notes Actions: Preview (2-3 Pages) + Direct Unlock */
                      <>
                        <button
                          onClick={() => handleOpenPreview(res)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-amber-100/70 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-700" />
                          <span>Preview Sample</span>
                        </button>

                        <button
                          onClick={() => handleDirectUnlock(res)}
                          disabled={isUnlockingId === res.id}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/25 active:scale-95 cursor-pointer"
                        >
                          {isUnlockingId === res.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-950 fill-current" />
                          )}
                          <span>Unlock ₹{price}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 space-y-3">
            <FileText className="w-12 h-12 text-gray-300 mx-auto" />
            <h4 className="text-base font-bold text-gray-900">No study notes found</h4>
            <p className="text-xs text-gray-500">Try changing your search keywords or switching filter categories above.</p>
          </div>
        )}

        {/* BOTTOM RESOURCES MONETIZATION BANNER */}
        <div className="pt-6">
          <AdBanner slotId="resources-grid-bottom" format="horizontal" fallbackType="notes" />
        </div>

      </div>

      {/* Student Auth Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingUnlockResource(null);
        }}
        redirectNotice={authNotice}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          if (pendingUnlockResource) {
            const resToUnlock = pendingUnlockResource;
            setPendingUnlockResource(null);
            setTimeout(() => handleDirectUnlock(resToUnlock), 300);
          }
        }}
      />
    </div>
  );
}
