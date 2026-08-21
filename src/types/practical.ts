export type PracticalModule = 'M1-R5' | 'M2-R5' | 'M3-R5' | 'M4-R5';
export type PracticalLanguage = 'html' | 'python' | 'arduino' | 'general';

export interface PracticalTestCase {
  input?: string;
  expected?: string;
  description?: string;
}

export interface PracticalQuestion {
  id: string;
  number: 1 | 2 | 3;
  title: string;
  description: string;
  marks: number; // usually 40 marks
  language: PracticalLanguage;
  starterCode: { [filename: string]: string };
  expectedOutputSnippet?: string;
  testCases?: PracticalTestCase[];
  hints?: string[];
  wokwiDiagramJson?: string;
}

export interface VivaQuestion {
  id: string;
  question: string;
  hindiQuestion?: string;
  marks: number; // e.g. 5 marks each (total 20 marks for 4)
  modelAnswer?: string;
  keyPoints?: string[];
}

export interface PracticalTestSet {
  id: string;
  module: PracticalModule;
  paperCode: string; // e.g., 'PR2 B1', 'PR3 B2', 'PR4 B3', 'PR1 B1'
  title: string;
  hindiTitle: string;
  description: string;
  durationMinutes: number; // e.g., 50
  totalMarks: number; // 100
  requiredQuestionsCount: number; // 2 out of 3
  codingMarksPerQuestion: number; // 40 marks
  vivaMarks: number; // 20 marks
  questions: PracticalQuestion[]; // exactly 3 questions
  vivaQuestions: VivaQuestion[]; // 3-4 questions
  instructions: string[];
  isFeatured?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface QuestionEvaluation {
  questionNumber: number;
  questionTitle: string;
  marksAwarded: number;
  maxMarks: number;
  accuracyPercentage: number;
  logicScore: number;
  syntaxScore: number;
  strengths: string[];
  mistakes: string[];
  examinerRemarks: string;
  modelSolutionSnippet?: string;
}

export interface VivaEvaluation {
  question: string;
  studentAnswer: string;
  marksAwarded: number;
  maxMarks: number;
  feedback: string;
  idealAnswerSnippet: string;
}

export interface PracticalScorecard {
  totalScore: number; // out of 100
  codingScore: number; // out of 80 (sum of best 2 attempted questions)
  vivaScore: number; // out of 20
  percentage: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  passed: boolean;
  overallFeedback: string;
  evaluatedAt: number;
  questionEvaluations: QuestionEvaluation[];
  vivaEvaluations: VivaEvaluation[];
}

export interface PracticalSubmission {
  id?: string;
  testId: string;
  paperCode: string;
  module: PracticalModule;
  studentName: string;
  studentEmail?: string;
  attemptedQuestions: {
    questionId: string;
    questionNumber: number;
    code: { [filename: string]: string };
    outputLog?: string;
    submittedAt?: number;
  }[];
  vivaAnswers: {
    questionId: string;
    question: string;
    answer: string;
  }[];
  scorecard?: PracticalScorecard;
  timeSpentSeconds: number;
  submittedAt: number;
}
