import { ChapterMcqItem } from '../types/chapterMcq';
import { parseCSVToRows } from './csvParser';

export interface ParsedChapterMcqResult {
  validQuestions: ChapterMcqItem[];
  invalidRows: { rowNumber: number; raw: string[]; reason: string }[];
  totalRows: number;
}

export function parseChapterQuestionsCSV(
  csvText: string,
  fallbackModule: 'm1-r5' | 'm2-r5' | 'm3-r5' | 'm4-r5' | 'ccc' = 'm1-r5',
  fallbackChapter: number = 1
): ParsedChapterMcqResult {
  const rows = parseCSVToRows(csvText);
  if (rows.length === 0) {
    return { validQuestions: [], invalidRows: [], totalRows: 0 };
  }

  const validQuestions: ChapterMcqItem[] = [];
  const invalidRows: { rowNumber: number; raw: string[]; reason: string }[] = [];

  let headerRowIndex = -1;
  let hasHeaders = false;

  // Header detection
  const firstRow = rows[0].map(c => c.toLowerCase().replace(/[^a-z0-9]/g, ''));
  if (
    firstRow.some(c => c.includes('question') || c.includes('prashna') || c.includes('option') || c.includes('ans'))
  ) {
    headerRowIndex = 0;
    hasHeaders = true;
  }

  const startIndex = hasHeaders ? headerRowIndex + 1 : 0;

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    if (row.length === 0 || (row.length === 1 && !row[0].trim())) {
      continue;
    }

    let moduleId: 'm1-r5' | 'm2-r5' | 'm3-r5' | 'm4-r5' | 'ccc' = fallbackModule;
    let chapterNum: number = fallbackChapter;
    let question = '';
    let hindiQuestion = '';
    let optA = '';
    let optB = '';
    let optC = '';
    let optD = '';
    let correctRaw = '';
    let explanation = '';
    let hindiExplanation = '';

    // Standard Full Schema (9-11 Columns):
    // Module, Chapter, Question, HindiQuestion, OptA, OptB, OptC, OptD, Correct, Explanation, HindiExplanation
    if (row.length >= 9 && (row[0].toLowerCase().includes('m') || row[0].toLowerCase().includes('ccc'))) {
      const modRaw = row[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (modRaw.includes('m1')) moduleId = 'm1-r5';
      else if (modRaw.includes('m2')) moduleId = 'm2-r5';
      else if (modRaw.includes('m3')) moduleId = 'm3-r5';
      else if (modRaw.includes('m4')) moduleId = 'm4-r5';
      else if (modRaw.includes('ccc')) moduleId = 'ccc';

      const chParsed = parseInt(row[1], 10);
      if (!isNaN(chParsed) && chParsed > 0) {
        chapterNum = chParsed;
      }

      question = row[2]?.trim() || '';
      hindiQuestion = row[3]?.trim() || '';
      optA = row[4]?.trim() || '';
      optB = row[5]?.trim() || '';
      optC = row[6]?.trim() || '';
      optD = row[7]?.trim() || '';
      correctRaw = row[8]?.trim() || '';
      explanation = row[9]?.trim() || '';
      hindiExplanation = row[10]?.trim() || '';
    } 
    // Compact Schema (6-8 Columns):
    // Question, OptA, OptB, OptC, OptD, Correct, Explanation, HindiQuestion
    else if (row.length >= 6) {
      question = row[0]?.trim() || '';
      optA = row[1]?.trim() || '';
      optB = row[2]?.trim() || '';
      optC = row[3]?.trim() || '';
      optD = row[4]?.trim() || '';
      correctRaw = row[5]?.trim() || '';
      explanation = row[6]?.trim() || '';
      hindiQuestion = row[7]?.trim() || '';
    } else {
      invalidRows.push({
        rowNumber: rowNum,
        raw: row,
        reason: `Insufficient columns (${row.length} found, minimum 6 required).`
      });
      continue;
    }

    if (!question) {
      invalidRows.push({
        rowNumber: rowNum,
        raw: row,
        reason: 'Question text is empty.'
      });
      continue;
    }

    if (!optA || !optB) {
      invalidRows.push({
        rowNumber: rowNum,
        raw: row,
        reason: 'At least Option A and Option B must be present.'
      });
      continue;
    }

    // Parse Correct Index (supports 'A','B','C','D', '1','2','3','4', '0','1','2','3')
    let correctIndex = 0;
    const cleanCorrect = correctRaw.trim().toUpperCase();

    if (cleanCorrect === 'A' || cleanCorrect === '1' || cleanCorrect === 'OPT1' || cleanCorrect === 'OPTION A') {
      correctIndex = 0;
    } else if (cleanCorrect === 'B' || cleanCorrect === '2' || cleanCorrect === 'OPT2' || cleanCorrect === 'OPTION B') {
      correctIndex = 1;
    } else if (cleanCorrect === 'C' || cleanCorrect === '3' || cleanCorrect === 'OPT3' || cleanCorrect === 'OPTION C') {
      correctIndex = 2;
    } else if (cleanCorrect === 'D' || cleanCorrect === '4' || cleanCorrect === 'OPT4' || cleanCorrect === 'OPTION D') {
      correctIndex = 3;
    } else {
      const num = parseInt(cleanCorrect, 10);
      if (!isNaN(num)) {
        if (num >= 1 && num <= 4) correctIndex = num - 1;
        else if (num >= 0 && num <= 3) correctIndex = num;
      }
    }

    const item: ChapterMcqItem = {
      id: `mcq-csv-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      moduleId,
      chapterNumber: chapterNum,
      question,
      options: [optA, optB, optC || 'None of the above', optD || 'All of the above'],
      correctIndex,
      explanation: explanation || undefined,
      hindiQuestion: hindiQuestion || undefined,
      hindiExplanation: hindiExplanation || undefined,
      createdAt: Date.now()
    };

    validQuestions.push(item);
  }

  return {
    validQuestions,
    invalidRows,
    totalRows: rows.length - (hasHeaders ? 1 : 0)
  };
}

export function generateChapterSampleCSV(moduleId: string = 'm1-r5', chapterNumber: number = 1): string {
  const headers = [
    'Module',
    'Chapter',
    'Question_English',
    'Question_Hindi',
    'Option_A',
    'Option_B',
    'Option_C',
    'Option_D',
    'Correct_Option',
    'Explanation_English',
    'Explanation_Hindi'
  ];

  const sampleRows = [
    [
      moduleId,
      chapterNumber.toString(),
      'Which component of a computer is called its brain?',
      'कंप्यूटर का मस्तिष्क किसे कहा जाता है?',
      'Arithmetic Logic Unit (ALU)',
      'Central Processing Unit (CPU)',
      'Random Access Memory (RAM)',
      'Control Unit',
      'B',
      'CPU executes instructions and coordinates computer functions.',
      'सीपीयू कंप्यूटर के सभी निर्देशों को निष्पादित करता है।'
    ],
    [
      moduleId,
      chapterNumber.toString(),
      'What is the default file extension of LibreOffice Writer?',
      'लिब्रेऑफिस राइटर का डिफॉल्ट फाइल एक्सटेंशन क्या है?',
      '.docx',
      '.odt',
      '.ods',
      '.odp',
      'B',
      '.odt stands for OpenDocument Text, the default open standard format.',
      '.odt लिब्रेऑफिस राइटर का ओपन डॉक्यूमेंट टेक्स्ट फॉर्मेट है।'
    ],
    [
      moduleId,
      chapterNumber.toString(),
      'Which memory is volatile in nature?',
      'इनमें से कौन सी मेमोरी वोलेटाइल (अस्थायी) होती है?',
      'ROM',
      'RAM',
      'Hard Disk',
      'Flash Drive',
      'B',
      'RAM loses its data when electrical power is switched off.',
      'रैम में बिजली बंद होने पर डेटा नष्ट हो जाता है।'
    ]
  ];

  const csvLines = [
    headers.map(h => `"${h}"`).join(','),
    ...sampleRows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
  ];

  return csvLines.join('\n');
}
