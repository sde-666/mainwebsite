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
  ShieldCheck,
  Tag,
  Lock,
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
      <section className="bg-slate-900 text-white pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-black px-3.5 py-1.5 rounded-full mb-4 border border-blue-400/30 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Official Study Portal • Free & Premium PDF Library</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            NIELIT Study Notes & PDF Hub
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
            Access free official syllabuses, practical scripts, and high-scoring handwritten master notes. Read sample pages before unlocking, with 100% lifetime access in your student library.
          </p>

          {/* Quick Access Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 text-xs">
            <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-full font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free Official Syllabuses
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-full font-bold">
              <Star className="w-3.5 h-3.5 text-amber-400" /> Premium Handwritten Notes
            </div>
            <Link
              to="/my-courses"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 px-4 py-1.5 rounded-full font-bold transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" /> My Purchased Notes ({purchasedList.length})
            </Link>
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

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8 mb-16">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 pt-2">
        {filteredResources.map((res) => {
          const purchased = isResourcePurchased(res.id);
          const price = res.price || 49;
          const totalPages = res.totalPages || 45;

          const isLockedPremium = res.isPaid && !purchased;
          const tier: 'unlocked' | 'premium' | 'free' = purchased ? 'unlocked' : res.isPaid ? 'premium' : 'free';

          const bannerBg =
            tier === 'premium'
              ? 'bg-[linear-gradient(135deg,#4c1d95_0%,#6d28d9_45%,#9333ea_100%)]'
              : tier === 'unlocked'
              ? 'bg-[linear-gradient(135deg,#0f766e_0%,#059669_100%)]'
              : 'bg-[linear-gradient(135deg,#0d9488_0%,#10b981_100%)]';

          const iconRingColor =
            res.category === 'm2-r5' ? 'text-fuchsia-500 bg-fuchsia-50 ring-fuchsia-100' :
            res.category === 'm3-r5' ? 'text-sky-500 bg-sky-50 ring-sky-100' :
            res.category === 'm4-r5' ? 'text-orange-500 bg-orange-50 ring-orange-100' :
            res.category === 'ccc' ? 'text-rose-500 bg-rose-50 ring-rose-100' :
            'text-teal-500 bg-teal-50 ring-teal-100';

          return (
            <div
              key={res.id}
              className={`group relative flex flex-col justify-between rounded-[28px] overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1.5 ${
                tier === 'premium'
                  ? 'shadow-[0_2px_10px_rgba(109,40,217,0.12)] ring-1 ring-violet-100 hover:shadow-[0_22px_40px_-16px_rgba(109,40,217,0.35)]'
                  : 'shadow-[0_2px_10px_rgba(15,118,110,0.10)] ring-1 ring-emerald-100 hover:shadow-[0_22px_40px_-16px_rgba(5,150,105,0.28)]'
              }`}
            >
              {/* Colored banner */}
              <div className={`relative h-24 sm:h-28 px-4 sm:px-5 pt-4 ${bannerBg}`}>
                {tier === 'premium' && (
                  <div className="absolute inset-0 opacity-[0.14] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]" />
                )}
                <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10 blur-xl" />

                <div className="relative flex items-center justify-between">
                  {tier === 'unlocked' ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full ring-1 ring-white/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                    </span>
                  ) : tier === 'premium' ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide bg-white text-violet-700 px-3 py-1 rounded-full shadow-sm">
                      <Crown className="w-3.5 h-3.5 text-amber-500" /> Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full ring-1 ring-white/30">
                      <Gift className="w-3.5 h-3.5" /> Free
                    </span>
                  )}

                  <span className="text-[11px] sm:text-xs font-bold text-white/85">
                    {res.isPaid ? `${totalPages} Pages` : (res.categoryLabel || res.category || "NIELIT O Level")}
                  </span>
                </div>
              </div>

              {/* Icon medallion, overlapping banner + body */}
              <div className={`absolute right-5 top-16 sm:top-[4.7rem] w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl flex items-center justify-center ring-4 ring-white shadow-md ${iconRingColor}`}>
                {res.category === 'm2-r5' ? <Code className="w-8 h-8" /> :
                 res.category === 'm3-r5' ? <Code className="w-8 h-8" /> :
                 res.category === 'm4-r5' ? <Lightning className="w-8 h-8" /> :
                 res.category === 'ccc' ? <FileText className="w-8 h-8" /> :
                 <FileText className="w-8 h-8" />}
                {isLockedPremium && (
                  <span className="absolute -bottom-1.5 -left-1.5 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-sm ring-2 ring-white">
                    <Lock className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="px-5 sm:px-6 pt-5 pb-5 sm:pb-6 flex-1 flex flex-col">
                <div className="pr-16 sm:pr-20">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug line-clamp-3">
                    {res.title}
                  </h3>
                  {res.hindiTitle && (
                    <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-1">
                      {res.hindiTitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${tier === 'premium' ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <FileText className="w-3.5 h-3.5" />
                    {res.fileType || 'PDF'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500">
                    {res.fileSize || '850 KB'}
                  </span>
                </div>

                <div className={`flex items-center gap-2 sm:gap-3 mt-auto pt-5 border-t border-dashed ${tier === 'premium' ? 'border-violet-100' : 'border-emerald-100'}`}>
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
