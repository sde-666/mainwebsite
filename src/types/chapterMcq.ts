export type ModuleId = 'm1-r5' | 'm2-r5' | 'm3-r5' | 'm4-r5' | 'ccc';

export interface ChapterMcqItem {
  id: string;
  moduleId: ModuleId;
  chapterNumber: number;
  chapterTitle?: string;
  question: string;
  hindiQuestion?: string;
  options: string[];
  hindiOptions?: string[];
  correctAnswer?: number;
  correctIndex?: number;
  explanation?: string;
  hindiExplanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  createdAt?: number;
  updatedAt?: number;
}

export interface ChapterMeta {
  chapterNumber: number;
  title: string;
  hindiTitle?: string;
  moduleId: ModuleId;
  description?: string;
  topics?: string[];
  mcqCount?: number;
  iconName?: string;
}

export interface PaperMeta {
  id: ModuleId;
  code: string;
  shortName: string;
  title: string;
  hindiTitle?: string;
  badgeColor: string;
  chaptersCount: number;
  totalMcqsCount: number;
}
