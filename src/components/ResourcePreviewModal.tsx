import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Share2, 
  Eye, 
  BookOpen, 
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { DynamicResource } from '../types/database';
import { resourceService } from '../services/resourceService';
import { useAuth } from '../context/AuthContext';
import { openResourceRazorpayCheckout } from '../utils/razorpay';
import { StudentAuthModal } from './auth/StudentAuthModal';

interface ResourcePreviewModalProps {
  resource: DynamicResource | null;
  onClose: () => void;
  onPurchaseSuccess?: (resource: DynamicResource) => void;
}

export function ResourcePreviewModal({
  resource,
  onClose,
  onPurchaseSuccess
}: ResourcePreviewModalProps) {
  const { currentUser, userProfile } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<number>(1);

  // Check purchase status
  useEffect(() => {
    if (resource) {
      const purchased = resourceService.isResourcePurchased(
        currentUser?.uid,
        resource.id,
        currentUser?.email || undefined
      );
      setIsPurchased(purchased || !resource.isPaid);
    }
  }, [resource, currentUser]);

  // Anti-Copy, Anti-Screenshot & Print Blocking Key Listeners
  useEffect(() => {
    if (!resource) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+P, Cmd+P, Ctrl+S, Cmd+S, Ctrl+U, PrintScreen
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U' || e.key === 'c' || e.key === 'C')
      ) {
        e.preventDefault();
        return false;
      }
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resource]);

  if (!resource) return null;

  const previewPagesCount = resource.previewPageCount || 3;
  const totalPages = resource.totalPages || 45;
  const price = resource.price || 49;
  const originalPrice = resource.originalPrice || Math.round(price * 2.5);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  const directUrl = resource.directPdfUrl || resource.downloadUrl;
  const isWebUrl = directUrl && (directUrl.startsWith('http://') || directUrl.startsWith('https://'));

  const handleDownload = () => {
    resourceService.recordDownload(resource.id);
    if (directUrl && (directUrl.startsWith('http://') || directUrl.startsWith('https://') || directUrl.startsWith('/downloads/'))) {
      const link = document.createElement('a');
      link.href = directUrl;
      const downloadFileName = directUrl.startsWith('/downloads/') 
        ? directUrl.split('/').pop() || `${resource.id}.pdf`
        : `${resource.id}.pdf`;
      link.setAttribute('download', downloadFileName);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(directUrl, '_blank');
    }
  };

  const handleUnlockPayment = () => {
    if (!currentUser) {
      setAuthNotice(`Please sign in or register to unlock "${resource.title}".`);
      setIsAuthModalOpen(true);
      return;
    }

    setIsUnlocking(true);

    openResourceRazorpayCheckout({
      resource,
      studentName: userProfile?.displayName || currentUser.displayName || 'Student',
      studentEmail: currentUser.email || 'student@skilldotpy.com',
      studentPhone: userProfile?.phoneNumber || '9876543210',
      onSuccess: async (paymentId, orderId) => {
        try {
          await resourceService.purchaseResource({
            userId: currentUser.uid,
            userEmail: currentUser.email || '',
            userName: userProfile?.displayName || currentUser.displayName || 'Student',
            resource,
            amountPaid: price,
            paymentId,
            orderId
          });

          setIsPurchased(true);
          setSuccessToast(true);
          handleDownload();
          if (onPurchaseSuccess) onPurchaseSuccess(resource);
          setTimeout(() => setSuccessToast(false), 5000);
        } catch (err) {
          console.error('Failed to complete resource purchase:', err);
        } finally {
          setIsUnlocking(false);
        }
      },
      onDismiss: () => {
        setIsUnlocking(false);
      },
      onError: (err) => {
        setIsUnlocking(false);
        console.error('Payment error:', err);
      }
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: `Download verified study notes: ${resource.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Print protection style injection */}
      <style>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

      {/* Success Banner */}
      {successToast && (
        <div className="fixed top-6 right-6 z-60 animate-bounce">
          <div className="p-4 bg-emerald-600 border border-emerald-500 rounded-2xl shadow-2xl flex items-center gap-3 text-white text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <div>
              <p className="font-extrabold text-white text-sm">Notes Unlocked Successfully!</p>
              <p className="text-[11px] text-emerald-100">Saved to your My Courses library. Download started.</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-800/95 border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {resource.isPaid ? (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>PREMIUM NOTES • ₹{price}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    100% FREE PDF
                  </span>
                )}
                {resource.moduleCode && (
                  <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                    {resource.moduleCode}
                  </span>
                )}
                <span className="text-xs text-slate-400 hidden sm:inline">• {totalPages} Pages • {resource.fileSize}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-md sm:max-w-xl mt-0.5">
                {resource.title}
              </h3>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              title="Share notes"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {isPurchased || !resource.isPaid ? (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Full PDF</span>
              </button>
            ) : (
              <button
                onClick={handleUnlockPayment}
                disabled={isUnlocking}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/25 active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-950" />
                <span>Unlock (₹{price})</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Unlocked View (Full PDF Embed or Direct Viewer) */}
        {isPurchased || !resource.isPaid ? (
          <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
            {isWebUrl ? (
              <iframe
                src={directUrl}
                title={resource.title}
                className="w-full h-full border-0 bg-white"
                allow="autoplay"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold mb-2">
                    Verified Access Unlocked
                  </span>
                  <h4 className="text-xl font-black text-white">{resource.title}</h4>
                  {resource.hindiTitle && (
                    <p className="text-xs text-blue-400 mt-1">{resource.hindiTitle}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                <div className="pt-3 w-full flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Document ({resource.fileSize})</span>
                  </button>
                  {directUrl && (
                    <a
                      href={directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold px-5 py-3.5 rounded-2xl text-xs transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in Browser Tab</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Secure 2-3 Page Sample Preview with Blurred Paywall */
          <div className="flex-1 bg-slate-950 overflow-y-auto relative p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            
            {/* Watermark Overlay (Anti-Piracy) */}
            <div className="fixed inset-0 pointer-events-none z-20 flex flex-wrap items-center justify-around opacity-5 select-none overflow-hidden text-white font-black text-2xl rotate-[-25deg]">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="p-8 whitespace-nowrap">
                  SKILLDOTPY • SAMPLE PREVIEW ONLY • NOT FOR REDISTRIBUTION
                </div>
              ))}
            </div>

            <div className="w-full max-w-3xl space-y-6 relative z-10">
              
              {/* Preview Notice Pill */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    Viewing <strong>Sample Preview (Pages 1 to {previewPagesCount})</strong> of total <strong>{totalPages} Pages</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-amber-400 font-extrabold">
                    🔒 Rest of {totalPages - previewPagesCount} pages locked
                  </span>
                </div>
              </div>

              {/* Sample Document Page 1 (Cover & Overview) */}
              <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl shadow-xs">
                  Page 1 of {totalPages} (Sample)
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-700 text-xs font-black uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Skilldotpy Official NIELIT Study Notes</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {resource.title}
                  </h2>
                  {resource.hindiTitle && (
                    <p className="text-sm font-bold text-blue-600">{resource.hindiTitle}</p>
                  )}

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <p className="font-bold text-slate-900 mb-1">📘 Syllabus Scope & Course Blueprint:</p>
                    <p>{resource.description}</p>
                  </div>

                  {resource.sampleHighlights && resource.sampleHighlights.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold text-slate-900">Key Contents Included in this Document:</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        {resource.sampleHighlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Verified by NIELIT Certified Instructors</span>
                    <span>Document Code: {resource.id}</span>
                  </div>
                </div>
              </div>

              {/* Sample Document Page 2 (Core Concepts & Diagram Preview) */}
              <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl shadow-xs">
                  Page 2 of {totalPages} (Sample)
                </div>

                <div className="space-y-4 text-xs text-slate-800">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-[11px] font-extrabold uppercase text-slate-500">Chapter 1 • Quick Concept Summary</span>
                    <h3 className="text-base font-black text-slate-900 mt-0.5">
                      Fundamental Principles & Architecture
                    </h3>
                  </div>

                  <p className="leading-relaxed">
                    This chapter lays the complete structural foundation for the NIELIT examination. Key definitions, formulas, and high-frequency previous year repeated exam questions are highlighted with memory mnemonics.
                  </p>

                  {/* Mock Conceptual Visual Box */}
                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                      R5.1
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 text-xs">High-Scoring Exam Formulas & Shortcut Matrix</p>
                      <p className="text-[11px] text-slate-600">
                        Synthesized step-by-step tables designed for instant revision during exam week.
                      </p>
                    </div>
                  </div>

                  <p className="leading-relaxed text-slate-600 italic">
                    [... Continued with detailed chapter derivations, practice exercises, and 500+ objective questions with bilingual explanations ...]
                  </p>
                </div>
              </div>

              {/* Blurred Locked Section & Centered Paywall */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800">
                
                {/* Blurred Fake Document Background */}
                <div className="filter blur-md opacity-30 pointer-events-none select-none bg-white p-8 space-y-6 text-slate-900">
                  <div className="h-6 bg-slate-300 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-slate-100 rounded border border-slate-300"></div>
                    <div className="h-24 bg-slate-100 rounded border border-slate-300"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </div>

                {/* Overlaid Conversion Paywall Card */}
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
                  <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-4 shadow-2xl">
                    
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-md shadow-amber-500/10">
                      <Lock className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pages 3 to {totalPages} are Locked</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white pt-1">
                        Unlock Complete Handwritten Notes
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Get instant access to all {totalPages} pages, formula charts, solved chapter questions, and printable high-res PDF.
                      </p>
                    </div>

                    {/* Price with Discount */}
                    <div className="flex items-center justify-center gap-3 py-2">
                      <span className="text-3xl font-black text-amber-400">
                        ₹{price}
                      </span>
                      <span className="text-base text-slate-500 line-through font-bold">
                        ₹{originalPrice}
                      </span>
                      <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                        {discountPercent}% OFF
                      </span>
                    </div>

                    {/* Unlock Button */}
                    <button
                      onClick={handleUnlockPayment}
                      disabled={isUnlocking}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isUnlocking ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Processing Checkout...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-slate-950 fill-current" />
                          <span>Unlock & Download Full PDF (₹{price})</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Instant Access</span>
                      </span>
                      <span>•</span>
                      <span>UPI / Cards / QR</span>
                      <span>•</span>
                      <span>Lifetime Study Access</span>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Modal Bottom Information Footer */}
        <div className="px-4 py-2.5 bg-slate-850 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Protected Document:</span>
            <span>Skilldotpy Verified Content • Anti-Copy Protection Active</span>
          </div>
          <div className="flex items-center gap-3">
            <span>📥 {typeof resource.downloadCount === 'number' ? `${resource.downloadCount} downloads` : resource.downloadCount}</span>
            <span>•</span>
            <span className="text-slate-400">PDF Reader v2.5</span>
          </div>
        </div>

      </div>

      {/* Student Auth Modal if login is required */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectNotice={authNotice}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          // Re-trigger unlock
          setTimeout(() => handleUnlockPayment(), 300);
        }}
      />
    </div>
  );
}
