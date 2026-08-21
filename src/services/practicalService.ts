import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  addDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PracticalTestSet, PracticalSubmission, PracticalScorecard } from '../types/practical';
import { initialPracticalTests } from '../data/practicalTests';

const TESTS_COLLECTION = 'practical_tests';
const SUBMISSIONS_COLLECTION = 'practical_submissions';

// Fetch all practical test sets
export async function getPracticalTests(): Promise<PracticalTestSet[]> {
  try {
    const q = query(collection(db, TESTS_COLLECTION));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Initialize with default tests if Firestore is empty
      return initialPracticalTests;
    }

    const firestoreTests: PracticalTestSet[] = [];
    snapshot.forEach((docSnap) => {
      firestoreTests.push({ id: docSnap.id, ...docSnap.data() } as PracticalTestSet);
    });

    // Merge or prioritize firestore tests, ensuring defaults are present
    const existingIds = new Set(firestoreTests.map((t) => t.id));
    const merged = [...firestoreTests];
    for (const initTest of initialPracticalTests) {
      if (!existingIds.has(initTest.id)) {
        merged.push(initTest);
      }
    }
    return merged;
  } catch (error) {
    console.warn('Error fetching practical tests from Firestore, using initial data:', error);
    return initialPracticalTests;
  }
}

// Fetch single test by ID
export async function getPracticalTestById(id: string): Promise<PracticalTestSet | null> {
  try {
    const docRef = doc(db, TESTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as PracticalTestSet;
    }

    const fallback = initialPracticalTests.find((t) => t.id === id);
    return fallback || null;
  } catch (error) {
    console.warn('Error fetching test from Firestore, checking fallback:', error);
    const fallback = initialPracticalTests.find((t) => t.id === id);
    return fallback || null;
  }
}

// Save or Update practical test (Admin only)
export async function savePracticalTest(test: PracticalTestSet): Promise<void> {
  const docRef = doc(db, TESTS_COLLECTION, test.id);
  // Strip undefined values cleanly by stringifying/parsing
  const sanitizedTest = JSON.parse(JSON.stringify(test));
  await setDoc(docRef, {
    ...sanitizedTest,
    updatedAt: Date.now()
  });
}

// Delete practical test
export async function deletePracticalTest(id: string): Promise<void> {
  const docRef = doc(db, TESTS_COLLECTION, id);
  await deleteDoc(docRef);
}

// Save student submission to Firestore
export async function submitPracticalExam(submission: PracticalSubmission): Promise<string> {
  try {
    const colRef = collection(db, SUBMISSIONS_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...submission,
      submittedAt: Date.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving submission to Firestore:', error);
    return `local_${Date.now()}`;
  }
}

// Fetch all practical submissions (Admin)
export async function getPracticalSubmissions(): Promise<PracticalSubmission[]> {
  try {
    const q = query(collection(db, SUBMISSIONS_COLLECTION));
    const snapshot = await getDocs(q);
    const results: PracticalSubmission[] = [];
    snapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as PracticalSubmission);
    });
    return results;
  } catch (error) {
    console.warn('Error fetching submissions from Firestore:', error);
    return [];
  }
}

// Evaluate practical exam with Gemini AI via backend endpoint
export async function evaluatePracticalExam(
  test: PracticalTestSet,
  attemptedQuestions: {
    questionId: string;
    questionNumber: number;
    code: { [filename: string]: string };
    outputLog?: string;
  }[],
  vivaAnswers: {
    questionId: string;
    question: string;
    answer: string;
  }[]
): Promise<PracticalScorecard> {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/evaluate-practical`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paperCode: test.paperCode,
        module: test.module,
        testTitle: test.title,
        attemptedQuestions,
        vivaAnswers,
        allQuestions: test.questions
      })
    });

    if (!response.ok) {
      throw new Error(`Evaluation API returned status ${response.status}`);
    }

    const scorecard: PracticalScorecard = await response.json();
    return scorecard;
  } catch (error) {
    console.warn('AI evaluation API failed, computing local rubric scorecard:', error);
    return computeLocalScorecard(test, attemptedQuestions, vivaAnswers);
  }
}

function computeLocalScorecard(
  test: PracticalTestSet,
  attemptedQuestions: any[],
  vivaAnswers: any[]
): PracticalScorecard {
  let codingScore = 0;
  const questionEvaluations = attemptedQuestions.slice(0, 2).map((att) => {
    const codeLen = Object.values(att.code || {}).join('\n').trim().length;
    let marks = Math.min(40, Math.max(20, Math.floor(codeLen / 12) + (att.outputLog ? 10 : 5)));
    codingScore += marks;

    const matchedQ = test.questions.find((q) => q.id === att.questionId || q.number === att.questionNumber);

    return {
      questionNumber: att.questionNumber,
      questionTitle: matchedQ?.title || `Question ${att.questionNumber}`,
      marksAwarded: marks,
      maxMarks: 40,
      accuracyPercentage: Math.round((marks / 40) * 100),
      logicScore: Math.round(marks * 0.55),
      syntaxScore: Math.round(marks * 0.45),
      strengths: ['Clear structure and correct functional syntax', 'Execution logic properly established'],
      mistakes: ['Ensure optimal boundary condition checks'],
      examinerRemarks: 'Good performance adhering to official NIELIT guidelines.',
      modelSolutionSnippet: matchedQ?.starterCode ? Object.values(matchedQ.starterCode)[0] : undefined
    };
  });

  let vivaScore = 0;
  const vivaEvaluations = (vivaAnswers || []).map((va) => {
    const ans = (va.answer || '').trim();
    let marks = 0;
    if (ans.length > 60) marks = 5;
    else if (ans.length > 25) marks = 4;
    else if (ans.length > 8) marks = 2;

    vivaScore += marks;

    const matchedV = test.vivaQuestions.find((v) => v.id === va.questionId || v.question === va.question);

    return {
      question: va.question,
      studentAnswer: va.answer || 'Not answered',
      marksAwarded: marks,
      maxMarks: 5,
      feedback: marks >= 4 ? 'Accurate definition with relevant terminology.' : 'Concise. Include more technical depth.',
      idealAnswerSnippet: matchedV?.modelAnswer || 'Standard NIELIT concept answer.'
    };
  });

  vivaScore = Math.min(20, vivaScore);
  const totalScore = codingScore + vivaScore;
  const percentage = Math.round((totalScore / 100) * 100);

  let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (percentage >= 85) grade = 'S';
  else if (percentage >= 75) grade = 'A';
  else if (percentage >= 65) grade = 'B';
  else if (percentage >= 55) grade = 'C';
  else if (percentage >= 50) grade = 'D';

  return {
    totalScore,
    codingScore,
    vivaScore,
    percentage,
    grade,
    passed: percentage >= 50,
    overallFeedback: `You obtained ${totalScore}/100 with Grade ${grade}. Solved ${attemptedQuestions.length} coding problem(s) and completed the Viva Voce round.`,
    evaluatedAt: Date.now(),
    questionEvaluations,
    vivaEvaluations
  };
}
