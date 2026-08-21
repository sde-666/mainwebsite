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
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DynamicResource, ResourceCategoryType } from '../types/database';
import { resources as fallbackResources } from '../data/resources';

const RESOURCES_COLLECTION = 'resources';

// Helper to convert Google Drive or Cloud links into direct embed/preview links
export function formatDirectPdfUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Google Drive conversion
  if (trimmed.includes('drive.google.com/file/d/')) {
    const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }
  
  // Dropbox conversion
  if (trimmed.includes('dropbox.com') && trimmed.includes('dl=0')) {
    return trimmed.replace('dl=0', 'raw=1');
  }

  return trimmed;
}

// Convert fallback data to DynamicResource
const initialFallbackData: DynamicResource[] = fallbackResources.map(r => ({
  ...r,
  directPdfUrl: r.downloadUrl.startsWith('http') ? formatDirectPdfUrl(r.downloadUrl) : r.downloadUrl,
  createdAt: Date.now()
}));

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
    const docRef = await addDoc(colRef, {
      ...resource,
      directPdfUrl: resource.directPdfUrl ? formatDirectPdfUrl(resource.directPdfUrl) : (resource.downloadUrl.startsWith('http') ? formatDirectPdfUrl(resource.downloadUrl) : ''),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update resource
  updateResource: async (id: string, updates: Partial<DynamicResource>): Promise<void> => {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    const cleanUpdates = { ...updates };
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

  // Seed default notes into Firestore
  seedDefaultResources: async (): Promise<number> => {
    let count = 0;
    for (const r of initialFallbackData) {
      const docRef = doc(db, RESOURCES_COLLECTION, r.id);
      // Strip undefined values cleanly by stringifying/parsing
      const sanitizedData = JSON.parse(JSON.stringify({
        ...r,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }));
      await setDoc(docRef, sanitizedData, { merge: true });
      count++;
    }
    return count;
  }
};
