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
  directPdfUrl?: string; // Direct link to open actual full PDF in browser or viewer
  previewPdfUrl?: string; // Dedicated Sample / Preview PDF URL (for paid notes preview in new window)
  tags: string[];
  createdAt?: string | number;
  updatedAt?: string | number;
  featured?: boolean;
  // Paid resource properties
  isPaid?: boolean;
  price?: number; // e.g. 49, 99
  originalPrice?: number; // e.g. 199 (strikethrough discount price)
  previewPageCount?: number; // default 2 or 3 pages visible
  totalPages?: number; // e.g. 45 pages
  previewPagesUrls?: string[]; // sample preview page image or PDF URLs
  sampleHighlights?: string[]; // Bullet points for preview
}

export interface PurchasedResource {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  resourceId: string;
  resourceTitle: string;
  category?: string;
  moduleCode?: string;
  fileType?: string;
  fileSize?: string;
  downloadUrl: string;
  directPdfUrl?: string;
  amountPaid: number;
  paymentId: string;
  orderId?: string;
  purchasedAt: number;
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
