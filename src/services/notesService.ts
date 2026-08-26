import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  increment,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NoteCourse, NoteChapter, NoteTopic } from '../types/notes';
import { initialNoteCourses, initialNoteChapters, initialNoteTopics } from '../data/notesData';

const COURSES_COLLECTION = 'notes_courses';
const CHAPTERS_COLLECTION = 'notes_chapters';
const TOPICS_COLLECTION = 'notes_topics';

const STORAGE_KEYS = {
  COURSES: 'skilldotpy_notes_courses_v4',
  CHAPTERS: 'skilldotpy_notes_chapters_v4',
  TOPICS: 'skilldotpy_notes_topics_v4'
};

const SYNC_EVENT_NAME = 'skilldotpy_notes_changed';

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

// Helper to prevent duplicate chapters across cloud sync & storage
function deduplicateChapters(rawList: NoteChapter[]): NoteChapter[] {
  const result: NoteChapter[] = [];
  const seenId = new Set<string>();
  const seenCourseAndNum = new Set<string>();

  // Preserve initial canonical chapters first if present
  const initialIds = new Set(initialNoteChapters.map(c => c.id));
  const sorted = [...rawList].sort((a, b) => {
    const aIsInit = initialIds.has(a.id) ? -1 : 1;
    const bIsInit = initialIds.has(b.id) ? -1 : 1;
    if (aIsInit !== bIsInit) return aIsInit - bIsInit;
    return (a.chapterNumber || a.order || 0) - (b.chapterNumber || b.order || 0);
  });

  for (const ch of sorted) {
    if (!ch || !ch.id) continue;
    const courseNumKey = `${ch.courseId || ''}_${ch.chapterNumber || 0}`;
    if (seenId.has(ch.id) || (ch.courseId && ch.chapterNumber && seenCourseAndNum.has(courseNumKey))) {
      continue;
    }
    seenId.add(ch.id);
    if (ch.courseId && ch.chapterNumber) {
      seenCourseAndNum.add(courseNumKey);
    }
    result.push(ch);
  }
  return result;
}

function deduplicateTopics(rawList: NoteTopic[]): NoteTopic[] {
  const result: NoteTopic[] = [];
  const seenId = new Set<string>();
  const seenTitle = new Set<string>();

  for (const t of rawList) {
    if (!t || !t.id) continue;
    const titleKey = `${t.courseId || ''}_${t.chapterId || ''}_${(t.title || '').trim().toLowerCase()}`;
    if (seenId.has(t.id) || (t.title && seenTitle.has(titleKey))) {
      continue;
    }
    seenId.add(t.id);
    if (t.title) {
      seenTitle.add(titleKey);
    }
    result.push(t);
  }
  return result;
}

class NotesService {
  // In-memory caches for instant UI rendering and offline fallback
  private coursesCache: NoteCourse[] = [];
  private chaptersCache: NoteChapter[] = [];
  private topicsCache: NoteTopic[] = [];

  // Active snapshot un-subscribers
  private unsubCoursesFirestore: (() => void) | null = null;
  private unsubChaptersFirestore: (() => void) | null = null;
  private unsubTopicsFirestore: (() => void) | null = null;

  // Registered UI Subscribers
  private courseSubscribers: Array<(courses: NoteCourse[]) => void> = [];
  private chapterSubscribers: Array<(chapters: NoteChapter[]) => void> = [];
  private topicSubscribers: Array<(topics: NoteTopic[]) => void> = [];

  constructor() {
    this.loadFromStorage();
    this.setupCrossTabListener();
  }

  /**
   * Load local offline backup from browser localStorage
   */
  private loadFromStorage() {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        this.coursesCache = [...initialNoteCourses];
        this.chaptersCache = [];
        this.topicsCache = [];
        return;
      }
      const storedCourses = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (storedCourses) {
        this.coursesCache = JSON.parse(storedCourses);
      } else {
        this.coursesCache = [...initialNoteCourses];
      }

      const storedChapters = localStorage.getItem(STORAGE_KEYS.CHAPTERS);
      if (storedChapters) {
        const parsed: NoteChapter[] = JSON.parse(storedChapters);
        // Merge missing initial chapters or fields like hindiTitle
        const initialMap = new Map(initialNoteChapters.map(c => [c.id, c]));
        const merged: NoteChapter[] = parsed.map(c => {
          const init = initialMap.get(c.id);
          return {
            ...init,
            ...c,
            hindiTitle: c.hindiTitle || init?.hindiTitle
          };
        });
        // Add any missing initial chapters
        for (const init of initialNoteChapters) {
          if (!merged.some(c => c.id === init.id)) {
            merged.push(init);
          }
        }
        this.chaptersCache = deduplicateChapters(merged);
      } else {
        this.chaptersCache = deduplicateChapters([...initialNoteChapters]);
      }

      const storedTopics = localStorage.getItem(STORAGE_KEYS.TOPICS);
      if (storedTopics) {
        const parsed: NoteTopic[] = JSON.parse(storedTopics);
        // Merge missing initial topics or fields like hindiTitle, hindiContent
        const initialMap = new Map(initialNoteTopics.map(t => [t.id, t]));
        const merged: NoteTopic[] = parsed.map(t => {
          const init = initialMap.get(t.id);
          return {
            ...init,
            ...t,
            hindiTitle: t.hindiTitle || init?.hindiTitle,
            hindiContent: t.hindiContent || init?.hindiContent
          };
        });
        // Add any missing initial topics
        for (const init of initialNoteTopics) {
          if (!merged.some(t => t.id === init.id)) {
            merged.push(init);
          }
        }
        this.topicsCache = deduplicateTopics(merged);
      } else {
        this.topicsCache = deduplicateTopics([...initialNoteTopics]);
      }
    } catch (err) {
      this.coursesCache = [...initialNoteCourses];
      this.chaptersCache = deduplicateChapters([...initialNoteChapters]);
      this.topicsCache = deduplicateTopics([...initialNoteTopics]);
    }
  }

  private persistStorage(type: 'courses' | 'chapters' | 'topics') {
    try {
      if (typeof window === 'undefined') return;
      if (type === 'courses') {
        localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(this.coursesCache));
      } else if (type === 'chapters') {
        localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(this.chaptersCache));
      } else if (type === 'topics') {
        localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(this.topicsCache));
      }
      window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
    } catch (err) {
      console.warn(`Error writing ${type} to localStorage:`, err);
    }
  }

  private setupCrossTabListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.COURSES || e.key === STORAGE_KEYS.CHAPTERS || e.key === STORAGE_KEYS.TOPICS) {
          this.loadFromStorage();
          this.notifyCourses();
          this.notifyChapters();
          this.notifyTopics();
        }
      });

      window.addEventListener(SYNC_EVENT_NAME, () => {
        this.notifyCourses();
        this.notifyChapters();
        this.notifyTopics();
      });
    }
  }

  private notifyCourses() {
    const list = [...this.coursesCache].sort((a, b) => (a.order || 0) - (b.order || 0));
    this.courseSubscribers.forEach(cb => cb(list));
  }

  private notifyChapters() {
    const list = [...this.chaptersCache].sort((a, b) => (a.chapterNumber || a.order || 0) - (b.chapterNumber || b.order || 0));
    this.chapterSubscribers.forEach(cb => cb(list));
  }

  private notifyTopics() {
    const list = [...this.topicsCache].sort((a, b) => (a.order || 0) - (b.order || 0));
    this.topicSubscribers.forEach(cb => cb(list));
  }

  // =========================================================================
  // 1. COURSES (Real-Time Firestore & Multi-Device Sync)
  // =========================================================================
  subscribeCourses(callback: (courses: NoteCourse[]) => void): () => void {
    this.courseSubscribers.push(callback);
    // Emit immediate cached state to avoid layout flash
    callback([...this.coursesCache].sort((a, b) => (a.order || 0) - (b.order || 0)));

    if (!this.unsubCoursesFirestore) {
      try {
        const colRef = collection(db, COURSES_COLLECTION);
        this.unsubCoursesFirestore = onSnapshot(
          colRef,
          (snapshot) => {
            if (!snapshot.empty) {
              this.coursesCache = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as NoteCourse));
            } else {
              // First time init: Seed default 5 course categories to Firestore if empty
              this.coursesCache = [...initialNoteCourses];
              this.seedInitialCourses();
            }
            this.persistStorage('courses');
            this.notifyCourses();
          },
          (error) => {
            console.warn('Firestore courses subscription fallback to local cache:', error.message);
          }
        );
      } catch (err) {
        console.warn('Could not attach Firestore courses listener:', err);
      }
    }

    return () => {
      this.courseSubscribers = this.courseSubscribers.filter(cb => cb !== callback);
      if (this.courseSubscribers.length === 0 && this.unsubCoursesFirestore) {
        this.unsubCoursesFirestore();
        this.unsubCoursesFirestore = null;
      }
    };
  }

  private async seedInitialCourses() {
    try {
      for (const c of initialNoteCourses) {
        await setDoc(doc(db, COURSES_COLLECTION, c.id), cleanForFirestore(c), { merge: true });
      }
    } catch {
      // Background seed silently handles permission limits
    }
  }

  async saveCourse(course: NoteCourse): Promise<void> {
    const updated: NoteCourse = {
      ...course,
      updatedAt: Date.now()
    };

    const idx = this.coursesCache.findIndex(c => c.id === course.id);
    if (idx >= 0) {
      this.coursesCache[idx] = updated;
    } else {
      this.coursesCache.push(updated);
    }
    this.persistStorage('courses');
    this.notifyCourses();

    try {
      const docRef = doc(db, COURSES_COLLECTION, course.id);
      await setDoc(docRef, cleanForFirestore(updated), { merge: true });
    } catch (err) {
      console.warn('Error saving course to Firestore:', err);
    }
  }

  // =========================================================================
  // 2. CHAPTERS (Real-Time Firestore & Multi-Device Sync)
  // =========================================================================
  subscribeChapters(callback: (chapters: NoteChapter[]) => void): () => void {
    this.chapterSubscribers.push(callback);
    callback([...this.chaptersCache].sort((a, b) => (a.chapterNumber || a.order || 0) - (b.chapterNumber || b.order || 0)));

    if (!this.unsubChaptersFirestore) {
      try {
        const colRef = collection(db, CHAPTERS_COLLECTION);
        this.unsubChaptersFirestore = onSnapshot(
          colRef,
          (snapshot) => {
            // Firestore is the Single Source of Truth
            const fromCloud = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as NoteChapter));
            const initialMap = new Map(initialNoteChapters.map(c => [c.id, c]));
            const merged: NoteChapter[] = fromCloud.map(c => {
              const init = initialMap.get(c.id);
              return {
                ...init,
                ...c,
                hindiTitle: c.hindiTitle || init?.hindiTitle
              };
            });
            for (const init of initialNoteChapters) {
              if (!merged.some(c => c.id === init.id)) {
                merged.push(init);
              }
            }
            this.chaptersCache = deduplicateChapters(merged.length > 0 ? merged : [...initialNoteChapters]);
            this.persistStorage('chapters');
            this.notifyChapters();
          },
          (error) => {
            console.warn('Firestore chapters subscription fallback to local cache:', error.message);
          }
        );
      } catch (err) {
        console.warn('Could not attach Firestore chapters listener:', err);
      }
    }

    return () => {
      this.chapterSubscribers = this.chapterSubscribers.filter(cb => cb !== callback);
      if (this.chapterSubscribers.length === 0 && this.unsubChaptersFirestore) {
        this.unsubChaptersFirestore();
        this.unsubChaptersFirestore = null;
      }
    };
  }

  async saveChapter(chapter: NoteChapter): Promise<void> {
    const updated: NoteChapter = {
      ...chapter,
      chapterNumber: Number(chapter.chapterNumber) || 1,
      order: Number(chapter.order) || Number(chapter.chapterNumber) || 1,
      updatedAt: Date.now()
    };

    const idx = this.chaptersCache.findIndex(c => c.id === chapter.id);
    if (idx >= 0) {
      this.chaptersCache[idx] = updated;
    } else {
      this.chaptersCache.push(updated);
    }
    this.persistStorage('chapters');
    this.notifyChapters();

    try {
      const docRef = doc(db, CHAPTERS_COLLECTION, chapter.id);
      await setDoc(docRef, cleanForFirestore(updated), { merge: true });
    } catch (err: any) {
      console.warn('Error saving chapter to Firestore:', err);
      throw new Error(err.message || 'Could not save chapter to cloud database');
    }
  }

  async deleteChapter(chapterId: string): Promise<void> {
    // 1. Optimistically update local cache
    this.chaptersCache = this.chaptersCache.filter(c => c.id !== chapterId);
    this.persistStorage('chapters');
    this.notifyChapters();

    // 2. Also remove any child topics belonging to this deleted chapter
    const topicsToDelete = this.topicsCache.filter(t => t.chapterId === chapterId);
    this.topicsCache = this.topicsCache.filter(t => t.chapterId !== chapterId);
    this.persistStorage('topics');
    this.notifyTopics();

    // 3. Delete from Firestore cloud
    try {
      await deleteDoc(doc(db, CHAPTERS_COLLECTION, chapterId));
      for (const t of topicsToDelete) {
        await deleteDoc(doc(db, TOPICS_COLLECTION, t.id)).catch(() => {});
      }
    } catch (err: any) {
      console.warn('Error deleting chapter from Firestore:', err);
      throw new Error(err.message || 'Failed to delete chapter from Firestore');
    }
  }

  // =========================================================================
  // 3. TOPICS / LECTURE NOTES (Real-Time Firestore & Multi-Device Sync)
  // =========================================================================
  subscribeTopics(callback: (topics: NoteTopic[]) => void): () => void {
    this.topicSubscribers.push(callback);
    callback([...this.topicsCache].sort((a, b) => (a.order || 0) - (b.order || 0)));

    if (!this.unsubTopicsFirestore) {
      try {
        const colRef = collection(db, TOPICS_COLLECTION);
        this.unsubTopicsFirestore = onSnapshot(
          colRef,
          (snapshot) => {
            // Firestore is the Single Source of Truth for all devices
            const fromCloud = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as NoteTopic));
            const initialMap = new Map(initialNoteTopics.map(t => [t.id, t]));
            const merged: NoteTopic[] = fromCloud.map(t => {
              const init = initialMap.get(t.id);
              return {
                ...init,
                ...t,
                hindiTitle: t.hindiTitle || init?.hindiTitle,
                hindiContent: t.hindiContent || init?.hindiContent
              };
            });
            for (const init of initialNoteTopics) {
              if (!merged.some(t => t.id === init.id)) {
                merged.push(init);
              }
            }
            this.topicsCache = deduplicateTopics(merged.length > 0 ? merged : [...initialNoteTopics]);
            this.persistStorage('topics');
            this.notifyTopics();
          },
          (error) => {
            console.warn('Firestore topics subscription fallback to local cache:', error.message);
          }
        );
      } catch (err) {
        console.warn('Could not attach Firestore topics listener:', err);
      }
    }

    return () => {
      this.topicSubscribers = this.topicSubscribers.filter(cb => cb !== callback);
      if (this.topicSubscribers.length === 0 && this.unsubTopicsFirestore) {
        this.unsubTopicsFirestore();
        this.unsubTopicsFirestore = null;
      }
    };
  }

  async saveTopic(topic: NoteTopic): Promise<void> {
    const updated: NoteTopic = {
      ...topic,
      order: Number(topic.order) || 1,
      views: topic.views || 0,
      updatedAt: Date.now()
    };

    const idx = this.topicsCache.findIndex(t => t.id === topic.id);
    if (idx >= 0) {
      this.topicsCache[idx] = updated;
    } else {
      this.topicsCache.push(updated);
    }
    this.persistStorage('topics');
    this.notifyTopics();

    try {
      const docRef = doc(db, TOPICS_COLLECTION, topic.id);
      await setDoc(docRef, cleanForFirestore(updated), { merge: true });
    } catch (err: any) {
      console.warn('Error saving note topic to Firestore:', err);
      throw new Error(err.message || 'Could not save note topic to cloud database');
    }
  }

  async deleteTopic(topicId: string): Promise<void> {
    // 1. Optimistically remove from local cache and notify all UI views
    this.topicsCache = this.topicsCache.filter(t => t.id !== topicId);
    this.persistStorage('topics');
    this.notifyTopics();

    // 2. Delete document from Firestore cloud
    try {
      await deleteDoc(doc(db, TOPICS_COLLECTION, topicId));
    } catch (err: any) {
      console.warn('Error deleting topic from Firestore:', err);
      throw new Error(err.message || 'Failed to delete note topic from Firestore');
    }
  }

  async incrementTopicViews(topicId: string): Promise<void> {
    const topic = this.topicsCache.find(t => t.id === topicId);
    if (topic) {
      topic.views = (topic.views || 0) + 1;
      this.persistStorage('topics');
    }
    try {
      const docRef = doc(db, TOPICS_COLLECTION, topicId);
      await updateDoc(docRef, {
        views: increment(1)
      });
    } catch {
      // Ignore background view increment errors
    }
  }

  // =========================================================================
  // 4. WIPE / RESET ALL CLOUD NOTES (For Starting 100% From Scratch)
  // =========================================================================
  async clearAllNotesFromCloud(): Promise<{ chaptersDeleted: number; topicsDeleted: number }> {
    let chaptersCount = 0;
    let topicsCount = 0;

    try {
      // 1. Delete all topics in Firestore
      const topicsSnap = await getDocs(collection(db, TOPICS_COLLECTION));
      for (const d of topicsSnap.docs) {
        await deleteDoc(doc(db, TOPICS_COLLECTION, d.id));
        topicsCount++;
      }

      // 2. Delete all chapters in Firestore
      const chaptersSnap = await getDocs(collection(db, CHAPTERS_COLLECTION));
      for (const d of chaptersSnap.docs) {
        await deleteDoc(doc(db, CHAPTERS_COLLECTION, d.id));
        chaptersCount++;
      }

      // 3. Clear local state
      this.chaptersCache = [];
      this.topicsCache = [];
      this.persistStorage('chapters');
      this.persistStorage('topics');
      this.notifyChapters();
      this.notifyTopics();

      return { chaptersDeleted: chaptersCount, topicsDeleted: topicsCount };
    } catch (err: any) {
      console.error('Error clearing cloud notes database:', err);
      throw new Error(err.message || 'Failed to reset cloud notes');
    }
  }
}

export const notesService = new NotesService();
