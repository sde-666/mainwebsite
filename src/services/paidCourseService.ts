import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CourseItem, CourseChapter, CourseLesson, StudentEnrollment } from '../types/paidCourse';
import { 
  initialPaidCoursesSeed, 
  initialPaidChaptersSeed, 
  initialPaidLessonsSeed 
} from '../data/paidCoursesSeedData';

const COURSES_COL = 'paid_courses';
const CHAPTERS_COL = 'paid_course_chapters';
const LESSONS_COL = 'paid_course_lessons';
const ENROLLMENTS_COL = 'paid_course_enrollments';
const SETTINGS_COL = 'app_settings';

const LOCAL_COURSES_KEY = 'skilldotpy_paid_courses_cache';
const LOCAL_CHAPTERS_KEY = 'skilldotpy_paid_chapters_cache';
const LOCAL_LESSONS_KEY = 'skilldotpy_paid_lessons_cache';
const LOCAL_ENROLLMENTS_KEY = 'skilldotpy_paid_enrollments_cache';
const LOCAL_COMING_SOON_KEY = 'skilldotpy_paid_courses_coming_soon';

// Helper to extract YouTube video ID from various YouTube URL formats
export function extractYouTubeVideoId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  
  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Match youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);
  return (match && match[1]) ? match[1] : trimmed;
}

// Clean undefined fields before Firestore write
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

class PaidCourseService {
  private courses: CourseItem[] = [];
  private chapters: CourseChapter[] = [];
  private lessons: CourseLesson[] = [];
  private enrollments: StudentEnrollment[] = [];
  private isComingSoonMode: boolean = false;

  private courseSubscribers: Array<(items: CourseItem[]) => void> = [];
  private chapterSubscribers: Array<(items: CourseChapter[]) => void> = [];
  private lessonSubscribers: Array<(items: CourseLesson[]) => void> = [];
  private enrollmentSubscribers: Array<(items: StudentEnrollment[]) => void> = [];
  private comingSoonSubscribers: Array<(isComingSoon: boolean) => void> = [];

  private unsubFirestore: Array<() => void> = [];

  constructor() {
    this.initFromLocalStorage();
    this.setupFirestoreListeners();
  }

  /**
   * Load cache from browser localStorage for instant UI rendering
   */
  private initFromLocalStorage() {
    if (typeof window !== 'undefined') {
      try {
        const storedComingSoon = localStorage.getItem(LOCAL_COMING_SOON_KEY);
        if (storedComingSoon !== null) {
          this.isComingSoonMode = storedComingSoon === 'true';
        }

        const storedCourses = localStorage.getItem(LOCAL_COURSES_KEY);
        if (storedCourses) {
          const parsed = JSON.parse(storedCourses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.courses = parsed;
          }
        }
        if (this.courses.length === 0) {
          this.courses = [...initialPaidCoursesSeed];
        }

        const storedChapters = localStorage.getItem(LOCAL_CHAPTERS_KEY);
        if (storedChapters) {
          const parsed = JSON.parse(storedChapters);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.chapters = parsed;
          }
        }
        if (this.chapters.length === 0) {
          this.chapters = [...initialPaidChaptersSeed];
        }

        const storedLessons = localStorage.getItem(LOCAL_LESSONS_KEY);
        if (storedLessons) {
          const parsed = JSON.parse(storedLessons);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.lessons = parsed;
          }
        }
        if (this.lessons.length === 0) {
          this.lessons = [...initialPaidLessonsSeed];
        }

        const storedEnrollments = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
        if (storedEnrollments) {
          const parsed = JSON.parse(storedEnrollments);
          if (Array.isArray(parsed)) {
            this.enrollments = parsed;
          }
        }
      } catch (err) {
        console.warn('Failed to load paid course local cache:', err);
      }
    }
  }

  private saveComingSoonToLocal() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_COMING_SOON_KEY, String(this.isComingSoonMode));
      } catch (e) {}
    }
    this.comingSoonSubscribers.forEach(cb => cb(this.isComingSoonMode));
  }

  private saveCoursesToLocal() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(this.courses));
      } catch (e) {}
    }
    this.courseSubscribers.forEach(cb => cb([...this.courses]));
  }

  private saveChaptersToLocal() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_CHAPTERS_KEY, JSON.stringify(this.chapters));
      } catch (e) {}
    }
    this.chapterSubscribers.forEach(cb => cb([...this.chapters]));
  }

  private saveLessonsToLocal() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_LESSONS_KEY, JSON.stringify(this.lessons));
      } catch (e) {}
    }
    this.lessonSubscribers.forEach(cb => cb([...this.lessons]));
  }

  private saveEnrollmentsToLocal() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(this.enrollments));
      } catch (e) {}
    }
    this.enrollmentSubscribers.forEach(cb => cb([...this.enrollments]));
  }

  /**
   * Real-time listeners for all Firebase collections
   */
  private setupFirestoreListeners() {
    try {
      // 1. Courses Listener
      const unsubCourses = onSnapshot(collection(db, COURSES_COL), (snap) => {
        if (!snap.empty) {
          const cloudCourses: CourseItem[] = [];
          snap.forEach(docSnap => {
            const data = docSnap.data();
            cloudCourses.push({
              id: docSnap.id,
              title: data.title || '',
              hindiTitle: data.hindiTitle,
              subtitle: data.subtitle,
              overview: data.overview || '',
              badge: data.badge,
              category: data.category || 'm1',
              price: Number(data.price) || 0,
              originalPrice: Number(data.originalPrice) || 0,
              thumbnailUrl: data.thumbnailUrl || '',
              bannerUrl: data.bannerUrl,
              isPublished: data.isPublished !== undefined ? data.isPublished : true,
              isComingSoon: Boolean(data.isComingSoon),
              features: Array.isArray(data.features) ? data.features : [],
              learningOutcomes: Array.isArray(data.learningOutcomes) ? data.learningOutcomes : [],
              targetAudience: Array.isArray(data.targetAudience) ? data.targetAudience : [],
              teacherName: data.teacherName || 'Er. Aditya Pathak',
              duration: data.duration,
              language: data.language,
              chaptersCount: data.chaptersCount,
              lecturesCount: data.lecturesCount,
              notesCount: data.notesCount,
              createdAt: data.createdAt || Date.now(),
              updatedAt: data.updatedAt || Date.now()
            });
          });

          // Merge cloud courses with seed data so defaults are available until synced
          const cloudIds = new Set(cloudCourses.map(c => c.id));
          const merged = [...cloudCourses];
          for (const seed of initialPaidCoursesSeed) {
            if (!cloudIds.has(seed.id)) {
              merged.push(seed);
            }
          }

          this.courses = merged;
          this.saveCoursesToLocal();
        }
      }, (err) => console.warn('Courses listener warning:', err));

      // 2. Chapters Listener
      const unsubChapters = onSnapshot(collection(db, CHAPTERS_COL), (snap) => {
        if (!snap.empty) {
          const cloudChapters: CourseChapter[] = [];
          snap.forEach(docSnap => {
            const data = docSnap.data();
            cloudChapters.push({
              id: docSnap.id,
              courseId: data.courseId || '',
              chapterNumber: Number(data.chapterNumber) || 1,
              title: data.title || '',
              hindiTitle: data.hindiTitle,
              description: data.description,
              createdAt: data.createdAt || Date.now(),
              updatedAt: data.updatedAt || Date.now()
            });
          });

          const cloudIds = new Set(cloudChapters.map(c => c.id));
          const merged = [...cloudChapters];
          for (const seed of initialPaidChaptersSeed) {
            if (!cloudIds.has(seed.id)) {
              merged.push(seed);
            }
          }

          this.chapters = merged;
          this.saveChaptersToLocal();
        }
      }, (err) => console.warn('Chapters listener warning:', err));

      // 3. Lessons Listener
      const unsubLessons = onSnapshot(collection(db, LESSONS_COL), (snap) => {
        if (!snap.empty) {
          const cloudLessons: CourseLesson[] = [];
          snap.forEach(docSnap => {
            const data = docSnap.data();
            cloudLessons.push({
              id: docSnap.id,
              courseId: data.courseId || '',
              chapterId: data.chapterId || '',
              chapterNumber: Number(data.chapterNumber) || 1,
              lessonNumber: Number(data.lessonNumber) || 1,
              title: data.title || '',
              hindiTitle: data.hindiTitle,
              duration: data.duration || '25:00',
              videoType: 'youtube',
              youtubeUrl: data.youtubeUrl || '',
              videoId: data.videoId || extractYouTubeVideoId(data.youtubeUrl || ''),
              hasPdf: Boolean(data.hasPdf),
              pdfTitle: data.pdfTitle,
              pdfUrl: data.pdfUrl,
              pdfPages: Number(data.pdfPages) || 10,
              isFreePreview: Boolean(data.isFreePreview),
              createdAt: data.createdAt || Date.now(),
              updatedAt: data.updatedAt || Date.now()
            });
          });

          const cloudIds = new Set(cloudLessons.map(l => l.id));
          const merged = [...cloudLessons];
          for (const seed of initialPaidLessonsSeed) {
            if (!cloudIds.has(seed.id)) {
              merged.push(seed);
            }
          }

          this.lessons = merged;
          this.saveLessonsToLocal();
        }
      }, (err) => console.warn('Lessons listener warning:', err));

      // 4. Enrollments Listener
      const unsubEnrollments = onSnapshot(collection(db, ENROLLMENTS_COL), (snap) => {
        if (!snap.empty) {
          const list: StudentEnrollment[] = [];
          snap.forEach(docSnap => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              userId: data.userId || '',
              studentEmail: data.studentEmail || '',
              studentName: data.studentName,
              studentPhone: data.studentPhone,
              courseId: data.courseId || '',
              courseTitle: data.courseTitle || '',
              amountPaid: Number(data.amountPaid) || 0,
              currency: data.currency || 'INR',
              paymentId: data.paymentId || '',
              orderId: data.orderId,
              status: data.status || 'active',
              enrolledAt: data.enrolledAt || Date.now()
            });
          });
          this.enrollments = list;
          this.saveEnrollmentsToLocal();
        }
      }, (err) => console.warn('Enrollments listener warning:', err));

      // 5. Settings / Coming Soon Listener (Global switch)
      const unsubSettings = onSnapshot(doc(db, SETTINGS_COL, 'paid_courses_config'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && typeof data.isComingSoon === 'boolean') {
            this.isComingSoonMode = data.isComingSoon;
            this.saveComingSoonToLocal();
          }
        }
      }, (err) => console.warn('Settings listener warning:', err));

      this.unsubFirestore = [unsubCourses, unsubChapters, unsubLessons, unsubEnrollments, unsubSettings];
    } catch (err) {
      console.warn('Could not initialize Paid Courses listeners:', err);
    }
  }

  // ================= SUBSCRIPTIONS =================

  public subscribeComingSoon(cb: (isComingSoon: boolean) => void): () => void {
    this.comingSoonSubscribers.push(cb);
    cb(this.isComingSoonMode);
    return () => {
      this.comingSoonSubscribers = this.comingSoonSubscribers.filter(c => c !== cb);
    };
  }

  public getIsComingSoon(): boolean {
    return this.isComingSoonMode;
  }

  public async setComingSoonMode(enabled: boolean): Promise<boolean> {
    this.isComingSoonMode = enabled;
    this.saveComingSoonToLocal();

    try {
      const docRef = doc(db, SETTINGS_COL, 'paid_courses_config');
      await setDoc(docRef, { isComingSoon: enabled, updatedAt: Date.now() }, { merge: true });
    } catch (err) {
      console.error('Failed to save coming-soon state to Firestore:', err);
    }

    return enabled;
  }

  public subscribeCourses(cb: (items: CourseItem[]) => void): () => void {
    this.courseSubscribers.push(cb);
    cb([...this.courses]);
    return () => {
      this.courseSubscribers = this.courseSubscribers.filter(c => c !== cb);
    };
  }

  public subscribeChapters(cb: (items: CourseChapter[]) => void): () => void {
    this.chapterSubscribers.push(cb);
    cb([...this.chapters]);
    return () => {
      this.chapterSubscribers = this.chapterSubscribers.filter(c => c !== cb);
    };
  }

  public subscribeLessons(cb: (items: CourseLesson[]) => void): () => void {
    this.lessonSubscribers.push(cb);
    cb([...this.lessons]);
    return () => {
      this.lessonSubscribers = this.lessonSubscribers.filter(c => c !== cb);
    };
  }

  public subscribeEnrollments(cb: (items: StudentEnrollment[]) => void): () => void {
    this.enrollmentSubscribers.push(cb);
    cb([...this.enrollments]);
    return () => {
      this.enrollmentSubscribers = this.enrollmentSubscribers.filter(c => c !== cb);
    };
  }

  // ================= GETTERS =================

  public getAllCourses(includeHidden = false): CourseItem[] {
    if (includeHidden) return [...this.courses];
    return this.courses.filter(c => c.isPublished);
  }

  public getCourseById(courseId: string): CourseItem | undefined {
    return this.courses.find(c => c.id === courseId);
  }

  public getChaptersByCourse(courseId: string): CourseChapter[] {
    return this.chapters
      .filter(ch => ch.courseId === courseId)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }

  public getLessonsByCourse(courseId: string): CourseLesson[] {
    return this.lessons
      .filter(l => l.courseId === courseId)
      .sort((a, b) => {
        if (a.chapterNumber !== b.chapterNumber) {
          return a.chapterNumber - b.chapterNumber;
        }
        return a.lessonNumber - b.lessonNumber;
      });
  }

  public isUserEnrolled(userId: string | undefined | null, courseId: string, userEmail?: string | null): boolean {
    if (!userId && !userEmail) return false;
    const targetUserId = userId || '';
    const targetEmail = (userEmail || userId || '').toLowerCase().trim();
    return this.enrollments.some(e => {
      if (e.courseId !== courseId) return false;
      if (targetUserId && e.userId === targetUserId) return true;
      if (targetEmail && e.studentEmail && e.studentEmail.toLowerCase() === targetEmail) return true;
      return false;
    });
  }

  public isStudentEnrolled(userIdOrEmail: string, courseId: string): boolean {
    return this.isUserEnrolled(userIdOrEmail, courseId, userIdOrEmail);
  }

  public getEnrolledCoursesForStudent(userIdOrEmail: string): CourseItem[] {
    if (!userIdOrEmail) return [];
    const lower = userIdOrEmail.toLowerCase().trim();
    const enrolledCourseIds = new Set(
      this.enrollments
        .filter(e => e.userId === userIdOrEmail || (e.studentEmail && e.studentEmail.toLowerCase() === lower))
        .map(e => e.courseId)
    );
    return this.courses.filter(c => enrolledCourseIds.has(c.id));
  }

  // ================= ADMIN COURSE MUTATIONS =================

  public async saveCourse(course: Partial<CourseItem>): Promise<CourseItem> {
    const id = course.id || `course-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullItem: CourseItem = {
      id,
      title: course.title || 'Untitled Course',
      hindiTitle: course.hindiTitle || '',
      subtitle: course.subtitle || '',
      overview: course.overview || '',
      badge: course.badge || '',
      category: course.category || 'm1',
      price: Number(course.price) || 0,
      originalPrice: Number(course.originalPrice) || 0,
      thumbnailUrl: course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
      bannerUrl: course.bannerUrl || course.thumbnailUrl,
      isPublished: course.isPublished !== undefined ? course.isPublished : true,
      isComingSoon: Boolean(course.isComingSoon),
      features: Array.isArray(course.features) ? course.features : [],
      learningOutcomes: Array.isArray(course.learningOutcomes) ? course.learningOutcomes : [],
      targetAudience: Array.isArray(course.targetAudience) ? course.targetAudience : [],
      teacherName: course.teacherName || 'Er. Aditya Pathak',
      duration: course.duration || '25+ Hours',
      language: course.language || 'Hinglish (Hindi + English)',
      chaptersCount: course.chaptersCount,
      lecturesCount: course.lecturesCount,
      notesCount: course.notesCount,
      createdAt: course.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    // Update locally
    const idx = this.courses.findIndex(c => c.id === id);
    if (idx >= 0) {
      this.courses[idx] = fullItem;
    } else {
      this.courses.unshift(fullItem);
    }
    this.saveCoursesToLocal();

    // Persist to Cloud Firestore
    try {
      const docRef = doc(db, COURSES_COL, id);
      await setDoc(docRef, cleanObject(fullItem), { merge: true });
    } catch (err) {
      console.error('Failed to write course to Firestore:', err);
    }

    return fullItem;
  }

  public async toggleCourseVisibility(courseId: string): Promise<boolean> {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return false;
    const newStatus = !course.isPublished;
    course.isPublished = newStatus;
    course.updatedAt = Date.now();
    this.saveCoursesToLocal();

    try {
      const docRef = doc(db, COURSES_COL, courseId);
      await setDoc(docRef, { isPublished: newStatus, updatedAt: Date.now() }, { merge: true });
      return true;
    } catch (err) {
      console.error('Failed to update course visibility in Firestore:', err);
      return true;
    }
  }

  public async toggleCourseComingSoon(courseId: string): Promise<boolean> {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return false;
    const newStatus = !course.isComingSoon;
    course.isComingSoon = newStatus;
    course.updatedAt = Date.now();
    this.saveCoursesToLocal();

    try {
      const docRef = doc(db, COURSES_COL, courseId);
      await setDoc(docRef, { isComingSoon: newStatus, updatedAt: Date.now() }, { merge: true });
      return true;
    } catch (err) {
      console.error('Failed to update course coming soon in Firestore:', err);
      return true;
    }
  }

  public async deleteCourse(courseId: string): Promise<boolean> {
    this.courses = this.courses.filter(c => c.id !== courseId);
    this.saveCoursesToLocal();

    try {
      await deleteDoc(doc(db, COURSES_COL, courseId));
      return true;
    } catch (err) {
      console.error('Failed to delete course from Firestore:', err);
      return true;
    }
  }

  // ================= ADMIN CHAPTER MUTATIONS =================

  public async saveChapter(chapter: Partial<CourseChapter>): Promise<CourseChapter> {
    const id = chapter.id || `ch-${chapter.courseId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullChapter: CourseChapter = {
      id,
      courseId: chapter.courseId || '',
      chapterNumber: Number(chapter.chapterNumber) || 1,
      title: chapter.title || 'Untitled Chapter',
      hindiTitle: chapter.hindiTitle || '',
      description: chapter.description || '',
      createdAt: chapter.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    const idx = this.chapters.findIndex(c => c.id === id);
    if (idx >= 0) {
      this.chapters[idx] = fullChapter;
    } else {
      this.chapters.push(fullChapter);
    }
    this.saveChaptersToLocal();

    try {
      const docRef = doc(db, CHAPTERS_COL, id);
      await setDoc(docRef, cleanObject(fullChapter), { merge: true });
    } catch (err) {
      console.error('Failed to write chapter to Firestore:', err);
    }

    return fullChapter;
  }

  public async deleteChapter(chapterId: string): Promise<boolean> {
    this.chapters = this.chapters.filter(c => c.id !== chapterId);
    // Also delete associated lessons
    this.lessons = this.lessons.filter(l => l.chapterId !== chapterId);
    this.saveChaptersToLocal();
    this.saveLessonsToLocal();

    try {
      await deleteDoc(doc(db, CHAPTERS_COL, chapterId));
      return true;
    } catch (err) {
      console.error('Failed to delete chapter from Firestore:', err);
      return true;
    }
  }

  // ================= ADMIN LESSON MUTATIONS =================

  public async saveLesson(lesson: Partial<CourseLesson>): Promise<CourseLesson> {
    const id = lesson.id || `les-${lesson.courseId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const ytUrl = lesson.youtubeUrl || '';
    const videoId = extractYouTubeVideoId(ytUrl);

    const fullLesson: CourseLesson = {
      id,
      courseId: lesson.courseId || '',
      chapterId: lesson.chapterId || '',
      chapterNumber: Number(lesson.chapterNumber) || 1,
      lessonNumber: Number(lesson.lessonNumber) || 1,
      title: lesson.title || 'Untitled Lesson',
      hindiTitle: lesson.hindiTitle || '',
      duration: lesson.duration || '25:00',
      videoType: 'youtube',
      youtubeUrl: ytUrl,
      videoId,
      hasPdf: Boolean(lesson.hasPdf),
      pdfTitle: lesson.pdfTitle || '',
      pdfUrl: lesson.pdfUrl || '',
      pdfPages: Number(lesson.pdfPages) || 10,
      isFreePreview: Boolean(lesson.isFreePreview),
      createdAt: lesson.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    const idx = this.lessons.findIndex(l => l.id === id);
    if (idx >= 0) {
      this.lessons[idx] = fullLesson;
    } else {
      this.lessons.push(fullLesson);
    }
    this.saveLessonsToLocal();

    try {
      const docRef = doc(db, LESSONS_COL, id);
      await setDoc(docRef, cleanObject(fullLesson), { merge: true });
    } catch (err) {
      console.error('Failed to write lesson to Firestore:', err);
    }

    return fullLesson;
  }

  public async deleteLesson(lessonId: string): Promise<boolean> {
    this.lessons = this.lessons.filter(l => l.id !== lessonId);
    this.saveLessonsToLocal();

    try {
      await deleteDoc(doc(db, LESSONS_COL, lessonId));
      return true;
    } catch (err) {
      console.error('Failed to delete lesson from Firestore:', err);
      return true;
    }
  }

  // ================= ENROLLMENT & PAYMENT (Firebase-First) =================

  public async enrollStudent(data: {
    userId: string;
    studentEmail: string;
    studentName?: string;
    studentPhone?: string;
    courseId: string;
    courseTitle: string;
    amountPaid: number;
    paymentId: string;
    orderId?: string;
  }): Promise<StudentEnrollment> {
    const id = `enroll-${data.userId}-${data.courseId}-${Date.now()}`;
    const enrollment: StudentEnrollment = {
      id,
      userId: data.userId,
      studentEmail: data.studentEmail,
      studentName: data.studentName || '',
      studentPhone: data.studentPhone || '',
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      amountPaid: data.amountPaid,
      currency: 'INR',
      paymentId: data.paymentId,
      orderId: data.orderId || '',
      status: 'active',
      enrolledAt: Date.now()
    };

    // Update local state immediately
    this.enrollments.unshift(enrollment);
    this.saveEnrollmentsToLocal();

    // Persist to Firebase Firestore
    try {
      const docRef = doc(db, ENROLLMENTS_COL, id);
      await setDoc(docRef, cleanObject(enrollment));
    } catch (err) {
      console.error('Failed to save enrollment to Firestore:', err);
    }

    return enrollment;
  }

  /**
   * Admin can grant manual access to any student by email
   */
  public async grantManualAccess(
    email: string, 
    courseId: string, 
    studentName = 'Manual Student'
  ): Promise<StudentEnrollment> {
    const course = this.getCourseById(courseId);
    return this.enrollStudent({
      userId: `manual-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      studentEmail: email.trim().toLowerCase(),
      studentName,
      courseId,
      courseTitle: course?.title || 'Paid Course',
      amountPaid: 0,
      paymentId: `manual-admin-${Date.now()}`
    });
  }

  /**
   * Seed all initial courses & lessons to Cloud Firestore
   */
  public async syncAllToCloud(): Promise<{ count: number }> {
    let count = 0;
    const batch = writeBatch(db);

    for (const c of this.courses) {
      batch.set(doc(db, COURSES_COL, c.id), cleanObject(c), { merge: true });
      count++;
    }
    for (const ch of this.chapters) {
      batch.set(doc(db, CHAPTERS_COL, ch.id), cleanObject(ch), { merge: true });
      count++;
    }
    for (const l of this.lessons) {
      batch.set(doc(db, LESSONS_COL, l.id), cleanObject(l), { merge: true });
      count++;
    }

    await batch.commit();
    return { count };
  }
}

export const paidCourseService = new PaidCourseService();
export { PaidCourseService };
export default paidCourseService;
