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
  Award,
  Layers,
  Maximize2
} from 'lucide-react';
import { DynamicResource } from '../types/database';
import { resourceService, formatDirectPdfUrl, formatDirectDownloadUrl } from '../services/resourceService';
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
  const [viewTab, setViewTab] = useState<'pdf' | 'details'>('pdf');
  const [showDriveHelper, setShowDriveHelper] = useState(false);

  // Check purchase status
  useEffect(() => {
    if (resource) {
      const purchased = resourceService.isResourcePurchased(
        currentUser?.uid,
        resource.id,
        currentUser?.email || undefined
      );
      setIsPurchased(purchased || !resource.isPaid);
      setViewTab('pdf');
    }
  }, [resource, currentUser]);

  // Anti-Copy & Print Blocking Key Listeners
  useEffect(() => {
    if (!resource) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+P, Cmd+P, Ctrl+S, Cmd+S, Ctrl+U, PrintScreen
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')
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

  const totalPages = resource.totalPages || 45;
  const price = resource.price || 49;
  const originalPrice = resource.originalPrice || Math.round(price * 2.5);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  // Formatted Embed & Download URLs
  const rawUrl = resource.directPdfUrl || resource.downloadUrl || '';
  const embedUrl = formatDirectPdfUrl(rawUrl);
  const directDownloadUrl = formatDirectDownloadUrl(rawUrl);
  const hasValidUrl = embedUrl && (embedUrl.startsWith('http://') || embedUrl.startsWith('https://') || embedUrl.startsWith('/downloads/'));
  const isGoogleDrive = rawUrl.includes('drive.google.com') || rawUrl.includes('docs.google.com');

  const handleDownload = () => {
    resourceService.recordDownload(resource.id);
    const targetUrl = directDownloadUrl || embedUrl || rawUrl;
    
    if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('/downloads/'))) {
      const link = document.createElement('a');
      link.href = targetUrl;
      const downloadFileName = targetUrl.startsWith('/downloads/') 
        ? targetUrl.split('/').pop() || `${resource.id}.pdf`
        : `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      link.setAttribute('download', downloadFileName);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(targetUrl, '_blank');
    }
  };

  const handleUnlockPayment = () => {
    if (!currentUser) {
      setAuthNotice(`Please sign in or register with your student account to unlock "${resource.title}".`);
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
        text: `Check out this NIELIT study material: ${resource.title}`,
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
              <p className="text-[11px] text-emerald-100">Saved to your My Courses library. Download initiated.</p>
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
                {isPurchased || !resource.isPaid ? (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{resource.isPaid ? 'UNLOCKED' : '100% FREE PDF'}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>PREMIUM NOTES • ₹{price}</span>
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

          {/* Top Actions & Tab Selector */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* View Tab Buttons */}
            <div className="hidden sm:flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-700/60 mr-2">
              <button
                onClick={() => setViewTab('pdf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewTab === 'pdf'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📄 Live PDF Viewer
              </button>
              <button
                onClick={() => setViewTab('details')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewTab === 'details'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📑 Syllabus Details
              </button>
            </div>

            <button
              onClick={handleShare}
              title="Share notes"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {hasValidUrl && (
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open PDF in new tab"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-colors hidden sm:inline-flex cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {isPurchased || !resource.isPaid ? (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            ) : (
              <button
                onClick={handleUnlockPayment}
                disabled={isUnlocking}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/25 active:scale-95 cursor-pointer"
              >
                {isUnlocking ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                )}
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

        {/* Modal Main Body */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
          
          {/* TAB 1: LIVE GOOGLE DRIVE / PDF VIEWER */}
          {viewTab === 'pdf' && (
            <div className="flex-1 flex flex-col relative w-full h-full bg-slate-950">
              
              {/* Premium Preview Notification Bar (If Paid & Not Yet Purchased) */}
              {!isPurchased && resource.isPaid && (
                <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-900 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between gap-3 text-xs shrink-0">
                  <div className="flex items-center gap-2 text-amber-200">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Sample Preview Mode:</strong> You are viewing this study material preview. Unlock full access to download the original PDF.
                    </span>
                  </div>
                  <button
                    onClick={handleUnlockPayment}
                    disabled={isUnlocking}
                    className="px-3.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shrink-0 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Lock className="w-3 h-3 text-slate-950 fill-current" />
                    <span>Unlock Full PDF • ₹{price}</span>
                  </button>
                </div>
              )}

              {/* PDF Document Embed Container */}
              {hasValidUrl ? (
                <div className="flex-1 relative w-full h-full bg-slate-900">
                  <iframe
                    src={embedUrl}
                    title={resource.title}
                    className="w-full h-full border-0 bg-white"
                    allow="autoplay; fullscreen"
                    loading="lazy"
                  />

                  {/* Anti-Piracy Watermark Overlay */}
                  <div className="absolute inset-0 pointer-events-none z-10 flex flex-wrap items-center justify-around opacity-[0.03] select-none overflow-hidden text-white font-black text-xl rotate-[-20deg]">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="p-12 whitespace-nowrap">
                        SKILLDOTPY • OFFICIAL STUDY MATERIAL • {currentUser?.email || 'STUDENT PREVIEW'}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">{resource.title}</h4>
                    {resource.hindiTitle && (
                      <p className="text-xs text-blue-400 mt-0.5">{resource.hindiTitle}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setViewTab('details')}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                    >
                      View Syllabus Highlights & Details
                    </button>
                  </div>
                </div>
              )}

              {/* Floating Bottom Paywall Bar (Only for Paid & Unpurchased) */}
              {!isPurchased && resource.isPaid && (
                <div className="p-3 sm:p-4 bg-slate-900/95 backdrop-blur-md border-t border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-20">
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-amber-400">₹{price}</span>
                      <span className="text-xs text-slate-500 line-through">₹{originalPrice}</span>
                      <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {discountPercent}% OFF
                      </span>
                    </div>
                    <div className="hidden md:block text-xs text-slate-400 border-l border-slate-700 pl-3">
                      <span>✓ High-Resolution Clean PDF</span>
                      <span className="mx-1.5">•</span>
                      <span>✓ Printable & Offline Download</span>
                      <span className="mx-1.5">•</span>
                      <span>✓ Lifetime Updates</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setViewTab('details')}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                    >
                      Syllabus Scope
                    </button>
                    <button
                      onClick={handleUnlockPayment}
                      disabled={isUnlocking}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isUnlocking ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-slate-950 fill-current" />
                          <span>Unlock & Download Full PDF (₹{price})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: DETAILED SYLLABUS & OVERVIEW */}
          {viewTab === 'details' && (
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {resource.categoryLabel || resource.category.toUpperCase()}
                      </span>
                      {resource.moduleCode && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {resource.moduleCode}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {resource.title}
                    </h2>
                    {resource.hindiTitle && (
                      <p className="text-sm font-semibold text-blue-400 mt-1">{resource.hindiTitle}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    {isPurchased || !resource.isPaid ? (
                      <span className="text-xs font-black px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                        {resource.isPaid ? 'Purchased & Active' : 'Free Access'}
                      </span>
                    ) : (
                      <div>
                        <span className="text-2xl font-black text-amber-400">₹{price}</span>
                        <span className="block text-xs text-slate-500 line-through">₹{originalPrice}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
                  <h4 className="font-bold text-white text-sm">📘 Document Scope & Description:</h4>
                  <p>{resource.description}</p>
                </div>

                {resource.sampleHighlights && resource.sampleHighlights.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                      Key Highlights Included:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {resource.sampleHighlights.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">File Format</span>
                    <span className="font-bold text-white">{resource.fileType || 'PDF'}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">File Size</span>
                    <span className="font-bold text-white">{resource.fileSize}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Content</span>
                    <span className="font-bold text-white">{totalPages} Pages</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Verification</span>
                    <span className="font-bold text-emerald-400">NIELIT Aligned</span>
                  </div>
                </div>

                {/* Bottom Action inside Details Tab */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => setViewTab('pdf')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span>Return to Live Document Reader</span>
                  </button>

                  {isPurchased || !resource.isPaid ? (
                    <button
                      onClick={handleDownload}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF Document</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleUnlockPayment}
                      disabled={isUnlocking}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-slate-950" />
                      <span>Unlock Notes (₹{price})</span>
                    </button>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Information Footer */}
        <div className="px-4 py-2 bg-slate-850 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Skilldotpy Learning Hub:</span>
            <span>Handwritten & Verified NIELIT Exam Notes</span>
          </div>
          
          <div className="flex items-center gap-3">
            {isGoogleDrive && (
              <button
                onClick={() => setShowDriveHelper(!showDriveHelper)}
                className="text-blue-400 hover:text-blue-300 underline cursor-pointer text-[10px]"
              >
                Google Drive Viewing Tip
              </button>
            )}
            <span>📥 {typeof resource.downloadCount === 'number' ? `${resource.downloadCount} downloads` : resource.downloadCount}</span>
          </div>
        </div>

        {/* Google Drive Helper Popup */}
        {showDriveHelper && (
          <div className="p-3 bg-blue-950/90 border-t border-blue-800 text-xs text-blue-200 flex items-center justify-between gap-3">
            <span>
              💡 <strong>Tip for Administrators & Students:</strong> Ensure your Google Drive PDF sharing permissions are set to <strong>"Anyone with the link can view"</strong> so all students can preview the document without login restrictions.
            </span>
            <button
              onClick={() => setShowDriveHelper(false)}
              className="text-blue-300 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

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
