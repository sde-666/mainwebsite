export interface CourseItem {
  id: string;
  title: string;
  hindiTitle?: string;
  subtitle?: string;
  overview: string;
  badge?: string; // e.g. "Full Foundation Batch", "Flagship"
  category: 'm1' | 'm2' | 'm3' | 'm4' | 'combo' | 'ccc' | 'programming';
  price: number; // in INR e.g. 499
  originalPrice: number; // in INR e.g. 1499
  thumbnailUrl: string;
  bannerUrl?: string;
  isPublished: boolean; // toggle visible/hidden
  isComingSoon?: boolean; // individual course coming soon override
  features: string[];
  learningOutcomes: string[];
  targetAudience?: string[];
  teacherName?: string;
  duration?: string; // e.g. "45+ Hours"
  language?: string; // e.g. "Hinglish (Hindi + English)"
  chaptersCount?: number;
  lecturesCount?: number;
  notesCount?: number;
  createdAt: number;
  updatedAt: number;
}

export interface CourseChapter {
  id: string;
  courseId: string;
  chapterNumber: number;
  title: string;
  hindiTitle?: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CourseLesson {
  id: string;
  courseId: string;
  chapterId: string;
  chapterNumber: number;
  lessonNumber: number;
  title: string;
  hindiTitle?: string;
  duration?: string; // e.g. "28:45"
  description?: string;
  
  // Video Content (Unlisted YouTube Video Link or ID)
  videoType: 'youtube';
  youtubeUrl: string; // e.g. "https://www.youtube.com/watch?v=..." or "https://youtu.be/..."
  videoId?: string; // extracted YouTube video ID
  
  // PDF Notes Content
  hasPdf: boolean;
  pdfTitle?: string;
  pdfUrl?: string; // Google Drive direct / Cloud URL
  pdfPages?: number;

  // Access Control: The first 2 lectures & first 2 PDFs of a course are free for everyone
  isFreePreview: boolean;
  
  createdAt: number;
  updatedAt: number;
}

export interface StudentEnrollment {
  id: string; // doc id
  userId: string;
  studentEmail: string;
  studentName?: string;
  studentPhone?: string;
  courseId: string;
  courseTitle: string;
  amountPaid: number;
  currency: string;
  paymentId: string; // Razorpay payment ID or manual txn ID
  orderId?: string;
  status: 'active' | 'cancelled' | 'refunded';
  enrolledAt: number;
}

export type CourseEnrollment = StudentEnrollment;

export interface RazorpayOrderData {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}
