import { QuizQuestionItem } from '../types/database';

/**
 * Robust CSV parser handling standard comma-separated values, quoted strings with commas and escaped quotes.
 */
export function parseCSVToRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: "" -> "
          currentField += '"';
          i++;
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // Skip CR in CRLF
        continue;
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        // Only push non-empty rows
        if (currentRow.some(field => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Push final field/row if exists
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export interface ParsedQuestionResult {
  validQuestions: QuizQuestionItem[];
  invalidRows: { rowNumber: number; raw: string[]; reason: string }[];
  totalRows: number;
}

export function sanitizeQuizQuestions(questions: QuizQuestionItem[]): QuizQuestionItem[] {
  return questions.map((q, idx) => {
    const sanitized: QuizQuestionItem = {
      id: q.id || `q-${Date.now()}-${idx}`,
      question: q.question || '',
      options: Array.isArray(q.options) 
        ? q.options.map(opt => (opt !== undefined && opt !== null ? String(opt) : ''))
        : ['', '', '', ''],
      correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
      marks: typeof q.marks === 'number' ? q.marks : 1
    };

    if (q.hindiQuestion && q.hindiQuestion.trim() !== '') {
      sanitized.hindiQuestion = q.hindiQuestion.trim();
    }
    if (q.explanation && q.explanation.trim() !== '') {
      sanitized.explanation = q.explanation.trim();
    }

    return sanitized;
  });
}

/**
 * Parses CSV text with columns:
 * Question, Option1, Option2, Option3, Option4, Correct Index (1-4)
 * (and optional Explanation, Hindi Question)
 */
export function parseQuestionsCSV(csvText: string): ParsedQuestionResult {
  const rows = parseCSVToRows(csvText);
  if (rows.length === 0) {
    return { validQuestions: [], invalidRows: [], totalRows: 0 };
  }

  // Identify header indices
  const headerRow = rows[0].map(col => col.toLowerCase().replace(/[\s_\-()]/g, ''));
  
  let qIdx = -1;
  let o1Idx = -1;
  let o2Idx = -1;
  let o3Idx = -1;
  let o4Idx = -1;
  let ansIdx = -1;
  let expIdx = -1;
  let hindiIdx = -1;

  headerRow.forEach((col, index) => {
    if (col === 'question' || col === 'questions' || col === 'q' || col === 'questiontext') {
      qIdx = index;
    } else if (col === 'option1' || col === 'optiona' || col === 'opt1' || col === 'opta' || col === 'a') {
      o1Idx = index;
    } else if (col === 'option2' || col === 'optionb' || col === 'opt2' || col === 'optb' || col === 'b') {
      o2Idx = index;
    } else if (col === 'option3' || col === 'optionc' || col === 'opt3' || col === 'optc' || col === 'c') {
      o3Idx = index;
    } else if (col === 'option4' || col === 'optiond' || col === 'opt4' || col === 'optd' || col === 'd') {
      o4Idx = index;
    } else if (
      col.includes('correct') ||
      col.includes('answer') ||
      col.includes('ans') ||
      col === 'correctindex' ||
      col === 'correctoption'
    ) {
      ansIdx = index;
    } else if (col.includes('explanation') || col.includes('solution') || col.includes('reason')) {
      expIdx = index;
    } else if (col.includes('hindi') || col.includes('hindiquestion')) {
      hindiIdx = index;
    }
  });

  // Fallback to default positional columns if headers are standard without specific names:
  // Col 0: Question, Col 1: Opt1, Col 2: Opt2, Col 3: Opt3, Col 4: Opt4, Col 5: Correct Index
  const hasHeader = qIdx !== -1 || o1Idx !== -1 || ansIdx !== -1;
  if (!hasHeader) {
    qIdx = 0;
    o1Idx = 1;
    o2Idx = 2;
    o3Idx = 3;
    o4Idx = 4;
    ansIdx = 5;
    expIdx = 6;
  } else {
    // If some options were not matched explicitly by name, fill by typical positions
    if (qIdx === -1) qIdx = 0;
    if (o1Idx === -1) o1Idx = 1;
    if (o2Idx === -1) o2Idx = 2;
    if (o3Idx === -1) o3Idx = 3;
    if (o4Idx === -1) o4Idx = 4;
    if (ansIdx === -1) ansIdx = 5;
  }

  const validQuestions: QuizQuestionItem[] = [];
  const invalidRows: { rowNumber: number; raw: string[]; reason: string }[] = [];

  const startRow = hasHeader ? 1 : 0;

  for (let r = startRow; r < rows.length; r++) {
    const row = rows[r];
    const rowNumber = r + 1;

    const questionText = row[qIdx]?.trim();
    const opt1 = row[o1Idx]?.trim();
    const opt2 = row[o2Idx]?.trim();
    const opt3 = row[o3Idx]?.trim();
    const opt4 = row[o4Idx]?.trim();
    const rawAnswer = row[ansIdx]?.trim();
    const explanation = expIdx >= 0 && row[expIdx] ? row[expIdx].trim() : '';
    const hindiQuestion = hindiIdx >= 0 && row[hindiIdx] ? row[hindiIdx].trim() : '';

    if (!questionText) {
      invalidRows.push({ rowNumber, raw: row, reason: 'Empty question text' });
      continue;
    }

    if (!opt1 || !opt2) {
      invalidRows.push({ rowNumber, raw: row, reason: 'Missing required options (at least Option 1 and Option 2 must be provided)' });
      continue;
    }

    // Build options array (4 options standard)
    const options = [opt1, opt2, opt3 || '', opt4 || ''];

    // Parse correct index: handles "1", "2", "3", "4" -> 0, 1, 2, 3 OR "A", "B", "C", "D" -> 0, 1, 2, 3 OR 0, 1, 2, 3
    let correctIndex = 0;
    const ansUpper = rawAnswer ? rawAnswer.toUpperCase() : '1';

    if (ansUpper === '1' || ansUpper === 'A' || ansUpper === 'OPTION1' || ansUpper === 'OPTION A') {
      correctIndex = 0;
    } else if (ansUpper === '2' || ansUpper === 'B' || ansUpper === 'OPTION2' || ansUpper === 'OPTION B') {
      correctIndex = 1;
    } else if (ansUpper === '3' || ansUpper === 'C' || ansUpper === 'OPTION3' || ansUpper === 'OPTION C') {
      correctIndex = 2;
    } else if (ansUpper === '4' || ansUpper === 'D' || ansUpper === 'OPTION4' || ansUpper === 'OPTION D') {
      correctIndex = 3;
    } else if (ansUpper === '0') {
      correctIndex = 0;
    } else {
      // If user typed the exact text of one of the options
      const foundIdx = options.findIndex(opt => opt.toLowerCase() === rawAnswer.toLowerCase());
      if (foundIdx !== -1) {
        correctIndex = foundIdx;
      } else {
        const numVal = parseInt(rawAnswer, 10);
        if (!isNaN(numVal) && numVal >= 1 && numVal <= 4) {
          correctIndex = numVal - 1;
        } else {
          correctIndex = 0;
        }
      }
    }

    const questionItem: QuizQuestionItem = {
      id: `q-${Date.now()}-${r}-${Math.random().toString(36).substring(2, 6)}`,
      question: questionText,
      options,
      correctIndex,
      marks: 1
    };

    if (hindiQuestion) {
      questionItem.hindiQuestion = hindiQuestion;
    }
    if (explanation) {
      questionItem.explanation = explanation;
    }

    validQuestions.push(questionItem);
  }

  return {
    validQuestions,
    invalidRows,
    totalRows: rows.length - (hasHeader ? 1 : 0)
  };
}

/**
 * Generates a sample CSV template for download
 */
export function generateSampleCSV(): string {
  const headers = ['Question', 'Option1', 'Option2', 'Option3', 'Option4', 'Correct Index (1-4)', 'Explanation', 'Hindi Question'];
  const sampleRows = [
    [
      'What is the full form of CPU in computer basics?',
      'Central Processing Unit',
      'Central Performance Utility',
      'Core Programming Unit',
      'Computer Processing Universal',
      '1',
      'CPU stands for Central Processing Unit and is the brain of the computer.',
      'कंप्यूटर में सीपीयू (CPU) का पूरा नाम क्या है?'
    ],
    [
      'Which extension is used for Python source files?',
      '.pt',
      '.py',
      '.python',
      '.p',
      '2',
      'Python files use the standard .py file extension.',
      'पायथन सोर्स फाइल का एक्सटेंशन क्या होता है?'
    ],
    [
      'In LibreOffice Writer, what is the shortcut key to save a document?',
      'Ctrl + S',
      'Ctrl + P',
      'Ctrl + O',
      'Ctrl + V',
      '1',
      'Ctrl + S is the universal shortcut to save files in LibreOffice Writer.',
      'लिब्रेऑफिस राइटर में डॉक्यूमेंट सेव करने की शॉर्टकट कुंजी क्या है?'
    ],
    [
      'What is the maximum number of rows in LibreOffice Calc?',
      '65,536',
      '1,048,576',
      '500,000',
      '100,000',
      '2',
      'LibreOffice Calc spreadsheet supports up to 1,048,576 rows.',
      'लिब्रेऑफिस कैल्क (Calc) में अधिकतम कितनी पंक्तियाँ (Rows) होती हैं?'
    ],
    [
      'Which protocol is primarily used for secure web browsing?',
      'FTP',
      'HTTP',
      'HTTPS',
      'SMTP',
      '3',
      'HTTPS (HyperText Transfer Protocol Secure) provides encrypted web communication over SSL/TLS.',
      'सुरक्षित वेब ब्राउजिंग के लिए मुख्य रूप से किस प्रोटोकॉल का उपयोग किया जाता है?'
    ]
  ];

  const escapeCSV = (field: string) => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const csvLines = [
    headers.map(escapeCSV).join(','),
    ...sampleRows.map(row => row.map(escapeCSV).join(','))
  ];

  return csvLines.join('\n');
}
