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
import { DynamicQuizTest, QuizQuestionItem, UserTestResult } from '../types/database';
import { quizQuestions } from '../data/quizData';

const QUIZZES_COLLECTION = 'mcq_tests';
const TEST_RESULTS_COLLECTION = 'test_results';

// Initial default tests generated from quizData
const initialFallbackTests: DynamicQuizTest[] = [
  {
    id: 'm1-r5-full-mock',
    title: 'NIELIT O Level M1-R5: IT Tools & Network Basics',
    hindiTitle: 'ओ लेवल M1-R5: आईटी टूल्स एवं नेटवर्क बेसिक्स मॉक टेस्ट',
    module: 'm1',
    moduleLabel: 'M1-R5: IT Tools',
    description: 'Comprehensive mock test covering LibreOffice Writer, Calc, Impress, Operating Systems (Linux/Windows), Internet, and Digital Financial Services.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1420,
    createdAt: Date.now(),
    questions: quizQuestions
      .filter(q => q.module === 'm1')
      .map(q => ({
        id: q.id,
        question: q.question,
        hindiQuestion: q.hindiQuestion,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        marks: 2
      }))
  },
  {
    id: 'm2-r5-full-mock',
    title: 'NIELIT O Level M2-R5: Web Designing & Publishing',
    hindiTitle: 'ओ लेवल M2-R5: वेब डिजाइनिंग एवं पब्लिशिंग टेस्ट',
    module: 'm2',
    moduleLabel: 'M2-R5: Web Design',
    description: 'Practice HTML5 elements, CSS3 styling, JavaScript DOM scripting, and W3.CSS frameworks.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1180,
    createdAt: Date.now(),
    questions: quizQuestions
      .filter(q => q.module === 'm2')
      .map(q => ({
        id: q.id,
        question: q.question,
        hindiQuestion: q.hindiQuestion,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        marks: 2
      }))
  },
  {
    id: 'm3-r5-python-mock',
    title: 'NIELIT O Level M3-R5: Python Programming (Flagship)',
    hindiTitle: 'ओ लेवल M3-R5: पायथन प्रोग्रामिंग कम्पलीट टेस्ट',
    module: 'm3',
    moduleLabel: 'M3-R5: Python',
    description: 'Master Python syntax, flow of control, data structures (lists, tuples, dicts), functions, file handling, and NumPy arrays.',
    durationMinutes: 60,
    totalMarks: 60,
    passingMarks: 30,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 2890,
    createdAt: Date.now(),
    questions: quizQuestions
      .filter(q => q.module === 'm3' || q.module === 'python')
      .map(q => ({
        id: q.id,
        question: q.question,
        hindiQuestion: q.hindiQuestion,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        marks: 2
      }))
  },
  {
    id: 'm4-r5-iot-mock',
    title: 'NIELIT O Level M4-R5: Internet of Things (IoT)',
    hindiTitle: 'ओ लेवल M4-R5: इंटरनेट ऑफ थिंग्स (IoT) एवं एप्लीकेशन्स',
    module: 'm4',
    moduleLabel: 'M4-R5: IoT',
    description: 'Test your understanding of IoT architectures, Arduino microcontrollers, sensors, actuators, and cybersecurity.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 950,
    createdAt: Date.now(),
    questions: quizQuestions
      .filter(q => q.module === 'm4')
      .map(q => ({
        id: q.id,
        question: q.question,
        hindiQuestion: q.hindiQuestion,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        marks: 2
      }))
  },
  {
    id: 'ccc-standard-mock',
    title: 'NIELIT CCC (Course on Computer Concepts) Mega Mock Test',
    hindiTitle: 'ट्रिपल सी (CCC) 100 प्रश्नों का ऑनलाइन सीबीटी टेस्ट',
    module: 'ccc',
    moduleLabel: 'NIELIT CCC',
    description: '80-hour syllabus model paper with LibreOffice shortcut questions, digital banking (UPI, AEPS, USSD), and cyber hygiene.',
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 50,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 3450,
    createdAt: Date.now(),
    questions: quizQuestions
      .filter(q => q.module === 'ccc' || q.module === 'm1')
      .map(q => ({
        id: q.id,
        question: q.question,
        hindiQuestion: q.hindiQuestion,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        marks: 1
      }))
  }
];

export const quizService = {
  // Real-time subscription to tests
  subscribeQuizzes: (callback: (quizzes: DynamicQuizTest[]) => void) => {
    try {
      const colRef = collection(db, QUIZZES_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list: DynamicQuizTest[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as DynamicQuizTest);
          });
          callback(list);
        } else {
          callback(initialFallbackTests);
        }
      }, (error) => {
        console.warn('Firestore quiz subscription error, using fallback:', error);
        callback(initialFallbackTests);
      });
    } catch (err) {
      console.warn('Error subscribing to quizzes:', err);
      callback(initialFallbackTests);
      return () => {};
    }
  },

  // Get test by ID
  getQuizById: async (testId: string): Promise<DynamicQuizTest | null> => {
    try {
      const docRef = doc(db, QUIZZES_COLLECTION, testId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DynamicQuizTest;
      }
    } catch (e) {
      console.warn('Failed to get quiz from Firestore, checking fallback:', e);
    }
    const found = initialFallbackTests.find(t => t.id === testId);
    return found || null;
  },

  // Create new Quiz
  createQuiz: async (quiz: Omit<DynamicQuizTest, 'id'>): Promise<string> => {
    const colRef = collection(db, QUIZZES_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...quiz,
      totalAttempts: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update existing Quiz
  updateQuiz: async (id: string, updates: Partial<DynamicQuizTest>): Promise<void> => {
    const docRef = doc(db, QUIZZES_COLLECTION, id);
    
    // Clean and remove any undefined fields recursively to prevent Firestore errors
    const cleanedUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        if (key === 'questions' && Array.isArray(value)) {
          // Deep clean each question object
          cleanedUpdates[key] = value.map((q: QuizQuestionItem, idx) => {
            const cleanQ: Record<string, any> = {
              id: q.id || `q-${Date.now()}-${idx}`,
              question: q.question || '',
              options: Array.isArray(q.options)
                ? q.options.map(opt => (opt !== undefined && opt !== null ? String(opt) : ''))
                : ['', '', '', ''],
              correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
              marks: typeof q.marks === 'number' ? q.marks : 1
            };
            if (q.hindiQuestion && q.hindiQuestion.trim() !== '') {
              cleanQ.hindiQuestion = q.hindiQuestion.trim();
            }
            if (q.explanation && q.explanation.trim() !== '') {
              cleanQ.explanation = q.explanation.trim();
            }
            return cleanQ;
          });
        } else {
          cleanedUpdates[key] = value;
        }
      }
    }

    await setDoc(docRef, {
      ...cleanedUpdates,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  // Delete Quiz
  deleteQuiz: async (id: string): Promise<void> => {
    const docRef = doc(db, QUIZZES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Record test submission attempt & save result
  saveTestResult: async (result: UserTestResult): Promise<void> => {
    try {
      // 1. Increment attempt counter on quiz
      const quizRef = doc(db, QUIZZES_COLLECTION, result.testId);
      await updateDoc(quizRef, {
        totalAttempts: increment(1)
      }).catch(() => {});

      // 2. Save result
      const resultsRef = collection(db, TEST_RESULTS_COLLECTION);
      await addDoc(resultsRef, {
        ...result,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Failed to save test result to firestore:', e);
    }
  },

  // Seed default quizzes into Firestore
  seedDefaultQuizzes: async (): Promise<number> => {
    let count = 0;
    for (const test of initialFallbackTests) {
      const docRef = doc(db, QUIZZES_COLLECTION, test.id);
      
      // Strip undefined values cleanly by stringifying/parsing
      const sanitizedTest = JSON.parse(JSON.stringify({
        ...test,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }));

      await setDoc(docRef, sanitizedTest, { merge: true });
      count++;
    }
    return count;
  }
};
