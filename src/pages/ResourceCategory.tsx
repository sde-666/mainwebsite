import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Eye, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { AdBanner } from '../components/AdBanner';
import { resourceCategories } from '../data/resources';
import { resourceService } from '../services/resourceService';
import { DynamicResource, PurchasedResource } from '../types/database';
import { ResourcePreviewModal } from '../components/ResourcePreviewModal';
import { useAuth } from '../context/AuthContext';
import { openResourceRazorpayCheckout } from '../utils/razorpay';
import { StudentAuthModal } from '../components/auth/StudentAuthModal';

export function ResourceCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const normalizedCategoryId = (categoryId || '').toLowerCase().trim();
  const { currentUser, userProfile } = useAuth();

  // Find category by direct ID, or alias mappings
  const category = resourceCategories.find(c => {
    if (c.id === normalizedCategoryId) return true;
    if (normalizedCategoryId === 'm1' && c.id === 'm1-r5') return true;
    if (normalizedCategoryId === 'm2' && c.id === 'm2-r5') return true;
    if (normalizedCategoryId === 'm3' && c.id === 'm3-r5') return true;
    if (normalizedCategoryId === 'm4' && c.id === 'm4-r5') return true;
    if ((normalizedCategoryId === 'practical' || normalizedCategoryId === 'lab') && c.id === 'practicals') return true;
    if (normalizedCategoryId.includes(c.id) || c.id.includes(normalizedCategoryId)) return true;
    return false;
  });

  const [allResources, setAllResources] = useState<DynamicResource[]>([]);
  const [purchasedList, setPurchasedList] = useState<PurchasedResource[]>([]);
  const [previewingResource, setPreviewingResource] = useState<DynamicResource | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState('');
  const [pendingUnlockResource, setPendingUnlockResource] = useState<DynamicResource | null>(null);
  const [isUnlockingId, setIsUnlockingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = resourceService.subscribeResources((data) => {
      setAllResources(data);
    });
    return unsub;
  }, []);

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

  // Filter resources by category or moduleCode match
  const categoryResources = allResources.filter(r => {
    if (!normalizedCategoryId) return false;
    
    // Direct category equality
    if (r.category === normalizedCategoryId) return true;

    // Module-specific matching (m1-r5, m2-r5, m3-r5, m4-r5)
    if (normalizedCategoryId.startsWith('m1') && (r.moduleCode?.toLowerCase().includes('m1') || r.tags?.some(t => t.toLowerCase().includes('m1')))) {
      return true;
    }
    if (normalizedCategoryId.startsWith('m2') && (r.moduleCode?.toLowerCase().includes('m2') || r.tags?.some(t => t.toLowerCase().includes('m2')))) {
      return true;
    }
    if (normalizedCategoryId.startsWith('m3') && (r.moduleCode?.toLowerCase().includes('m3') || r.tags?.some(t => t.toLowerCase().includes('m3')))) {
      return true;
    }
    if (normalizedCategoryId.startsWith('m4') && (r.moduleCode?.toLowerCase().includes('m4') || r.tags?.some(t => t.toLowerCase().includes('m4')))) {
      return true;
    }
    if (normalizedCategoryId === 'practicals' || normalizedCategoryId === 'practical') {
      return r.category === 'practicals' || r.tags?.some(t => t.toLowerCase().includes('practical') || t.toLowerCase().includes('code'));
    }
    if (normalizedCategoryId === 'o-level') {
      return r.category === 'o-level' || r.categoryLabel?.toLowerCase().includes('o level');
    }
    if (normalizedCategoryId === 'ccc') {
      return r.category === 'ccc' || r.tags?.some(t => t.toLowerCase().includes('ccc'));
    }

    // Default category fallback
    return category ? r.category === category.id : false;
  });

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <Button to="/resources">Back to Resources</Button>
      </div>
    );
  }

  const handleOpenPreview = (res: DynamicResource) => {
    setPreviewingResource(res);
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

          handleDirectDownload(res);
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
    <>
      <SEO title={`${category.title} - Notes & Study Material`} description={category.description} />
      
      {/* PDF Viewer & Secure Preview Modal */}
      <ResourcePreviewModal
        resource={previewingResource}
        onClose={() => setPreviewingResource(null)}
      />

      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/resources" className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to All Resources
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {category.badge}
            </span>
            <span className="text-xs text-gray-400">{categoryResources.length} Notes Available</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{category.title}</h1>
          <p className="text-sm font-semibold text-blue-300 mt-1">{category.hindiTitle}</p>
          <p className="mt-3 text-sm text-gray-300 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categoryResources.length > 0 ? (
          <div className="space-y-4">
            {categoryResources.map((resource) => {
              const purchased = isResourcePurchased(resource.id);
              const price = resource.price || 49;
              const originalPrice = resource.originalPrice || Math.round(price * 2.5);

              return (
                <Card key={resource.id} className="hover:border-blue-300 transition-colors">
                  <CardContent className="p-5 sm:flex sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {purchased ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>UNLOCKED</span>
                          </span>
                        ) : resource.isPaid ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              <span>PREMIUM</span>
                            </span>
                            <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              ₹{price} <span className="line-through text-slate-400 font-normal text-[10px]">₹{originalPrice}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                            100% FREE
                          </span>
                        )}

                        {resource.moduleCode && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                            {resource.moduleCode}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {resource.fileType} • {resource.fileSize}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {resource.downloadCount} downloads
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900">{resource.title}</h3>
                      {resource.hindiTitle && (
                        <p className="text-xs font-medium text-blue-700 mt-0.5">{resource.hindiTitle}</p>
                      )}
                      <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">{resource.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {resource.tags?.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="sm:ml-6 shrink-0 flex items-center gap-2">
                      {purchased || !resource.isPaid ? (
                        <>
                          <button
                            onClick={() => handleOpenPreview(resource)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>View PDF</span>
                          </button>
                          <button
                            onClick={() => handleDirectDownload(resource)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Direct Download</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenPreview(resource)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-100/80 hover:bg-amber-100 text-slate-800 border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-700" />
                            <span>Preview Sample</span>
                          </button>
                          <button
                            onClick={() => handleDirectUnlock(resource)}
                            disabled={isUnlockingId === resource.id}
                            className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/25 flex items-center gap-1 cursor-pointer"
                          >
                            {isUnlockingId === resource.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-slate-950 fill-current" />
                            )}
                            <span>Unlock ₹{price}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* In-Category Sponsor Banner */}
            <div className="pt-6">
              <AdBanner slotId="category-resources-bottom" format="horizontal" fallbackType="notes" />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm mb-4">No resources currently available in this category.</p>
            <Button to="/resources" variant="outline">Browse Other Categories</Button>
          </div>
        )}
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
    </>
  );
}
