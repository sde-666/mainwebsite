export interface NoteCourse {
  id: string; // e.g. 'm1-r5', 'm2-r5', 'm3-r5', 'm4-r5', 'ccc'
  code: string; // 'M1-R5.1 AND CCC'
  title: string; // 'IT Tools and Network Basics'
  hindiTitle?: string;
  description: string;
  badge: string; // 'M1-R5.1'
  color: 'blue' | 'emerald' | 'amber' | 'indigo' | 'purple' | 'rose';
  order: number;
  updatedAt?: number;
}

export interface NoteChapter {
  id: string; // e.g. 'm1-ch1-intro-computer'
  courseId: string; // 'm1-r5'
  chapterNumber: number; // 1
  title: string; // 'Introduction to Computer'
  hindiTitle?: string; // 'कंप्यूटर का परिचय'
  description?: string;
  order: number;
  updatedAt?: number;
}

export interface NoteTopic {
  id: string; // e.g. 'm1-ch1-memory-systems'
  courseId: string; // 'm1-r5'
  chapterId: string; // 'm1-ch1-intro-computer'
  parentFolder?: string; // e.g. 'Memory Systems' or undefined for root-level document
  isFolderHeader?: boolean; // true if this topic acts as a parent folder title
  title: string; // 'Memory Systems'
  hindiTitle?: string; // 'कंप्यूटर मेमोरी'
  content: string; // Rich HTML/Markdown content
  readTime?: string; // '1 min read'
  views?: number; // 95
  tags?: string[];
  order: number;
  updatedAt?: number;
}
