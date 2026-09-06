import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, Gift, Crown, ChevronDown, ShieldCheck, Bookmark, Zap as Lightning, Cloud, 
  FileText, 
  Code, 
  BookOpen, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Eye,
  ExternalLink,
  Tag,
  Unlock,
  CreditCard,
  Star,
  GraduationCap
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { DynamicResource, PurchasedResource } from '../types/database';
import { resourceService, formatDirectDownloadUrl } from '../services/resourceService';
import { resourceCategories } from '../data/resources';
import { useAuth } from '../context/AuthContext';
import { openResourceRazorpayCheckout } from '../utils/razorpay';
import { StudentAuthModal } from '../components/auth/StudentAuthModal';

const resourceCollectionSchema = {
  '@type': 'CollectionPage',
  '@id': 'https://skilldotpy.com/resources#notes-library',
  name: 'Free O Level Notes and Premium NIELIT Study Material',
  url: 'https://skilldotpy.com/resources',
  description: 'Free O Level notes, NIELIT O Level M1 to M4 study material, CCC notes, solved papers, practical code and premium handwritten PDF notes.',
  isPartOf: { '@id': 'https://skilldotpy.com/#website' },
  about: [
    { '@type': 'Thing', name: 'NIELIT O Level notes' },
    { '@type': 'Thing', name: 'Free O Level notes PDF' },
    { '@type': 'Thing', name: 'CCC study material' }
  ],
  hasPart: resourceCategories.map((category) => ({
    '@type': 'CollectionPage',
    name: `${category.title} notes and study material`,
    description: category.description,
    url: `https://skilldotpy.com/resources#${category.id}`
  }))
};

export function Resources() {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const [resourcesList, setResourcesList] = useState<DynamicResource[]>([]);
  const [purchasedList, setPurchasedList] = useState<PurchasedResource[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Always open sample preview in a new window
  const handlePreviewSample = (res: DynamicResource) => {
    const sampleUrl = res.previewPdfUrl || res.directPdfUrl || res.downloadUrl;
    if (sampleUrl) {
      window.open(sampleUrl, '_blank', 'noopener,noreferrer');
    } else {
      setToastMessage('Sample preview link is being updated. Please check back shortly.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Always open full PDF in a new window
  const handleOpenPdf = (res: DynamicResource) => {
    resourceService.recordDownload(res.id);
    const targetUrl = res.directPdfUrl || res.downloadUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      setToastMessage('PDF link is being updated. Please try again in a moment.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Direct download PDF
  const handleDownloadPdf = (res: DynamicResource) => {
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
    } else if (rawUrl) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
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

          setToastMessage(`Success! "${res.title}" unlocked. Opening complete notes in a new window.`);
          handleOpenPdf(res);
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
    <div className="bg-slate-50 min-h-screen pb-16">
      <SEO
        title="Free O Level Notes PDF | NIELIT M1-M4 Study Material"
        description="Download free O Level notes PDF for NIELIT M1, M2, M3 and M4, plus CCC notes, solved papers, practical code and premium handwritten study material."
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
        schema={resourceCollectionSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Study Notes & PDFs', url: '/resources' }
        ]}
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

      {/* =========================================================================
          HERO BANNER (MATCHING CHAPTER WISE MCQ HUB LAYOUT)
         ========================================================================= */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-[#102a43] px-4 pb-12 pt-10 text-white sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(14,116,144,.35),transparent_52%,rgba(15,23,42,.65))]" />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full border border-cyan-200/10" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-end gap-8 lg:grid-cols-[1.35fr_.65fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3.5 py-1.5 text-xs font-black text-cyan-100">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Skilldotpy Notes Library - Updated for R5.1</span>
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Free O Level Notes and NIELIT Study Material
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Find clear, exam-focused notes for NIELIT O Level M1, M2, M3 and M4. Download free O Level notes, solved papers and practical files, or preview premium handwritten PDF notes before unlocking them.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-200">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Free PDFs and downloads</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-300" /> Exam-focused content</span>
              <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4 text-amber-300" /> Preview premium notes</span>
            </div>
          </div>
          <div className="border-l border-white/15 pl-6 lg:pb-1">
            <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-200">Choose your study path</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm font-bold">
              <button onClick={() => setPriceFilter('free')} className="rounded-xl border border-emerald-200/25 bg-emerald-300/10 px-3 py-3 text-left text-emerald-100 transition hover:bg-emerald-300/20">Free notes <span className="mt-1 block text-xs font-medium text-emerald-200/75">{resourcesList.filter(r => !r.isPaid).length} resources</span></button>
              <button onClick={() => setPriceFilter('paid')} className="rounded-xl border border-amber-200/25 bg-amber-300/10 px-3 py-3 text-left text-amber-100 transition hover:bg-amber-300/20">Premium notes <span className="mt-1 block text-xs font-medium text-amber-200/75">{resourcesList.filter(r => r.isPaid).length} resources</span></button>
            </div>
            <Link to="/my-courses" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"><GraduationCap className="h-4 w-4" /> My purchased notes ({purchasedList.length})</Link>
          </div>
          
          {isAdmin && (
            <div className="pt-4">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 bg-slate-800 text-amber-300 border border-slate-700 px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-slate-700 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin CMS: Manage Notes</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <main className="container mx-auto mb-16 mt-4 max-w-7xl px-4 sm:mt-8 sm:px-6 lg:px-8">
  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
    
    {/* Sidebar Navigation */}
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="text-xs font-black text-gray-400 mb-3 uppercase tracking-wider ml-1">Categories</h3>
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 lg:mx-0 lg:px-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center justify-between group ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-200'
              }`}
            >
              <span>All Papers</span>
              <ChevronDown className={`w-4 h-4 -rotate-90 opacity-0 lg:opacity-100 transition-transform ${activeCategory === 'all' ? 'text-blue-200 translate-x-1' : 'text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1'}`} />
            </button>
            {resourceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center justify-between group ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-200'
                }`}
              >
                <span>{cat.title}</span>
                <ChevronDown className={`w-4 h-4 -rotate-90 opacity-0 lg:opacity-100 transition-transform ${activeCategory === cat.id ? 'text-blue-200 translate-x-1' : 'text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>

    {/* Main Content Area */}
    <div className="flex-1 min-w-0 space-y-8">
      
      {/* Search & Top Filters */}
      <div className="space-y-4">
        {/* Search Box */}
        <div className="relative max-w-full">
          <Search className="w-5 h-5 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by topic, paper (M1, M2, M3...), Python, CCC, LibreOffice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-shadow"
          />
        </div>

        {/* Price Filter Pill Switches */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPriceFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              priceFilter === 'all'
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Gift className={`w-4 h-4 ${priceFilter === 'all' ? 'text-blue-500' : 'text-gray-400'}`} />
            <span>All ({resourcesList.length})</span>
          </button>
          <button
            onClick={() => setPriceFilter('free')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              priceFilter === 'free'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                : 'bg-white text-emerald-600 border-gray-200 hover:bg-emerald-50'
            }`}
          >
            <Gift className="w-4 h-4 text-emerald-500" />
            <span>Free ({resourcesList.filter(r => !r.isPaid).length})</span>
          </button>
          <button
            onClick={() => setPriceFilter('paid')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              priceFilter === 'paid'
                ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                : 'bg-white text-amber-600 border-gray-200 hover:bg-amber-50'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Premium ({resourcesList.filter(r => r.isPaid).length})</span>
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 gap-4 pt-2 lg:grid-cols-2 sm:gap-5">
        {filteredResources.map((res) => {
          const purchased = isResourcePurchased(res.id);
          const price = res.price || 49;
          const totalPages = res.totalPages || 45;

          const tier: 'unlocked' | 'premium' | 'free' = purchased ? 'unlocked' : res.isPaid ? 'premium' : 'free';

          const iconRingColor =
            res.category === 'm2-r5' ? 'text-fuchsia-500 bg-fuchsia-50 ring-fuchsia-100' :
            res.category === 'm3-r5' ? 'text-sky-500 bg-sky-50 ring-sky-100' :
            res.category === 'm4-r5' ? 'text-orange-500 bg-orange-50 ring-orange-100' :
            res.category === 'ccc' ? 'text-rose-500 bg-rose-50 ring-rose-100' :
            'text-teal-500 bg-teal-50 ring-teal-100';

          return (
            <div
              key={res.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-0.5 ${
                tier === 'premium'
                  ? 'border-amber-200/80 shadow-[0_4px_18px_rgba(120,53,15,0.07)] hover:border-amber-300 hover:shadow-[0_12px_28px_rgba(120,53,15,0.12)]'
                  : 'border-slate-200 shadow-[0_4px_18px_rgba(15,23,42,0.06)] hover:border-teal-300 hover:shadow-[0_12px_28px_rgba(15,118,110,0.12)]'
              }`}
            >
              <div className={`flex items-center justify-between border-b px-5 py-3 sm:px-6 ${tier === 'premium' ? 'border-amber-100 bg-amber-50/50' : 'border-slate-100 bg-slate-50/70'}`}>
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconRingColor}`}>
                    {res.category === 'm4-r5' ? <Lightning className="h-5 w-5" /> : res.category === 'm2-r5' || res.category === 'm3-r5' ? <Code className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  {tier === 'unlocked' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Unlocked
                    </span>
                  ) : tier === 'premium' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                      <Crown className="h-3.5 w-3.5 text-amber-600" /> Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-700">
                      <Gift className="h-3.5 w-3.5" /> Free
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-[10px] font-bold text-slate-500 sm:text-xs">
                  {res.isPaid ? `${totalPages} pages` : (res.categoryLabel || res.category || 'NIELIT O Level')}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col border-l-4 border-transparent px-5 pb-5 pt-4 sm:px-6 sm:pb-6" style={{ borderLeftColor: tier === 'premium' ? '#d97706' : '#0f766e' }}>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[.14em] text-slate-400">{res.moduleCode || res.categoryLabel}</p>
                  <h2 className="line-clamp-2 text-base font-extrabold leading-snug text-gray-900 sm:text-lg">
                    {res.title}
                  </h2>
                  {res.hindiTitle && (
                    <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-1">
                      {res.hindiTitle}
                    </p>
                  )}
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 sm:text-sm">{res.description}</p>

                {res.sampleHighlights && res.sampleHighlights.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs font-medium text-slate-600">
                    {res.sampleHighlights.slice(0, 1).map((highlight) => <li key={highlight} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" /> <span className="line-clamp-1">{highlight}</span></li>)}
                  </ul>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${tier === 'premium' ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <FileText className="w-3.5 h-3.5" />
                    {res.fileType || 'PDF'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500">
                    {res.fileSize || '850 KB'}
                  </span>
                </div>

                <div className={`flex items-center gap-2 sm:gap-3 mt-4 pt-3 border-t border-dashed ${tier === 'premium' ? 'border-violet-100' : 'border-emerald-100'}`}>
                  {purchased || !res.isPaid ? (
                    <>
                      <button
                        onClick={() => handleOpenPdf(res)}
                        title="View PDF"
                        className="flex-1 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer inline-flex justify-center items-center gap-1.5 sm:gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View PDF</span>
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(res)}
                        title="Download PDF"
                        className="flex-1 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-sm shadow-emerald-600/25 transition-all cursor-pointer inline-flex justify-center items-center gap-1.5 sm:gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handlePreviewSample(res)}
                        title="Preview"
                        className="flex-1 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-violet-50 text-gray-700 font-bold text-xs sm:text-sm border border-gray-200 hover:border-violet-200 transition-colors cursor-pointer inline-flex justify-center items-center gap-1.5 sm:gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => handleDirectUnlock(res)}
                        disabled={isUnlockingId === res.id}
                        className="flex-1 px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs sm:text-sm shadow-sm shadow-violet-600/30 transition-all cursor-pointer inline-flex justify-center items-center gap-1.5 sm:gap-2"
                      >
                        {isUnlockingId === res.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Unlock className="w-4 h-4" />
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
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h4 className="text-base font-bold text-gray-900">No study notes found</h4>
          <p className="text-sm text-gray-500 mt-1">Try changing your search keywords or switching filters above.</p>
        </div>
      )}

      {/* BOTTOM FEATURES BANNER */}
      <div className="mt-12 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
             <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
                <h4 className="font-bold text-gray-900 text-sm">100% Trusted</h4>
                <p className="text-xs text-gray-500 mt-0.5">Quality notes you can rely on</p>
             </div>
          </div>
          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
             <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Bookmark className="w-6 h-6" />
             </div>
             <div>
                <h4 className="font-bold text-gray-900 text-sm">Exam Focused</h4>
                <p className="text-xs text-gray-500 mt-0.5">Curated for better results</p>
             </div>
          </div>
          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
             <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                <Lightning className="w-6 h-6" />
             </div>
             <div>
                <h4 className="font-bold text-gray-900 text-sm">Regular Updates</h4>
                <p className="text-xs text-gray-500 mt-0.5">Fresh content every week</p>
             </div>
          </div>
          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
             <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Cloud className="w-6 h-6" />
             </div>
             <div>
                <h4 className="font-bold text-gray-900 text-sm">Download & Access</h4>
                <p className="text-xs text-gray-500 mt-0.5">Study anytime, anywhere</p>
             </div>
          </div>
        </div>
      </div>

      {/* BOTTOM RESOURCES MONETIZATION BANNER */}
      <div className="pt-8">
        <AdBanner slotId="resources-grid-bottom" format="horizontal" fallbackType="notes" />
      </div>

    </div>
  </div>
</main>

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
