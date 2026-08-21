export type ResourceCategoryType = 'o-level' | 'ccc' | 'programming' | 'office-suite' | 'practicals';

export interface DynamicResource {
  id: string;
  category: ResourceCategoryType;
  categoryLabel: string;
  moduleCode?: string;
  title: string;
  hindiTitle?: string;
  description: string;
  fileType: 'PDF' | 'ZIP' | 'CODE' | 'SYLLABUS';
  fileSize: string;
  downloadCount: string | number;
  isOfficialSyllabus?: boolean;
  downloadUrl: string;
  directPdfUrl?: string; // Direct link to open PDF in browser or viewer
  tags: string[];
  createdAt?: string | number;
  updatedAt?: string | number;
  featured?: boolean;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  hindiQuestion?: string;
  options: string[];
  correctIndex: number; // 0, 1, 2, 3
  explanation?: string;
  marks?: number;
}

export interface DynamicQuizTest {
  id: string;
  title: string;
  hindiTitle?: string;
  module: 'm1' | 'm2' | 'm3' | 'm4' | 'ccc' | 'python' | 'web' | 'libreoffice' | 'general';
  moduleLabel: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: boolean;
  negativeMarkRatio?: number; // e.g. 0 or 0.25
  isPublished: boolean;
  questions: QuizQuestionItem[];
  createdAt?: string | number;
  updatedAt?: string | number;
  totalAttempts?: number;
}

export interface UserTestResult {
  id?: string;
  testId: string;
  testTitle: string;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  timeTakenSeconds: number;
  submittedAt: string;
  answers: { [questionId: string]: number };
}
