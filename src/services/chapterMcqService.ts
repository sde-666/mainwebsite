import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChapterMcqItem, ChapterMeta, PaperMeta } from '../types/chapterMcq';
import { initialChapterMcqSeedData, allChaptersMeta, paperMetadataList } from '../data/chapterMcqData';

const COLLECTION_NAME = 'chapter_mcqs';
const STORAGE_KEY = 'skilldotpy_chapter_mcqs_v2';
const SYNC_EVENT_NAME = 'skilldotpy_chapter_mcqs_changed';

// Helper to remove any undefined fields before sending to Firestore
function cleanForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        cleaned[key] = cleanForFirestore(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

// Helper to prevent duplicate questions based on ID or exact question text
function deduplicateMcqs(list: ChapterMcqItem[]): ChapterMcqItem[] {
  const result: ChapterMcqItem[] = [];
  const seenIds = new Set<string>();
  const seenQuestionKeys = new Set<string>();

  for (const item of list) {
    if (!item || !item.id) continue;
    const qKey = `${item.moduleId}_ch${item.chapterNumber}_${(item.question || '').trim().toLowerCase()}`;
    if (seenIds.has(item.id) || seenQuestionKeys.has(qKey)) {
      continue;
    }
    seenIds.add(item.id);
    seenQuestionKeys.add(qKey);
    result.push(item);
  }
  return result;
}

class ChapterMcqService {
  private mcqs: ChapterMcqItem[] = [];
  private isFirestoreSynced: boolean = false;
  private unsubFirestore: (() => void) | null = null;
  private subscribers: Array<(items: ChapterMcqItem[]) => void> = [];

  constructor() {
    this.initFromStorage();
    this.setupCrossTabListener();
    this.initFirestoreListener();
  }

  /**
   * Load local offline backup from browser localStorage for instant UI rendering
   */
  private initFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge seed data with stored data so no seed questions are lost
            const combined = [...parsed];
            for (const seed of initialChapterMcqSeedData) {
              if (!combined.some(c => c.id === seed.id)) {
                combined.push(seed);
              }
            }
            this.mcqs = deduplicateMcqs(combined);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to read chapter MCQs from localStorage:', err);
      }
    }
    // Default to initial seed data
    this.mcqs = [...initialChapterMcqSeedData];
  }

  /**
   * Save current cache to localStorage and notify listeners
   */
  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mcqs));
        window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
      } catch (err) {
        console.warn('Failed to write chapter MCQs to localStorage:', err);
      }
    }
    this.notifySubscribers();
  }

  /**
   * Listen to storage events across browser tabs
   */
  private setupCrossTabListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.initFromStorage();
          this.notifySubscribers();
        }
      });
      window.addEventListener(SYNC_EVENT_NAME, () => {
        this.notifySubscribers();
      });
    }
  }

  /**
   * Real-Time Firestore Synchronization across all devices
   */
  private initFirestoreListener() {
    if (this.unsubFirestore) return;

    try {
      const colRef = collection(db, COLLECTION_NAME);
      this.unsubFirestore = onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreItems: ChapterMcqItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              if (data && data.question && data.options) {
                firestoreItems.push({
                  id: docSnap.id,
                  moduleId: data.moduleId || 'm1-r5',
                  chapterNumber: Number(data.chapterNumber) || 1,
                  chapterTitle: data.chapterTitle,
                  question: data.question,
                  hindiQuestion: data.hindiQuestion,
                  options: Array.isArray(data.options) ? data.options : ['', '', '', ''],
                  hindiOptions: Array.isArray(data.hindiOptions) ? data.hindiOptions : undefined,
                  correctIndex: typeof data.correctIndex === 'number' ? data.correctIndex : 0,
                  explanation: data.explanation,
                  hindiExplanation: data.hindiExplanation,
                  difficulty: data.difficulty || 'medium',
                  tags: Array.isArray(data.tags) ? data.tags : [],
                  createdAt: data.createdAt || Date.now(),
                  updatedAt: data.updatedAt || Date.now()
                });
              }
            });

            // If Firestore has data, merge Firestore items with seed items
            // Firestore data takes precedence for edited/created questions
            const firestoreIdSet = new Set(firestoreItems.map(i => i.id));
            const merged = [...firestoreItems];

            for (const seed of initialChapterMcqSeedData) {
              if (!firestoreIdSet.has(seed.id)) {
                merged.push(seed);
              }
            }

            this.mcqs = deduplicateMcqs(merged);
            this.isFirestoreSynced = true;
            this.saveToStorage();
          } else {
            // Firestore collection is currently empty on cloud.
            // If local cache contains user questions or seed data, we keep local cache.
            this.isFirestoreSynced = true;
          }
        },
        (error) => {
          console.warn('Firestore chapter_mcqs onSnapshot listener error:', error);
        }
      );
    } catch (err) {
      console.warn('Could not initialize Firestore chapter_mcqs listener:', err);
    }
  }

  private notifySubscribers() {
    const list = [...this.mcqs];
    this.subscribers.forEach((cb) => {
      try {
        cb(list);
      } catch (err) {
        console.error('Subscriber callback error in chapterMcqService:', err);
      }
    });
  }

  /**
   * Subscribe to real-time updates for Chapter MCQs
   */
  public subscribe(callback: (items: ChapterMcqItem[]) => void): () => void {
    this.subscribers.push(callback);
    // Emit immediate current state
    callback([...this.mcqs]);
    
    // Ensure listener is active
    this.initFirestoreListener();

    return () => {
      const idx = this.subscribers.indexOf(callback);
      if (idx !== -1) {
        this.subscribers.splice(idx, 1);
      }
    };
  }

  public getAll(): ChapterMcqItem[] {
    return [...this.mcqs];
  }

  public getByChapter(moduleId: string, chapterNumber: number): ChapterMcqItem[] {
    return this.mcqs.filter(
      (item) => item.moduleId === moduleId && item.chapterNumber === chapterNumber
    );
  }

  public getByModule(moduleId: string): ChapterMcqItem[] {
    return this.mcqs.filter((item) => item.moduleId === moduleId);
  }

  public getChapterMeta(moduleId: string, chapterNumber: number): ChapterMeta | undefined {
    const meta = allChaptersMeta.find(
      (ch) => ch.moduleId === moduleId && ch.chapterNumber === chapterNumber
    );
    if (meta) {
      const currentCount = this.getByChapter(moduleId, chapterNumber).length;
      return {
        ...meta,
        mcqCount: currentCount > 0 ? currentCount : meta.mcqCount
      };
    }
    return undefined;
  }

  public getModuleChapters(moduleId: string): ChapterMeta[] {
    const chapters = allChaptersMeta.filter((ch) => ch.moduleId === moduleId);
    return chapters.map((ch) => {
      const currentCount = this.getByChapter(moduleId, ch.chapterNumber).length;
      return {
        ...ch,
        mcqCount: currentCount > 0 ? currentCount : ch.mcqCount
      };
    });
  }

  public getPaperMeta(moduleId: string): PaperMeta | undefined {
    return paperMetadataList.find((p) => p.id === moduleId);
  }

  public getAllPapers(): PaperMeta[] {
    return paperMetadataList.map((p) => {
      const moduleMcqs = this.getByModule(p.id).length;
      return {
        ...p,
        totalMcqsCount: moduleMcqs > 0 ? moduleMcqs : p.totalMcqsCount
      };
    });
  }

  /**
   * Add a single Chapter MCQ and immediately persist to Cloud Firestore & LocalStorage
   */
  public async add(item: Omit<ChapterMcqItem, 'id'>): Promise<ChapterMcqItem> {
    const newId = `mcq-${item.moduleId}-ch${item.chapterNumber}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: ChapterMcqItem = {
      ...item,
      id: newId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Update local state immediately for zero latency
    this.mcqs = [newItem, ...this.mcqs.filter(m => m.id !== newId)];
    this.saveToStorage();

    // Persist to Firebase Firestore
    try {
      const docRef = doc(db, COLLECTION_NAME, newItem.id);
      await setDoc(docRef, cleanForFirestore(newItem));
    } catch (err) {
      console.error('Failed to save MCQ to Firestore:', err);
    }

    return newItem;
  }

  /**
   * Update an existing Chapter MCQ in Cloud Firestore & LocalStorage
   */
  public async update(id: string, updates: Partial<ChapterMcqItem>): Promise<boolean> {
    const idx = this.mcqs.findIndex((item) => item.id === id);
    if (idx === -1) return false;

    const updatedItem: ChapterMcqItem = {
      ...this.mcqs[idx],
      ...updates,
      updatedAt: Date.now()
    };

    this.mcqs[idx] = updatedItem;
    this.saveToStorage();

    // Update Firestore
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await setDoc(docRef, cleanForFirestore(updatedItem), { merge: true });
      return true;
    } catch (err) {
      console.error('Failed to update MCQ in Firestore:', err);
      return true; // local update succeeded
    }
  }

  /**
   * Delete a Chapter MCQ from Cloud Firestore & LocalStorage
   */
  public async delete(id: string): Promise<boolean> {
    const before = this.mcqs.length;
    this.mcqs = this.mcqs.filter((item) => item.id !== id);
    if (this.mcqs.length !== before) {
      this.saveToStorage();
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
      } catch (err) {
        console.error('Failed to delete MCQ from Firestore:', err);
      }
      return true;
    }
    return false;
  }

  /**
   * Delete multiple Chapter MCQs by IDs in bulk from Firestore & LocalStorage
   */
  public async bulkDelete(ids: string[]): Promise<number> {
    if (!ids || ids.length === 0) return 0;
    const idSet = new Set(ids);
    const toDeleteCount = this.mcqs.filter(item => idSet.has(item.id)).length;
    
    // Remove locally
    this.mcqs = this.mcqs.filter((item) => !idSet.has(item.id));
    this.saveToStorage();

    // Remove from Firestore in batch chunks
    try {
      for (let i = 0; i < ids.length; i += 400) {
        const chunk = ids.slice(i, i + 400);
        const delBatch = writeBatch(db);
        chunk.forEach((id) => {
          delBatch.delete(doc(db, COLLECTION_NAME, id));
        });
        await delBatch.commit();
      }
    } catch (err) {
      console.error('Failed to bulk delete MCQs from Firestore:', err);
    }

    return toDeleteCount;
  }

  /**
   * Clear all MCQs for a specific module and chapter
   */
  public async clearChapter(moduleId: string, chapterNumber: number): Promise<number> {
    const targetItems = this.mcqs.filter(
      (m) => m.moduleId === moduleId && m.chapterNumber === chapterNumber
    );
    const ids = targetItems.map((m) => m.id);
    return await this.bulkDelete(ids);
  }

  /**
   * Bulk Import multiple Chapter MCQs (from CSV or batch generator) to Cloud Firestore
   */
  public async bulkImport(
    items: ChapterMcqItem[], 
    replaceChapter: boolean = false, 
    targetModule?: string, 
    targetChapter?: number
  ): Promise<number> {
    const now = Date.now();
    const formatted: ChapterMcqItem[] = items.map((item, i) => {
      const id = item.id || `mcq-${item.moduleId || targetModule || 'm1'}-ch${item.chapterNumber || targetChapter || 1}-${now}-${i}-${Math.random().toString(36).substring(2, 6)}`;
      return {
        ...item,
        id,
        moduleId: (item.moduleId || targetModule || 'm1-r5') as any,
        chapterNumber: Number(item.chapterNumber || targetChapter || 1),
        options: Array.isArray(item.options) ? item.options : ['', '', '', ''],
        correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
        createdAt: item.createdAt || now,
        updatedAt: now
      };
    });

    // Handle replace chapter locally
    let updatedList = [...this.mcqs];
    if (replaceChapter && targetModule && targetChapter !== undefined) {
      updatedList = updatedList.filter(
        (m) => !(m.moduleId === targetModule && m.chapterNumber === targetChapter)
      );
    }
    this.mcqs = [...formatted, ...updatedList];
    this.saveToStorage();

    // Persist to Firestore in batches (Firestore allows up to 500 ops per batch)
    try {
      // If replacing chapter, first delete old questions from Firestore
      if (replaceChapter && targetModule && targetChapter !== undefined) {
        const toDelete = updatedList.filter(
          (m) => m.moduleId === targetModule && m.chapterNumber === targetChapter
        );
        for (let i = 0; i < toDelete.length; i += 400) {
          const chunk = toDelete.slice(i, i + 400);
          const delBatch = writeBatch(db);
          chunk.forEach((q) => {
            delBatch.delete(doc(db, COLLECTION_NAME, q.id));
          });
          await delBatch.commit();
        }
      }

      // Write new questions in batches
      for (let i = 0; i < formatted.length; i += 400) {
        const chunk = formatted.slice(i, i + 400);
        const batch = writeBatch(db);
        chunk.forEach((item) => {
          const docRef = doc(db, COLLECTION_NAME, item.id);
          batch.set(docRef, cleanForFirestore(item), { merge: true });
        });
        await batch.commit();
      }
    } catch (err) {
      console.error('Failed to commit bulk MCQs to Firestore:', err);
    }

    return formatted.length;
  }

  /**
   * Sync all local & seed questions into Cloud Firestore so all other devices can see them
   */
  public async syncAllToCloud(): Promise<{ uploaded: number }> {
    const all = [...this.mcqs];
    let count = 0;

    for (let i = 0; i < all.length; i += 400) {
      const chunk = all.slice(i, i + 400);
      const batch = writeBatch(db);
      chunk.forEach((item) => {
        const docRef = doc(db, COLLECTION_NAME, item.id);
        batch.set(docRef, cleanForFirestore(item), { merge: true });
        count++;
      });
      await batch.commit();
    }

    return { uploaded: count };
  }

  /**
   * Reset to initial official syllabus seed questions and sync to Cloud Firestore
   */
  public async resetToSeed(): Promise<void> {
    this.mcqs = [...initialChapterMcqSeedData];
    this.saveToStorage();
    await this.syncAllToCloud();
  }
}

export const chapterMcqService = new ChapterMcqService();
export { ChapterMcqService };
export default chapterMcqService;
