import { ChapterMcqItem, ChapterMeta, PaperMeta } from '../types/chapterMcq';
import { initialChapterMcqSeedData, allChaptersMeta, paperMetadataList } from '../data/chapterMcqData';

const STORAGE_KEY = 'skilldotpy_chapter_mcqs_v1';
const LISTENERS: Array<(items: ChapterMcqItem[]) => void> = [];

class ChapterMcqService {
  private mcqs: ChapterMcqItem[] = [];
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.mcqs = parsed;
            this.initialized = true;
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load chapter MCQs from storage:', err);
      }
    }
    // Default to seed data
    this.mcqs = [...initialChapterMcqSeedData];
    this.saveToStorage();
    this.initialized = true;
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mcqs));
      } catch (err) {
        console.error('Failed to save chapter MCQs to storage:', err);
      }
    }
    this.notifyListeners();
  }

  private notifyListeners() {
    LISTENERS.forEach((callback) => {
      try {
        callback([...this.mcqs]);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }

  public subscribe(callback: (items: ChapterMcqItem[]) => void): () => void {
    LISTENERS.push(callback);
    callback([...this.mcqs]);
    return () => {
      const idx = LISTENERS.indexOf(callback);
      if (idx !== -1) LISTENERS.splice(idx, 1);
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

  public add(item: Omit<ChapterMcqItem, 'id'>): ChapterMcqItem {
    const newItem: ChapterMcqItem = {
      ...item,
      id: `mcq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.mcqs = [newItem, ...this.mcqs];
    this.saveToStorage();
    return newItem;
  }

  public update(id: string, updates: Partial<ChapterMcqItem>): boolean {
    const idx = this.mcqs.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    this.mcqs[idx] = {
      ...this.mcqs[idx],
      ...updates,
      updatedAt: Date.now()
    };
    this.saveToStorage();
    return true;
  }

  public delete(id: string): boolean {
    const before = this.mcqs.length;
    this.mcqs = this.mcqs.filter((item) => item.id !== id);
    if (this.mcqs.length !== before) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public bulkImport(items: ChapterMcqItem[], replaceChapter: boolean = false, targetModule?: string, targetChapter?: number): number {
    if (replaceChapter && targetModule && targetChapter !== undefined) {
      this.mcqs = this.mcqs.filter(
        (m) => !(m.moduleId === targetModule && m.chapterNumber === targetChapter)
      );
    }
    
    const formatted = items.map((item, i) => ({
      ...item,
      id: item.id || `mcq-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: item.createdAt || Date.now()
    }));

    this.mcqs = [...formatted, ...this.mcqs];
    this.saveToStorage();
    return formatted.length;
  }

  public resetToSeed(): void {
    this.mcqs = [...initialChapterMcqSeedData];
    this.saveToStorage();
  }
}

export const chapterMcqService = new ChapterMcqService();
export { ChapterMcqService };
export default chapterMcqService;
