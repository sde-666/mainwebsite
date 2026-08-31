import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  increment,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DynamicResource, ResourceCategoryType, PurchasedResource } from '../types/database';
import { resources as fallbackResources } from '../data/resources';

const RESOURCES_COLLECTION = 'resources';
const RESOURCE_PURCHASES_COLLECTION = 'purchased_resources';
const LOCAL_PURCHASES_CACHE_KEY = 'skilldotpy_purchased_resources_cache';

// Helper to convert Google Drive or Cloud links into direct embed/preview links
export function formatDirectPdfUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Google Drive file link: /file/d/{ID}
  if (trimmed.includes('drive.google.com/file/d/')) {
    const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  // Google Drive open id link: drive.google.com/open?id={ID} or uc?id={ID}
  if (trimmed.includes('drive.google.com') && (trimmed.includes('id=') || trimmed.includes('/open'))) {
    const match = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  // Google Docs / Sheets / Slides
  if (trimmed.includes('docs.google.com/document/d/')) {
    const match = trimmed.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/document/d/${match[1]}/preview`;
    }
  }
  if (trimmed.includes('docs.google.com/presentation/d/')) {
    const match = trimmed.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/presentation/d/${match[1]}/embed`;
    }
  }
  if (trimmed.includes('docs.google.com/spreadsheets/d/')) {
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/spreadsheets/d/${match[1]}/preview`;
    }
  }
  
  // Dropbox conversion
  if (trimmed.includes('dropbox.com') && trimmed.includes('dl=0')) {
    return trimmed.replace('dl=0', 'raw=1');
  }

  return trimmed;
}

// Helper to convert Google Drive or Cloud links into direct download links
export function formatDirectDownloadUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Google Drive file link: /file/d/{ID}
  if (trimmed.includes('drive.google.com/file/d/')) {
    const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }

  // Google Drive open id link
  if (trimmed.includes('drive.google.com') && trimmed.includes('id=')) {
    const match = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }

  // Dropbox conversion
  if (trimmed.includes('dropbox.com') && trimmed.includes('dl=0')) {
    return trimmed.replace('dl=0', 'dl=1');
  }

  return trimmed;
}

// Helper to sanitize objects for Firestore
function cleanObject<T extends Record<string, any>>(obj: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        cleaned[key] = cleanObject(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

// Convert fallback data to DynamicResource
const initialFallbackData: DynamicResource[] = fallbackResources.map(r => ({
  ...r,
  directPdfUrl: r.downloadUrl.startsWith('http') ? formatDirectPdfUrl(r.downloadUrl) : r.downloadUrl,
  createdAt: Date.now()
}));

// In-memory purchases state
let inMemoryPurchases: PurchasedResource[] = [];
try {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_PURCHASES_CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) inMemoryPurchases = parsed;
    }
  }
} catch {
  // Ignore local storage error
}

export const resourceService = {
  // Subscribe to real-time resources with fallback
  subscribeResources: (callback: (resources: DynamicResource[]) => void) => {
    try {
      const colRef = collection(db, RESOURCES_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: DynamicResource[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as DynamicResource);
          });
          callback(list);
        } else {
          // If Firestore is empty, use initial fallback
          callback(initialFallbackData);
        }
      }, (error) => {
        console.warn('Firestore subscription fallback triggered:', error);
        callback(initialFallbackData);
      });
    } catch (err) {
      console.warn('Error subscribing to resources:', err);
      callback(initialFallbackData);
      return () => {};
    }
  },

  // Get all resources once
  getAllResources: async (): Promise<DynamicResource[]> => {
    try {
      const colRef = collection(db, RESOURCES_COLLECTION);
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DynamicResource));
      }
      return initialFallbackData;
    } catch (e) {
      console.warn('Failed to fetch resources from Firestore, returning local data:', e);
      return initialFallbackData;
    }
  },

  // Create a new resource
  createResource: async (resource: Omit<DynamicResource, 'id'>): Promise<string> => {
    const colRef = collection(db, RESOURCES_COLLECTION);
    const dataToSave = cleanObject({
      ...resource,
      isPaid: Boolean(resource.isPaid),
      price: resource.price ? Number(resource.price) : 0,
      originalPrice: resource.originalPrice ? Number(resource.originalPrice) : 0,
      previewPageCount: resource.previewPageCount ? Number(resource.previewPageCount) : 3,
      totalPages: resource.totalPages ? Number(resource.totalPages) : 30,
      directPdfUrl: resource.directPdfUrl ? formatDirectPdfUrl(resource.directPdfUrl) : (resource.downloadUrl.startsWith('http') ? formatDirectPdfUrl(resource.downloadUrl) : ''),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    const docRef = await addDoc(colRef, dataToSave);
    return docRef.id;
  },

  // Update resource
  updateResource: async (id: string, updates: Partial<DynamicResource>): Promise<void> => {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    const cleanUpdates = cleanObject({ ...updates });
    if (cleanUpdates.directPdfUrl) {
      cleanUpdates.directPdfUrl = formatDirectPdfUrl(cleanUpdates.directPdfUrl);
    } else if (cleanUpdates.downloadUrl && cleanUpdates.downloadUrl.startsWith('http')) {
      cleanUpdates.directPdfUrl = formatDirectPdfUrl(cleanUpdates.downloadUrl);
    }
    cleanUpdates.updatedAt = serverTimestamp() as any;
    await setDoc(docRef, cleanUpdates, { merge: true });
  },

  // Delete resource
  deleteResource: async (id: string): Promise<void> => {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Increment download counter
  recordDownload: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, RESOURCES_COLLECTION, id);
      await updateDoc(docRef, {
        downloadCount: increment(1)
      });
    } catch {
      // Non-blocking
    }
  },

  // Check if a specific resource is purchased by the user
  isResourcePurchased: (userId?: string, resourceId?: string, userEmail?: string): boolean => {
    if (!resourceId) return false;
    if (!userId && !userEmail) return false;

    return inMemoryPurchases.some(p => {
      const matchRes = p.resourceId === resourceId;
      const matchUser = (userId && p.userId === userId) || 
                        (userEmail && p.userEmail && p.userEmail.toLowerCase() === userEmail.toLowerCase());
      return matchRes && matchUser;
    });
  },

  // Record a resource purchase
  purchaseResource: async (data: {
    userId: string;
    userEmail: string;
    userName: string;
    resource: DynamicResource;
    amountPaid: number;
    paymentId: string;
    orderId?: string;
  }): Promise<PurchasedResource> => {
    const purchaseId = `res_purchase_${data.userId}_${data.resource.id}_${Date.now()}`;
    const purchase: PurchasedResource = {
      id: purchaseId,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      resourceId: data.resource.id,
      resourceTitle: data.resource.title,
      category: data.resource.category,
      moduleCode: data.resource.moduleCode,
      fileType: data.resource.fileType,
      fileSize: data.resource.fileSize,
      downloadUrl: data.resource.downloadUrl,
      directPdfUrl: data.resource.directPdfUrl,
      amountPaid: data.amountPaid,
      paymentId: data.paymentId,
      orderId: data.orderId || '',
      purchasedAt: Date.now()
    };

    // Update in-memory & localStorage
    inMemoryPurchases = [purchase, ...inMemoryPurchases.filter(p => !(p.userId === data.userId && p.resourceId === data.resource.id))];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_PURCHASES_CACHE_KEY, JSON.stringify(inMemoryPurchases));
      } catch (e) {
        console.warn('Failed to save purchase to localStorage:', e);
      }
    }

    // Persist to Firestore
    try {
      const docRef = doc(db, RESOURCE_PURCHASES_COLLECTION, purchaseId);
      await setDoc(docRef, cleanObject(purchase));
    } catch (err) {
      console.warn('Failed to write purchased resource to Firestore (cached locally):', err);
    }

    return purchase;
  },

  // Subscribe to user's purchased resources
  subscribePurchasedResources: (
    userId: string | undefined,
    userEmail: string | undefined,
    callback: (purchases: PurchasedResource[]) => void
  ) => {
    // Initial emit from local memory
    if (userId || userEmail) {
      const filtered = inMemoryPurchases.filter(
        p => (userId && p.userId === userId) || (userEmail && p.userEmail.toLowerCase() === userEmail.toLowerCase())
      );
      callback(filtered);
    } else {
      callback([]);
    }

    if (!userId && !userEmail) {
      return () => {};
    }

    try {
      const colRef = collection(db, RESOURCE_PURCHASES_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: PurchasedResource[] = [];
          snapshot.forEach((docSnap) => {
            const item = { id: docSnap.id, ...docSnap.data() } as PurchasedResource;
            if (
              (userId && item.userId === userId) ||
              (userEmail && item.userEmail && item.userEmail.toLowerCase() === userEmail.toLowerCase())
            ) {
              list.push(item);
            }
          });

          // Merge with inMemoryPurchases to keep sync
          const existingIds = new Set(list.map(l => l.id));
          inMemoryPurchases.forEach(p => {
            if (!existingIds.has(p.id)) list.push(p);
          });

          inMemoryPurchases = list;
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(LOCAL_PURCHASES_CACHE_KEY, JSON.stringify(inMemoryPurchases));
            } catch {}
          }

          callback(list);
        }
      }, (error) => {
        console.warn('Purchased resources snapshot fallback:', error);
      });
    } catch (e) {
      console.warn('Error subscribing to purchased resources:', e);
      return () => {};
    }
  },

  // Seed default notes into Firestore
  seedDefaultResources: async (): Promise<number> => {
    let count = 0;
    for (const r of initialFallbackData) {
      const docRef = doc(db, RESOURCES_COLLECTION, r.id);
      const sanitizedData = cleanObject({
        ...r,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      await setDoc(docRef, sanitizedData, { merge: true });
      count++;
    }
    return count;
  }
};

