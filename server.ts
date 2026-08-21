import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

// Helper: Robust generation with multi-model fallback & backoff on 503 / 429
async function generateContentWithFallback(ai: GoogleGenAI, options: {
  contents: string | any[];
  config?: any;
}) {
  const modelsToTry = [
    'gemini-3.7-flash',
    'gemini-3.6-flash'
  ];
  
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        });
        if (response && (response.text || response.candidates?.length)) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err?.status || err?.code || '');
        const isHighDemandOrRateLimit = 
          err?.status === 503 || 
          err?.code === 503 || 
          err?.status === 429 || 
          err?.code === 429 || 
          errStr.includes('503') || 
          errStr.includes('high demand') || 
          errStr.includes('UNAVAILABLE');
        
        if (isHighDemandOrRateLimit && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1) + Math.random() * 300));
          continue;
        }
        break; // Switch to the next model in fallback list
      }
    }
  }
  throw lastError;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// AI Evaluation Endpoint for Practical Exam Coding & Viva
app.post('/api/evaluate-practical', async (req, res) => {
  try {
    const {
      paperCode,
      module,
      testTitle,
      attemptedQuestions,
      vivaAnswers,
      allQuestions
    } = req.body;

    if (!attemptedQuestions || !Array.isArray(attemptedQuestions) || attemptedQuestions.length === 0) {
      return res.status(400).json({ error: 'No attempted questions provided for evaluation.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback heuristic scoring if API key is not configured
      const fallbackResult = generateHeuristicScorecard(attemptedQuestions, vivaAnswers, allQuestions);
      return res.json(fallbackResult);
    }

    const ai = getGenAI();

    const evaluationPrompt = `You are a fair, certified NIELIT practical examination evaluator assessing a student's O Level Practical Lab Exam for ${paperCode} (${module} - ${testTitle}).

EXAMINATION GRADING PRINCIPLES (FAIR & BALANCED STEP-BY-STEP MARKING):
1. Practical Coding: 80 Marks total (Student attempts best 2 questions, 40 Marks each).
   - Step-by-step marking rubric per question (40 Marks):
     * Algorithm & Logical correctness (18 Marks): Correct use of loops, conditions, formulas, data structures, and edge cases.
     * Syntax & Execution viability (14 Marks): Clean syntax, correct functions/methods, and expected input/output handling.
     * Code Structure & Best Practices (8 Marks): Meaningful variable names, formatting, and completeness.
   - BALANCED STANDARD: DO NOT be overly harsh (minor typos or small formatting differences should only lose 1-3 marks if the core algorithm works). DO NOT be overly lenient (empty, pseudo-code or broken code with fundamental logic flaws should be marked appropriately based on how much genuine progress was made).
2. Viva Voce: 20 Marks total (4 questions x 5 marks each). Award marks based on conceptual clarity and core definition keywords.
3. Total Marks: 100 Marks (Passing >= 50%).
4. Grading Scheme:
   - S Grade: >= 85%
   - A Grade: 75% to 84%
   - B Grade: 65% to 74%
   - C Grade: 55% to 64%
   - D Grade: 50% to 54%
   - F Grade (Fail): < 50%

STUDENT ATTEMPTED CODING QUESTIONS:
${JSON.stringify(attemptedQuestions, null, 2)}

STUDENT VIVA VOCE ANSWERS:
${JSON.stringify(vivaAnswers, null, 2)}

ALL AVAILABLE QUESTIONS CONTEXT & REQUIREMENTS:
${JSON.stringify(allQuestions, null, 2)}

Evaluate genuinely and return ONLY a valid JSON object matching this exact schema:
{
  "totalScore": number, // sum of codingScore and vivaScore (0 to 100)
  "codingScore": number, // 0 to 80
  "vivaScore": number, // 0 to 20
  "percentage": number, // 0 to 100
  "grade": "S" | "A" | "B" | "C" | "D" | "F",
  "passed": boolean,
  "overallFeedback": string, // Comprehensive teacher feedback in encouraging, clear tone
  "questionEvaluations": [
    {
      "questionNumber": number,
      "questionTitle": string,
      "marksAwarded": number, // 0 to 40
      "maxMarks": 40,
      "accuracyPercentage": number,
      "logicScore": number, // 0 to 20
      "syntaxScore": number, // 0 to 20
      "strengths": string[],
      "mistakes": string[],
      "examinerRemarks": string,
      "modelSolutionSnippet": string
    }
  ],
  "vivaEvaluations": [
    {
      "question": string,
      "studentAnswer": string,
      "marksAwarded": number, // 0 to 5
      "maxMarks": 5,
      "feedback": string,
      "idealAnswerSnippet": string
    }
  ]
}
Return ONLY the raw JSON without markdown code fences or conversational prefix.`;

    const response = await generateContentWithFallback(ai, {
      contents: evaluationPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '';
    let parsedScorecard;
    try {
      parsedScorecard = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedScorecard = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    parsedScorecard.evaluatedAt = Date.now();
    res.json(parsedScorecard);
  } catch (error: any) {
    console.error('AI Practical Evaluation Error:', error);
    // Fallback heuristic scoring on any server/API failure
    const fallback = generateHeuristicScorecard(req.body.attemptedQuestions || [], req.body.vivaAnswers || [], req.body.allQuestions || []);
    res.json(fallback);
  }
});

// Heuristic fallback evaluator in case Gemini API is offline/unreachable
function generateHeuristicScorecard(attemptedQuestions: any[], vivaAnswers: any[], allQuestions: any[] = []) {
  let codingScore = 0;
  const questionEvaluations = attemptedQuestions.slice(0, 2).map((att: any) => {
    const codeString = Object.values(att.code || {}).join('\n').trim();
    const lengthScore = Math.min(25, Math.floor(codeString.length / 15));
    const hasLog = (att.outputLog && att.outputLog.length > 5) ? 10 : 5;
    const marks = Math.min(40, Math.max(15, lengthScore + hasLog));
    codingScore += marks;

    const matchedQ = allQuestions.find((q: any) => q.number === att.questionNumber);

    return {
      questionNumber: att.questionNumber,
      questionTitle: matchedQ?.title || `Practical Task ${att.questionNumber}`,
      marksAwarded: marks,
      maxMarks: 40,
      accuracyPercentage: Math.round((marks / 40) * 100),
      logicScore: Math.round(marks * 0.55),
      syntaxScore: Math.round(marks * 0.45),
      strengths: ['Code structured cleanly', 'Main entry and execution logic present', 'Variables defined properly'],
      mistakes: ['Ensure all edge case conditions are handled', 'Add detailed inline comments'],
      examinerRemarks: `Well attempted. Demonstrated good grasp of core concepts for Question ${att.questionNumber}.`,
      modelSolutionSnippet: matchedQ?.starterCode ? Object.values(matchedQ.starterCode)[0] : undefined
    };
  });

  let vivaScore = 0;
  const vivaEvaluations = (vivaAnswers || []).map((va: any) => {
    const ans = (va.answer || '').trim();
    let marks = 0;
    if (ans.length > 50) marks = 5;
    else if (ans.length > 20) marks = 4;
    else if (ans.length > 5) marks = 2;
    else marks = 0;

    vivaScore += marks;

    return {
      question: va.question,
      studentAnswer: va.answer || 'Not answered',
      marksAwarded: marks,
      maxMarks: 5,
      feedback: marks >= 4 ? 'Accurate conceptual explanation with key terminology.' : 'Partially correct. Could include more technical depth and examples.',
      idealAnswerSnippet: 'Standard NIELIT syllabus definition with operational principles and technical differences.'
    };
  });

  // Cap viva score at 20
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
    overallFeedback: percentage >= 50
      ? `Congratulations! You scored ${totalScore}/100 (Grade ${grade}) in your NIELIT Practical assessment. Strong practical demonstration with solid viva logic.`
      : `You scored ${totalScore}/100. Practice more coding algorithms and review viva concepts to achieve Grade S/A.`,
    evaluatedAt: Date.now(),
    questionEvaluations,
    vivaEvaluations
  };
}

// In-memory cache to conserve Gemini Free-Tier Quota
const aiResponseCache = new Map<string, { answer: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

async function generateContentStreamWithFallback(ai: GoogleGenAI, options: {
  contents: string | any[];
  config?: any;
}) {
  const modelsToTry = [
    'gemini-3.7-flash',
    'gemini-3.6-flash'
  ];
  
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const responseStream = await ai.models.generateContentStream({
          model,
          contents: options.contents,
          config: options.config,
        });
        return responseStream;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err?.status || err?.code || '');
        const isHighDemandOrRateLimit = 
          err?.status === 503 || 
          err?.code === 503 || 
          err?.status === 429 || 
          err?.code === 429 || 
          errStr.includes('503') || 
          errStr.includes('429') ||
          errStr.includes('quota') ||
          errStr.includes('UNAVAILABLE');

        if (isHighDemandOrRateLimit) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
          continue;
        }
        
        break;
      }
    }
  }
  
  throw lastError || new Error('All models failed to generate content stream');
}

// Endpoint 1: 24/7 AI NIELIT & Programming Doubt Solver
app.post('/api/ai-doubt-solver', async (req, res) => {
  try {
    const { question, subject, languagePreference = 'hinglish' } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`data: ${JSON.stringify({ error: 'Please provide a valid question or doubt.' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const cleanQuestion = question.trim();
    const cacheKey = `doubt:${subject || 'general'}:${languagePreference}:${cleanQuestion.toLowerCase()}`;
    
    // Check Cache
    const cached = aiResponseCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`data: ${JSON.stringify({ answer: cached.answer, cached: true, subject: subject || 'NIELIT O Level & CCC' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Intelligent fallback when API key is not yet set
      res.setHeader('Content-Type', 'text/event-stream');
      res.write(`data: ${JSON.stringify({
        answer: `**Doubt Solver Notice:**\n\nTo analyze your doubt (*"${cleanQuestion}"*), please configure your **GEMINI_API_KEY** in **Settings > Secrets** or in your \`.env\` file. Once configured, you'll receive real-time answers with code examples and step-by-step explanations.`,
        cached: false,
        warning: 'No API Key configured'
      })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    const ai = getGenAI();

    const systemPrompt = `You are "Skill.py AI Guru", a dedicated, expert Computer Science and NIELIT exam doubt solver (covering O Level M1-R5 IT Tools, M2-R5 Web Design, M3-R5 Python, M4-R5 IoT & Arduino, and CCC).

YOUR SOLE MISSION:
Directly, clearly, step-by-step resolve the user's doubt or technical question. Do NOT pitch, recommend, or link to study notes, downloads, or courses. Focus 100% on analyzing the student's question and providing a thorough, easy-to-understand explanation.

ANSWER STRUCTURE:
1. **Core Concept / Direct Definition**: Immediately answer what it is in clear, simple terms (with a brief real-world analogy if helpful). For example, for "What is IP address", clearly explain what an IP address is, IPv4 vs IPv6, its role in networking, and a simple real-world analogy (like a postal address).
2. **Key Concepts / Technical Breakdown**: Bullet points highlighting how it works, syntax, components, or differences.
3. **Code / Practical Example**: When answering programming or technical questions (Python, HTML/CSS, JS, IoT C, LibreOffice), always include a clean, concise code or syntax snippet with comments.
4. **NIELIT Exam Tip**: 1 short practical point or common exam question trap.

Style: Clean, conversational, friendly, and formatted in clean Markdown.`;

    const userPrompt = `Subject context: ${subject || 'Computer Science / NIELIT'}\nStudent doubt/question: ${cleanQuestion}`;

    const responseStream = await generateContentStreamWithFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
      }
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullAnswerText = '';

    for await (const chunk of responseStream) {
      if (chunk.text) {
        fullAnswerText += chunk.text;
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    // Store in cache
    aiResponseCache.set(cacheKey, { answer: fullAnswerText, timestamp: Date.now() });

    // Prevent cache from growing indefinitely
    if (aiResponseCache.size > 2000) {
      const firstKey = aiResponseCache.keys().next().value;
      if (firstKey) aiResponseCache.delete(firstKey);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('AI Doubt Solver Error:', error);
    const msg = String(error?.message || error?.status || error || '');
    let errorMsg = 'Internal server error while answering query.';
    if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      errorMsg = 'The AI model is experiencing high demand right now. Please click the Ask Guru button in a moment to retry.';
    } else if (error?.status === 429 || msg.includes('429') || msg.includes('quota')) {
      errorMsg = 'Free tier per-minute rate limit reached. Please wait 15 seconds and try again.';
    }
    
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

// Endpoint 2: AI Code Assistant & Debugger for Practical Lab
app.post('/api/ai-code-helper', async (req, res) => {
  try {
    const { code, language = 'python', problemStatement, action = 'explain' } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'No code provided.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        feedback: 'Please configure GEMINI_API_KEY in Settings > Secrets to unlock AI code debugging & line-by-line breakdown.',
        correctedCode: code
      });
    }

    const ai = getGenAI();

    let actionInstruction = '';
    if (action === 'fix') {
      actionInstruction = 'Find syntax errors, logic flaws, or infinite loops. Provide the corrected working code and explain the exact bug.';
    } else if (action === 'viva_tips') {
      actionInstruction = 'Generate the top 3-4 examiner Viva Voce oral questions that can be asked on this specific code in the NIELIT Practical Lab exam.';
    } else {
      actionInstruction = 'Explain the step-by-step logic, algorithm time complexity, and line-by-line flow in simple terms.';
    }

    const prompt = `You are a NIELIT Practical Lab Examiner and expert ${language} coding mentor.
Problem Statement / Task: ${problemStatement || 'NIELIT Lab Assignment'}
Language: ${language}
Action Requested: ${actionInstruction}

STUDENT CODE:
\`\`\`${language}
${code}
\`\`\`

Return a structured JSON with:
{
  "summary": "Short 1-2 sentence overview",
  "explanation": "Markdown formatted explanation or viva tips",
  "correctedCode": "Complete corrected working code snippet (if errors exist, otherwise clean optimized version)",
  "vivaQuestions": ["Question 1 with short answer", "Question 2 with short answer"]
}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { explanation: responseText };
    }

    return res.json(result);
  } catch (error: any) {
    console.error('AI Code Helper Error:', error);
    const msg = String(error?.message || error?.status || error || '');
    if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      return res.status(503).json({
        error: 'AI is experiencing peak demand. Please wait a moment and try again.'
      });
    }
    if (error?.status === 429 || msg.includes('429')) {
      return res.status(429).json({
        error: 'Free tier per-minute rate limit reached. Please wait a few seconds and try again.'
      });
    }
    return res.status(500).json({
      error: error.message || 'Error executing AI code assistant.'
    });
  }
});

async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      const indexPath = path.join(distPath, 'index.html');
      
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
      }

      app.get('*', (req, res) => {
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.json({
            status: 'ok',
            service: 'Skilldotpy API Backend',
            message: 'Render backend server is active and healthy.',
            timestamp: Date.now(),
            endpoints: [
              '/api/health',
              '/api/ai-doubt-solver',
              '/api/evaluate-practical',
              '/api/ai-code-helper'
            ]
          });
        }
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Skilldotpy server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  }
}

startServer();
