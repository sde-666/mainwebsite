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
import { initialChapterMcqSeedData } from '../data/chapterMcqData';

const QUIZZES_COLLECTION = 'mcq_tests';
const TEST_RESULTS_COLLECTION = 'test_results';

// Helper to convert chapter MCQs into QuizQuestionItems
const mapChapterMcqToQuizItem = (mcq: any, idx: number): QuizQuestionItem => ({
  id: mcq.id || `q-ch-${idx}`,
  question: mcq.question,
  hindiQuestion: mcq.hindiQuestion,
  options: mcq.options || ['A', 'B', 'C', 'D'],
  correctIndex: typeof mcq.correctIndex === 'number' ? mcq.correctIndex : 0,
  explanation: mcq.explanation || mcq.hindiExplanation || '',
  marks: 1
});

// Helper to get questions for module
const getModuleQuestions = (mod: string) => {
  const chapterFiltered = initialChapterMcqSeedData
    .filter(m => m.moduleId === mod || (mod === 'm1' && m.moduleId === 'm1-r5') || (mod === 'm2' && m.moduleId === 'm2-r5') || (mod === 'm3' && m.moduleId === 'm3-r5') || (mod === 'm4' && m.moduleId === 'm4-r5'))
    .map(mapChapterMcqToQuizItem);
  const generalFiltered = quizQuestions
    .filter(q => q.module === mod || (mod === 'm3' && q.module === 'python'))
    .map((q, idx) => ({
      id: q.id || `q-gen-${idx}`,
      question: q.question,
      hindiQuestion: q.hindiQuestion,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      marks: 1
    }));
  return [...generalFiltered, ...chapterFiltered];
};

const m1AllQs = getModuleQuestions('m1');
const m2AllQs = getModuleQuestions('m2');
const m3AllQs = getModuleQuestions('m3');
const m4AllQs = getModuleQuestions('m4');
const cccAllQs = getModuleQuestions('ccc');

// 4 Full CBT Tests per paper
const initialFallbackTests: DynamicQuizTest[] = [
  // ================= M1-R5.1: IT TOOLS (4 TESTS) =================
  {
    id: 'm1-test-1',
    title: 'M1-R5.1 Test 1: Computer Fundamentals & OS Special',
    hindiTitle: 'M1-R5.1 टेस्ट 1: कंप्यूटर फंडामेंटल्स एवं ऑपरेटिंग सिस्टम',
    module: 'm1',
    moduleLabel: 'M1-R5: IT Tools',
    description: 'Hardware, Software, Linux/Windows CLI, GUI, Memory management, and input/output systems.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1840,
    createdAt: Date.now() - 10000000,
    questions: m1AllQs.slice(0, 15).length > 0 ? m1AllQs.slice(0, 15) : m1AllQs
  },
  {
    id: 'm1-test-2',
    title: 'M1-R5.1 Test 2: LibreOffice Suite (Writer, Calc, Impress)',
    hindiTitle: 'M1-R5.1 टेस्ट 2: लिब्रेऑफिस कम्प्लीट पैकेज (राइटर, कैल्क, इम्प्रेस)',
    module: 'm1',
    moduleLabel: 'M1-R5: IT Tools',
    description: 'Word processing, spreadsheet formulas, slide transitions, mail merge, and shortcut keys.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1520,
    createdAt: Date.now() - 8000000,
    questions: m1AllQs.slice(2, 18).length > 0 ? m1AllQs.slice(2, 18) : m1AllQs
  },
  {
    id: 'm1-test-3',
    title: 'M1-R5.1 Test 3: Internet, WWW & Digital Financial Tools',
    hindiTitle: 'M1-R5.1 टेस्ट 3: इंटरनेट, वेब एवं डिजिटल वित्तीय सेवाएं (UPI/AEPS)',
    module: 'm1',
    moduleLabel: 'M1-R5: IT Tools',
    description: 'Protocols (TCP/IP, HTTP, FTP), Browsers, Search Engines, Cybersecurity, UPI, AEPS, and USSD banking.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1290,
    createdAt: Date.now() - 6000000,
    questions: m1AllQs.slice(1, 16).length > 0 ? m1AllQs.slice(1, 16) : m1AllQs
  },
  {
    id: 'm1-test-4',
    title: 'M1-R5.1 Test 4: NIELIT Official Full Length Exam Simulator',
    hindiTitle: 'M1-R5.1 टेस्ट 4: 100 प्रश्नों का संपूर्ण परीक्षा सिमुलेटर (PYQ)',
    module: 'm1',
    moduleLabel: 'M1-R5: IT Tools',
    description: 'Full syllabus 100 MCQs model paper with genuine NIELIT R5.1 exam grading.',
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 50,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 3410,
    createdAt: Date.now() - 4000000,
    questions: m1AllQs
  },

  // ================= M2-R5.1: WEB DESIGNING (4 TESTS) =================
  {
    id: 'm2-test-1',
    title: 'M2-R5.1 Test 1: HTML5 & Web Structure Fundamentals',
    hindiTitle: 'M2-R5.1 टेस्ट 1: HTML5 सिमेंटिक एलिमेंट्स एवं संरचना',
    module: 'm2',
    moduleLabel: 'M2-R5: Web Design',
    description: 'Semantic tags, HTML forms, input validations, tables, multimedia, and canvas elements.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1620,
    createdAt: Date.now() - 10000000,
    questions: m2AllQs.slice(0, 15).length > 0 ? m2AllQs.slice(0, 15) : m2AllQs
  },
  {
    id: 'm2-test-2',
    title: 'M2-R5.1 Test 2: CSS3 Styling, Flexbox & Grid Systems',
    hindiTitle: 'M2-R5.1 टेस्ट 2: CSS3 स्टाइलिंग, सेलेक्टर्स, फ्लेक्सबॉक्स एवं ग्रिड',
    module: 'm2',
    moduleLabel: 'M2-R5: Web Design',
    description: 'CSS box model, pseudo-classes, responsive media queries, gradients, animations, and typography.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1380,
    createdAt: Date.now() - 8000000,
    questions: m2AllQs.slice(1, 16).length > 0 ? m2AllQs.slice(1, 16) : m2AllQs
  },
  {
    id: 'm2-test-3',
    title: 'M2-R5.1 Test 3: JavaScript Programming & DOM Manipulation',
    hindiTitle: 'M2-R5.1 टेस्ट 3: जावास्क्रिप्ट प्रोग्रामिंग एवं DOM मैनिपुलेशन',
    module: 'm2',
    moduleLabel: 'M2-R5: Web Design',
    description: 'JS syntax, events, DOM element selection, functions, loops, W3.CSS, and AngularJS basics.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1470,
    createdAt: Date.now() - 6000000,
    questions: m2AllQs.slice(2, 17).length > 0 ? m2AllQs.slice(2, 17) : m2AllQs
  },
  {
    id: 'm2-test-4',
    title: 'M2-R5.1 Test 4: NIELIT Full Length Web Design Exam Simulator',
    hindiTitle: 'M2-R5.1 टेस्ट 4: वेब डिजाइनिंग 100 प्रश्नों का मॉडल पेपर (PYQ)',
    module: 'm2',
    moduleLabel: 'M2-R5: Web Design',
    description: 'Full syllabus 100 MCQs model paper covering HTML5, CSS3, JS, W3.CSS, and Web Publishing/Hosting.',
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 50,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 2980,
    createdAt: Date.now() - 4000000,
    questions: m2AllQs
  },

  // ================= M3-R5.1: PYTHON PROGRAMMING (4 TESTS) =================
  {
    id: 'm3-test-1',
    title: 'M3-R5.1 Test 1: Python Basics, Operators & Control Flow',
    hindiTitle: 'M3-R5.1 टेस्ट 1: पायथन बेसिक, ऑपरेटर्स एवं कंडीशनल फ्लो',
    module: 'm3',
    moduleLabel: 'M3-R5: Python',
    description: 'Variables, data types, if-else conditionals, for/while loops, break/continue, and range function.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 2450,
    createdAt: Date.now() - 10000000,
    questions: m3AllQs.slice(0, 15).length > 0 ? m3AllQs.slice(0, 15) : m3AllQs
  },
  {
    id: 'm3-test-2',
    title: 'M3-R5.1 Test 2: Sequence Data Types (Strings, Lists, Tuples, Dicts)',
    hindiTitle: 'M3-R5.1 टेस्ट 2: सीक्वेंस डेटा टाइप्स (लिस्ट, टपल, डिक्शनरी, सेट)',
    module: 'm3',
    moduleLabel: 'M3-R5: Python',
    description: 'Indexing, slicing, list comprehensions, dictionary methods, immutable vs mutable types.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 2190,
    createdAt: Date.now() - 8000000,
    questions: m3AllQs.slice(1, 16).length > 0 ? m3AllQs.slice(1, 16) : m3AllQs
  },
  {
    id: 'm3-test-3',
    title: 'M3-R5.1 Test 3: Functions, File Handling & NumPy Module',
    hindiTitle: 'M3-R5.1 टेस्ट 3: फंक्शन्स, स्कोप, फाइल हैंडलिंग एवं NumPy ऐरे',
    module: 'm3',
    moduleLabel: 'M3-R5: Python',
    description: 'Def/return, lambda, file open/read/write, exception handling, and NumPy arrays/operations.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 2680,
    createdAt: Date.now() - 6000000,
    questions: m3AllQs.slice(2, 17).length > 0 ? m3AllQs.slice(2, 17) : m3AllQs
  },
  {
    id: 'm3-test-4',
    title: 'M3-R5.1 Test 4: NIELIT Flagship Python 100 MCQs Simulator',
    hindiTitle: 'M3-R5.1 टेस्ट 4: पायथन 100 प्रश्नों का संपूर्ण परीक्षा सिमुलेटर (PYQ)',
    module: 'm3',
    moduleLabel: 'M3-R5: Python',
    description: 'Comprehensive 100 MCQs with code tracing, outputs, syntax, algorithms, and flowcharts.',
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 50,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 4120,
    createdAt: Date.now() - 4000000,
    questions: m3AllQs
  },

  // ================= M4-R5.1: IOT (4 TESTS) =================
  {
    id: 'm4-test-1',
    title: 'M4-R5.1 Test 1: IoT Architecture, Things & Networking',
    hindiTitle: 'M4-R5.1 टेस्ट 1: IoT आर्किटेक्चर, थिंग्स एवं नेटवर्किंग बेसिक्स',
    module: 'm4',
    moduleLabel: 'M4-R5: IoT',
    description: 'Physical & logical designs of IoT, IoT enabling technologies, OSI/TCP layers, and communication models.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1320,
    createdAt: Date.now() - 10000000,
    questions: m4AllQs.slice(0, 15).length > 0 ? m4AllQs.slice(0, 15) : m4AllQs
  },
  {
    id: 'm4-test-2',
    title: 'M4-R5.1 Test 2: Sensors, Actuators & Arduino Uno Programming',
    hindiTitle: 'M4-R5.1 टेस्ट 2: सेंसर्स, एक्चुएटर्स एवं Arduino Uno C-प्रोग्रामिंग',
    module: 'm4',
    moduleLabel: 'M4-R5: IoT',
    description: 'Analog/Digital pins, ATmega328P, DHT11, PIR, Ultrasonic sensors, relays, setup() & loop() functions.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1210,
    createdAt: Date.now() - 8000000,
    questions: m4AllQs.slice(1, 16).length > 0 ? m4AllQs.slice(1, 16) : m4AllQs
  },
  {
    id: 'm4-test-3',
    title: 'M4-R5.1 Test 3: IoT Protocols (MQTT, CoAP) & Cyber Security',
    hindiTitle: 'M4-R5.1 टेस्ट 3: IoT प्रोटोकॉल्स (MQTT, CoAP) एवं साइबर सुरक्षा',
    module: 'm4',
    moduleLabel: 'M4-R5: IoT',
    description: 'Publish-Subscribe architecture, MQTT broker, CoAP, HTTP vs MQTT, threats, encryption, and soft skills.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 1140,
    createdAt: Date.now() - 6000000,
    questions: m4AllQs.slice(2, 17).length > 0 ? m4AllQs.slice(2, 17) : m4AllQs
  },
  {
    id: 'm4-test-4',
    title: 'M4-R5.1 Test 4: NIELIT IoT 100 MCQs Full Exam Simulator',
    hindiTitle: 'M4-R5.1 टेस्ट 4: IoT 100 प्रश्नों का संपूर्ण परीक्षा सिमुलेटर (PYQ)',
    module: 'm4',
    moduleLabel: 'M4-R5: IoT',
    description: 'Complete syllabus mock test with real Arduino, protocol, sensor questions, and soft skills.',
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 50,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 2750,
    createdAt: Date.now() - 4000000,
    questions: m4AllQs
  },

  // ================= CCC: COURSE ON COMPUTER CONCEPTS (4 TESTS) =================
  {
    id: 'ccc-test-1',
    title: 'CCC Test 1: Computer Fundamentals & Hardware/Software',
    hindiTitle: 'CCC टेस्ट 1: कंप्यूटर फंडामेंटल्स एवं हार्डवेयर/सॉफ्टवेयर',
    module: 'ccc',
    moduleLabel: 'NIELIT CCC',
    description: 'Generations of computers, CPU, memory hierarchy, RAM/ROM, input/output devices, and Windows/Linux.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 2890,
    createdAt: Date.now() - 10000000,
    questions: cccAllQs.slice(0, 15).length > 0 ? cccAllQs.slice(0, 15) : cccAllQs
  },
  {
    id: 'ccc-test-2',
    title: 'CCC Test 2: LibreOffice Complete (Writer, Calc, Impress)',
    hindiTitle: 'CCC टेस्ट 2: लिब्रेऑफिस स्पेशल 100+ शॉर्टकट कीज़ एवं फॉर्मूले',
    module: 'ccc',
    moduleLabel: 'NIELIT CCC',
    description: 'LibreOffice shortcuts, menus, formatting, spreadsheet arithmetic, and slide presentation controls.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 2640,
    createdAt: Date.now() - 8000000,
    questions: cccAllQs.slice(1, 16).length > 0 ? cccAllQs.slice(1, 16) : cccAllQs
  },
  {
    id: 'ccc-test-3',
    title: 'CCC Test 3: Digital Banking, UPI, AEPS & Cyber Hygiene',
    hindiTitle: 'CCC टेस्ट 3: डिजिटल वित्तीय सेवाएं, UPI, बैंकिंग एवं साइबर सुरक्षा',
    module: 'ccc',
    moduleLabel: 'NIELIT CCC',
    description: 'Digital payments, NEFT, RTGS, IMPS, UPI, *99#, OTP, phishing, malware, passwords, and IT Act.',
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 25,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 3120,
    createdAt: Date.now() - 6000000,
    questions: cccAllQs.slice(2, 17).length > 0 ? cccAllQs.slice(2, 17) : cccAllQs
  },
  {
    id: 'ccc-test-4',
    title: 'CCC Test 4: NIELIT 100 Questions Grand Mock Test (Official Simulator)',
    hindiTitle: 'CCC टेस्ट 4: 100 प्रश्नों का ग्रैंड सीबीटी मॉक टेस्ट (90 मिनट)',
    module: 'ccc',
    moduleLabel: 'NIELIT CCC',
    description: 'Standard 100 questions CBT exam simulation with official 90 minutes timer and instant grade card.',
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 50,
    negativeMarking: false,
    isPublished: true,
    totalAttempts: 5620,
    createdAt: Date.now() - 4000000,
    questions: cccAllQs
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

  // Save student test result
  saveTestResult: async (result: UserTestResult): Promise<string> => {
    try {
      const colRef = collection(db, TEST_RESULTS_COLLECTION);
      const docRef = await addDoc(colRef, {
        ...result,
        createdAt: serverTimestamp()
      });

      // Increment attempt counter on the test doc
      try {
        const testDocRef = doc(db, QUIZZES_COLLECTION, result.testId);
        await updateDoc(testDocRef, {
          totalAttempts: increment(1)
        });
      } catch (e) {
        // Silently continue if increment fails
      }

      return docRef.id;
    } catch (e) {
      console.warn('Failed to save test result to Firestore:', e);
      return `local-${Date.now()}`;
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
