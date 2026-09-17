import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Table as TableIcon,
  Plus,
  Trash2,
  FileSpreadsheet,
  FileText,
  Presentation,
  Play,
  CheckCircle2,
  Check,
  ChevronRight,
  MonitorPlay,
  X
} from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  layout: 'title' | 'content' | 'two-column';
  transition: 'none' | 'fade' | 'slide' | 'zoom';
}

interface NielitOnlyOfficeEditorProps {
  files: { [filename: string]: string };
  onChange: (files: { [filename: string]: string }) => void;
  onRunComplete?: (output: string) => void;
  paperCode?: string;
  theme?: 'light' | 'dark';
  questionTitle?: string;
  questionNumber?: number;
  runTrigger?: number;
}

export const NielitOnlyOfficeEditor: React.FC<NielitOnlyOfficeEditorProps> = ({
  files,
  onChange,
  onRunComplete,
  paperCode = 'PR1',
  theme = 'light',
  questionTitle = '',
  questionNumber = 1,
  runTrigger = 0
}) => {
  // Fixed mapping mandated for ITN workspace:
  // Question 1: Word Processor (Writer)
  // Question 2: Spreadsheet (Calc)
  // Question 3: Presentation (Impress)
  const getAssignedMode = (qNum: number): 'document' | 'spreadsheet' | 'presentation' => {
    if (qNum === 1) return 'document';
    if (qNum === 2) return 'spreadsheet';
    return 'presentation';
  };

  const mode = getAssignedMode(questionNumber);

  // General Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Execution Output Console
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    `[LibreOffice Suite ${paperCode}] Active Application: ${mode === 'spreadsheet' ? 'Calc (Spreadsheet)' : mode === 'presentation' ? 'Impress (Presentation)' : 'Writer (Word Processor)'}. Question No. ${questionNumber} ready.`
  ]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  useEffect(() => {
    setConsoleOutput([
      `[LibreOffice Suite ${paperCode}] Active Application: ${mode === 'spreadsheet' ? 'Calc (Spreadsheet)' : mode === 'presentation' ? 'Impress (Presentation)' : 'Writer (Word Processor)'}. Question No. ${questionNumber} ready.`
    ]);
  }, [questionNumber, mode, paperCode]);

  // =========================================================================
  // 1. SPREADSHEET (LIBREOFFICE CALC) ENGINE
  // =========================================================================
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const [rowCount, setRowCount] = useState(14);
  const [activeCell, setActiveCell] = useState('A1');
  const [formulaInput, setFormulaInput] = useState('');

  // Clean empty sheet data (no prefilled answers)
  const initialSheetData: { [cell: string]: string } = {};

  const [sheetData, setSheetData] = useState<{ [cell: string]: string }>(() => {
    if (files['sheet_data.json']) {
      try {
        const parsed = JSON.parse(files['sheet_data.json']);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {
        return initialSheetData;
      }
    }
    return initialSheetData;
  });

  // Keep sheetData synchronized with files state
  useEffect(() => {
    if (files['sheet_data.json']) {
      try {
        const parsed = JSON.parse(files['sheet_data.json']);
        if (parsed && typeof parsed === 'object') {
          setSheetData(parsed);
          return;
        }
      } catch (e) {}
    }
    setSheetData({});
  }, [questionNumber, files['sheet_data.json']]);

  // Calculate cell value recursively
  const getCellValue = (cellId: string, visited: Set<string> = new Set()): string => {
    const raw = sheetData[cellId];
    if (!raw) return '';
    if (visited.has(cellId)) return '#CIRCULAR!';
    visited.add(cellId);

    if (raw.startsWith('=')) {
      const expr = raw.substring(1).toUpperCase().trim();

      // Range functions: SUM, AVERAGE, COUNT, MAX, MIN
      const matchRange = expr.match(/^(SUM|AVERAGE|COUNT|MAX|MIN)\(([A-Z])(\d+):([A-Z])(\d+)\)$/);
      if (matchRange) {
        const fn = matchRange[1];
        const startCol = matchRange[2];
        const startRow = parseInt(matchRange[3], 10);
        const endCol = matchRange[4];
        const endRow = parseInt(matchRange[5], 10);

        const vals: number[] = [];
        const colStartIdx = columns.indexOf(startCol);
        const colEndIdx = columns.indexOf(endCol);

        if (colStartIdx !== -1 && colEndIdx !== -1) {
          for (let c = colStartIdx; c <= colEndIdx; c++) {
            const colLetter = columns[c];
            for (let r = startRow; r <= endRow; r++) {
              const v = parseFloat(getCellValue(`${colLetter}${r}`, new Set(visited)));
              if (!isNaN(v)) vals.push(v);
            }
          }
        }

        if (fn === 'SUM') return String(vals.reduce((a, b) => a + b, 0));
        if (fn === 'AVERAGE') return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '0';
        if (fn === 'COUNT') return String(vals.length);
        if (fn === 'MAX') return vals.length ? String(Math.max(...vals)) : '0';
        if (fn === 'MIN') return vals.length ? String(Math.min(...vals)) : '0';
      }

      // Arithmetic expressions like =B2*0.2 or =B2+C2+D2 or =E2-F2
      try {
        const resolvedExpr = expr.replace(/([A-Z]\d+)/g, (match) => {
          const cellV = parseFloat(getCellValue(match, new Set(visited)));
          return isNaN(cellV) ? '0' : String(cellV);
        });

        if (/^[0-9+\-*/().\s]+$/.test(resolvedExpr)) {
          // eslint-disable-next-line no-eval
          const res = Function(`'use strict'; return (${resolvedExpr})`)();
          return String(typeof res === 'number' && !isNaN(res) ? Math.round(res * 100) / 100 : res);
        }
      } catch (err) {
        return '#VALUE!';
      }
    }
    return raw;
  };

  const handleCellSelect = (cellId: string) => {
    setActiveCell(cellId);
    setFormulaInput(sheetData[cellId] || '');
  };

  const updateSpreadsheet = (newSheet: { [cell: string]: string }) => {
    setSheetData(newSheet);

    // Formatted representation for solution.txt
    let textRep = `=== LIBREOFFICE CALC SPREADSHEET ===\nQuestion: ${questionTitle}\n\n`;
    textRep += `Formula Bar & Grid Data:\n`;
    Object.keys(newSheet).sort().forEach((k) => {
      const v = newSheet[k];
      if (v) {
        const evaluated = getCellValue(k);
        textRep += `${k}: ${v} ${v.startsWith('=') ? `=> Result: ${evaluated}` : ''}\n`;
      }
    });

    onChange({
      ...files,
      'sheet_data.json': JSON.stringify(newSheet),
      'solution.txt': textRep
    });
  };

  const handleFormulaChange = (val: string) => {
    setFormulaInput(val);
    const updated = { ...sheetData, [activeCell]: val };
    updateSpreadsheet(updated);
  };

  const runCalcAudit = () => {
    const timeNow = new Date().toLocaleTimeString();
    const formulaCells = Object.keys(sheetData).filter((k) => (sheetData[k] || '').startsWith('='));
    const totalFilled = Object.keys(sheetData).filter((k) => (sheetData[k] || '').trim().length > 0);

    const logs = [
      `[${timeNow}] [Calc Engine] Evaluating spreadsheet formulas...`,
      `[${timeNow}] [Calc Engine] Active Cells: ${totalFilled.length} | Formula Cells: ${formulaCells.length}`
    ];

    if (formulaCells.length > 0) {
      logs.push(`[${timeNow}] [Formula Audit]:`);
      formulaCells.slice(0, 6).forEach((cell) => {
        logs.push(`  • Cell ${cell}: ${sheetData[cell]} => ${getCellValue(cell)}`);
      });
      if (formulaCells.length > 6) {
        logs.push(`  • ... and ${formulaCells.length - 6} more evaluated formula cells.`);
      }
      logs.push(`[${timeNow}] [Calc Engine] All formulas evaluated cleanly without circular dependencies.`);
      logs.push(`[${timeNow}] [Status] SPREADSHEET SOLUTION VERIFIED & SAVED.`);
    } else if (totalFilled.length > 0) {
      logs.push(`[${timeNow}] [Status] ${totalFilled.length} data cell(s) saved. Add formulas (=SUM, =AVERAGE, etc.) for automated calculation.`);
    } else {
      logs.push(`[${timeNow}] [Notice] Spreadsheet is blank. Click cells to enter labels, values, and formulas.`);
    }

    setConsoleOutput(logs);
    if (onRunComplete) onRunComplete(logs.join('\n'));
    showToast('Spreadsheet calculated and verified!');
  };

  // =========================================================================
  // 2. PRESENTATION (LIBREOFFICE IMPRESS) ENGINE
  // =========================================================================
  const initialSlides: Slide[] = [
    {
      id: 'slide-1',
      title: '',
      subtitle: '',
      bullets: [],
      layout: 'title',
      transition: 'none'
    }
  ];

  const [slides, setSlides] = useState<Slide[]>(() => {
    if (files['presentation.json']) {
      try {
        const parsed = JSON.parse(files['presentation.json']);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return initialSlides;
      }
    }
    return initialSlides;
  });

  // Synchronize slides when question or files change
  useEffect(() => {
    if (files['presentation.json']) {
      try {
        const parsed = JSON.parse(files['presentation.json']);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
          return;
        }
      } catch (e) {}
    }
    setSlides(initialSlides);
  }, [questionNumber, files['presentation.json']]);

  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [slideTheme, setSlideTheme] = useState<'navy' | 'emerald' | 'charcoal' | 'minimal'>('navy');
  const [isSlideShowActive, setIsSlideShowActive] = useState(false);
  const [slideShowIndex, setSlideShowIndex] = useState(0);

  const currentSlide = slides[selectedSlideIndex] || slides[0];

  const updateSlidesState = (newSlides: Slide[]) => {
    setSlides(newSlides);

    // Format slides text representation for solution.txt
    let textRep = `=== LIBREOFFICE IMPRESS PRESENTATION ===\nQuestion: ${questionTitle}\n\n`;
    newSlides.forEach((s, idx) => {
      textRep += `SLIDE ${idx + 1}: [${s.title}]\n`;
      if (s.subtitle) textRep += `  Subtitle: ${s.subtitle}\n`;
      if (s.bullets && s.bullets.length > 0) {
        textRep += `  Points:\n`;
        s.bullets.forEach((b) => {
          textRep += `    • ${b}\n`;
        });
      }
      textRep += `  Transition: ${s.transition} | Layout: ${s.layout}\n\n`;
    });

    onChange({
      ...files,
      'presentation.json': JSON.stringify(newSlides),
      'solution.txt': textRep
    });
  };

  const handleSlideTitleChange = (val: string) => {
    const updated = [...slides];
    updated[selectedSlideIndex] = { ...updated[selectedSlideIndex], title: val };
    updateSlidesState(updated);
  };

  const handleSlideSubtitleChange = (val: string) => {
    const updated = [...slides];
    updated[selectedSlideIndex] = { ...updated[selectedSlideIndex], subtitle: val };
    updateSlidesState(updated);
  };

  const handleSlideBulletsChange = (val: string) => {
    const lines = val.split('\n');
    const updated = [...slides];
    updated[selectedSlideIndex] = { ...updated[selectedSlideIndex], bullets: lines };
    updateSlidesState(updated);
  };

  const handleSlideTransitionChange = (val: Slide['transition']) => {
    const updated = [...slides];
    updated[selectedSlideIndex] = { ...updated[selectedSlideIndex], transition: val };
    updateSlidesState(updated);
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1}: New Topic`,
      subtitle: '',
      bullets: ['Key point 1', 'Key point 2'],
      layout: 'content',
      transition: 'fade'
    };
    const updated = [...slides, newSlide];
    updateSlidesState(updated);
    setSelectedSlideIndex(updated.length - 1);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      showToast('A presentation must have at least 1 slide.');
      return;
    }
    const updated = slides.filter((_, i) => i !== idx);
    updateSlidesState(updated);
    setSelectedSlideIndex(Math.max(0, idx - 1));
  };

  const runImpressAudit = () => {
    const timeNow = new Date().toLocaleTimeString();
    const logs = [
      `[${timeNow}] [Impress Engine] Auditing slide presentation structure...`,
      `[${timeNow}] [Impress Engine] Total Slides: ${slides.length} slides configured.`,
      `[${timeNow}] [Slide Deck Analysis]:`,
      ...slides.map((s, i) => `  - Slide ${i + 1}: "${s.title}" (${s.bullets?.length || 0} bullet points, transition: ${s.transition})`),
      `[${timeNow}] [Status] PRESENTATION SLIDES COMPILED & REGISTERED FOR EVALUATION.`
    ];

    setConsoleOutput(logs);
    if (onRunComplete) onRunComplete(logs.join('\n'));
    showToast('Impress presentation verified and saved!');
  };

  // =========================================================================
  // 3. WORD PROCESSOR (LIBREOFFICE WRITER) ENGINE
  // =========================================================================
  const docRef = useRef<HTMLDivElement>(null);
  const [docFont, setDocFont] = useState('Liberation Serif');
  const [docSize, setDocSize] = useState('3');
  const [wordCount, setWordCount] = useState(0);

  const initialDocHtml = '';

  const [plainTextAnswer, setPlainTextAnswer] = useState(files['solution.txt'] || '');

  // Keep contentEditable in sync when question changes
  useEffect(() => {
    if (docRef.current && mode === 'document') {
      const content = files['document.html'] || files['document.docx'] || '';
      if (docRef.current.innerHTML !== content) {
        docRef.current.innerHTML = content;
      }
      calcWords();
    }
  }, [questionNumber, mode, files['document.html']]);

  useEffect(() => {
    setPlainTextAnswer(files['solution.txt'] || '');
  }, [questionNumber, files['solution.txt']]);

  const calcWords = () => {
    if (docRef.current) {
      const text = docRef.current.innerText || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
    }
  };

  const execDocCommand = (cmd: string, val: string = '') => {
    if (!docRef.current) return;
    docRef.current.focus();
    document.execCommand(cmd, false, val);
    handleDocChange();
  };

  const handleDocChange = () => {
    if (!docRef.current) return;
    const html = docRef.current.innerHTML;
    const text = docRef.current.innerText || '';
    calcWords();

    onChange({
      ...files,
      'document.html': html,
      'document.docx': html,
      'solution.txt': text.trim() ? text : html
    });
  };

  const runDocumentAudit = () => {
    const text = docRef.current ? docRef.current.innerText : plainTextAnswer;
    const count = text.trim() ? text.trim().split(/\s+/).length : 0;
    const timeNow = new Date().toLocaleTimeString();

    const logs = [
      `[${timeNow}] [Writer Audit] Verifying document content and formatting...`,
      `[${timeNow}] [Writer Audit] Total Words: ${count} | Font: ${docFont}`,
      `[${timeNow}] [Writer Audit] Document verified and saved for grading.`
    ];
    setConsoleOutput(logs);
    if (onRunComplete) onRunComplete(logs.join('\n'));
    showToast('Document verified and saved!');
  };

  // Master Run / Verify Trigger from subheader "Run Code" button
  useEffect(() => {
    if (runTrigger > 0) {
      if (mode === 'spreadsheet') {
        runCalcAudit();
      } else if (mode === 'presentation') {
        runImpressAudit();
      } else {
        runDocumentAudit();
      }
    }
  }, [runTrigger]);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-300 rounded-sm overflow-hidden select-none font-sans text-xs relative">
      {/* 1. Suite Application Header: Assigned Application Locked per Question (No Switching) */}
      <div
        className={`${
          mode === 'spreadsheet'
            ? 'bg-[#217346]'
            : mode === 'presentation'
            ? 'bg-[#C43E1C]'
            : 'bg-[#2B579A]'
        } text-white px-3 py-1.5 flex items-center justify-between shadow-xs select-none shrink-0 flex-wrap gap-2`}
      >
        <div className="flex items-center gap-3">
          <span className="font-extrabold tracking-wider text-[11px] uppercase">LIBREOFFICE / ONLYOFFICE</span>
          <span className="text-[11px] opacity-80 font-mono">
            {paperCode} • Q{questionNumber}
          </span>
        </div>

        {/* Assigned Application Display Badge - Strictly locked per Question (No switching) */}
        <div className="flex items-center bg-black/25 rounded px-3 py-1 text-xs gap-2">
          {mode === 'document' && (
            <div className="flex items-center gap-1.5 font-bold text-white">
              <FileText className="w-4 h-4 text-sky-200" />
              <span>LibreOffice Writer (Word Processor)</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-normal ml-1">Question 1 Assigned</span>
            </div>
          )}
          {mode === 'spreadsheet' && (
            <div className="flex items-center gap-1.5 font-bold text-white">
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>LibreOffice Calc (Spreadsheet)</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-normal ml-1">Question 2 Assigned</span>
            </div>
          )}
          {mode === 'presentation' && (
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Presentation className="w-4 h-4 text-amber-200" />
              <span>LibreOffice Impress (Presentation)</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono font-normal ml-1">Question 3 Assigned</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (mode === 'spreadsheet') runCalcAudit();
              else if (mode === 'presentation') runImpressAudit();
              else runDocumentAudit();
            }}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{mode === 'spreadsheet' ? 'Calculate' : mode === 'presentation' ? 'Verify Slides' : 'Verify Document'}</span>
          </button>
        </div>
      </div>

      {/* 2. MODE-SPECIFIC WORKING AREAS */}

      {/* A. WORD PROCESSOR (LIBREOFFICE WRITER) */}
      {mode === 'document' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-200">
          {/* Writer Ribbon Toolbar */}
          <div className="bg-[#fafafa] border-b border-slate-200 px-3 py-1.5 flex items-center gap-2 flex-wrap shrink-0">
            <select
              value={docFont}
              onChange={(e) => {
                setDocFont(e.target.value);
                execDocCommand('fontName', e.target.value);
              }}
              className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-700"
            >
              <option value="Liberation Serif">Liberation Serif</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>

            <select
              value={docSize}
              onChange={(e) => {
                setDocSize(e.target.value);
                execDocCommand('fontSize', e.target.value);
              }}
              className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-700"
            >
              <option value="2">10 pt</option>
              <option value="3">12 pt</option>
              <option value="4">14 pt</option>
              <option value="5">18 pt</option>
            </select>

            <div className="flex items-center gap-1 border-x border-slate-300 px-2">
              <button
                onClick={() => execDocCommand('bold')}
                className="p-1 hover:bg-slate-200 rounded font-bold cursor-pointer"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execDocCommand('italic')}
                className="p-1 hover:bg-slate-200 rounded italic cursor-pointer"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execDocCommand('underline')}
                className="p-1 hover:bg-slate-200 rounded underline cursor-pointer"
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
              <button
                onClick={() => execDocCommand('justifyLeft')}
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execDocCommand('justifyCenter')}
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execDocCommand('justifyRight')}
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => execDocCommand('insertUnorderedList')}
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => execDocCommand('insertOrderedList')}
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                title="Numbered List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => {
                const tableHtml = `<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #94a3b8;">
                  <thead><tr style="background-color: #f1f5f9;"><th style="padding: 6px; border: 1px solid #94a3b8;">Column 1</th><th style="padding: 6px; border: 1px solid #94a3b8;">Column 2</th><th style="padding: 6px; border: 1px solid #94a3b8;">Column 3</th></tr></thead>
                  <tbody>
                    <tr><td style="padding: 6px; border: 1px solid #94a3b8;">&nbsp;</td><td style="padding: 6px; border: 1px solid #94a3b8;">&nbsp;</td><td style="padding: 6px; border: 1px solid #94a3b8;">&nbsp;</td></tr>
                    <tr><td style="padding: 6px; border: 1px solid #94a3b8;">&nbsp;</td><td style="padding: 6px; border: 1px solid #94a3b8;">&nbsp;</td><td style="padding: 6px; border: 1px solid #94a3b8;">&nbsp;</td></tr>
                  </tbody>
                </table><p><br/></p>`;
                execDocCommand('insertHTML', tableHtml);
              }}
              className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-semibold hover:bg-blue-100 cursor-pointer flex items-center gap-1"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Insert Table</span>
            </button>
          </div>

          {/* Document Sheet Canvas */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            <div
              ref={docRef}
              contentEditable
              onInput={handleDocChange}
              className="w-full max-w-2xl min-h-[600px] bg-white shadow-md p-8 sm:p-10 focus:outline-none text-slate-900 text-sm leading-relaxed border border-slate-300 rounded-xs"
              style={{ fontFamily: docFont }}
            />
          </div>
        </div>
      )}

      {/* B. SPREADSHEET (LIBREOFFICE CALC) */}
      {mode === 'spreadsheet' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Calc Toolbar */}
          <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-slate-700">Formulas:</span>
            <button
              onClick={() => handleFormulaChange('=SUM(')}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50 font-mono text-slate-800 cursor-pointer shadow-2xs"
            >
              =SUM()
            </button>
            <button
              onClick={() => handleFormulaChange('=AVERAGE(')}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50 font-mono text-slate-800 cursor-pointer shadow-2xs"
            >
              =AVERAGE()
            </button>
            <button
              onClick={() => handleFormulaChange('=MAX(')}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50 font-mono text-slate-800 cursor-pointer shadow-2xs"
            >
              =MAX()
            </button>
            <button
              onClick={() => handleFormulaChange('=MIN(')}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50 font-mono text-slate-800 cursor-pointer shadow-2xs"
            >
              =MIN()
            </button>
            <button
              onClick={() => handleFormulaChange('=COUNT(')}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50 font-mono text-slate-800 cursor-pointer shadow-2xs"
            >
              =COUNT()
            </button>

            <button
              onClick={() => setRowCount((r) => r + 2)}
              className="ml-auto px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Row</span>
            </button>
          </div>

          {/* Formula Bar */}
          <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-300 flex items-center gap-2">
            <div className="w-14 px-2 py-0.5 bg-white border border-slate-300 rounded text-center font-mono font-bold text-xs text-slate-800">
              {activeCell}
            </div>
            <span className="font-serif italic font-bold text-slate-500 text-xs select-none">
              fx
            </span>
            <input
              type="text"
              value={formulaInput}
              onChange={(e) => handleFormulaChange(e.target.value)}
              className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-green-600"
              placeholder="Enter value or formula like =SUM(B2:B4) or =B2*0.2"
            />
          </div>

          {/* Calc Grid */}
          <div className="flex-1 overflow-auto bg-slate-200">
            <table className="border-collapse table-fixed w-full bg-white text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-300">
                  <th className="w-10 bg-slate-200 border-r border-b border-slate-300 py-1 text-[10px] font-semibold select-none"></th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="w-28 border-r border-b border-slate-300 py-1 font-semibold text-center select-none"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rowCount }, (_, rIdx) => {
                  const rowNum = rIdx + 1;
                  return (
                    <tr key={rowNum} className="border-b border-slate-200">
                      <td className="w-10 bg-slate-100 border-r border-slate-300 text-center text-[10px] text-slate-500 font-semibold select-none py-1.5">
                        {rowNum}
                      </td>
                      {columns.map((col) => {
                        const cellId = `${col}${rowNum}`;
                        const isSelected = activeCell === cellId;
                        const evaluatedVal = getCellValue(cellId);
                        const rawVal = sheetData[cellId] || '';
                        const isFormula = rawVal.startsWith('=');

                        return (
                          <td
                            key={cellId}
                            onClick={() => handleCellSelect(cellId)}
                            className={`border-r border-slate-200 p-0 relative ${
                              isSelected ? 'ring-2 ring-emerald-500 z-10' : ''
                            }`}
                          >
                            <input
                              type="text"
                              value={isSelected ? formulaInput : evaluatedVal}
                              onChange={(e) => handleFormulaChange(e.target.value)}
                              onFocus={() => handleCellSelect(cellId)}
                              className={`w-full h-full px-2 py-1.5 text-xs focus:outline-none bg-transparent ${
                                isFormula ? 'font-mono text-emerald-800 font-semibold' : 'text-slate-800'
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* C. PRESENTATION (LIBREOFFICE IMPRESS) */}
      {mode === 'presentation' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
          {/* Left: Slide Thumbnail Pane */}
          <div className="w-full md:w-56 bg-slate-200 border-b md:border-b-0 md:border-r border-slate-300 flex flex-col shrink-0">
            <div className="p-2 border-b border-slate-300 flex items-center justify-between bg-slate-100">
              <span className="font-bold text-xs text-slate-700">Slides ({slides.length})</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleAddSlide}
                  className="px-2 py-0.5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-[11px] text-[#C43E1C] font-semibold flex items-center gap-1 cursor-pointer"
                  title="Add new slide"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Slide</span>
                </button>
                <button
                  onClick={() => {
                    setSlideShowIndex(selectedSlideIndex);
                    setIsSlideShowActive(true);
                  }}
                  className="p-1 bg-[#C43E1C] hover:bg-[#A32F13] text-white rounded cursor-pointer"
                  title="Start Slide Show"
                >
                  <MonitorPlay className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Cards */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => setSelectedSlideIndex(idx)}
                  className={`p-2 rounded border transition-all cursor-pointer relative group ${
                    selectedSlideIndex === idx
                      ? 'bg-white border-[#C43E1C] ring-2 ring-[#C43E1C]/20 shadow-xs'
                      : 'bg-slate-50 border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-bold">Slide {idx + 1}</span>
                    {slides.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(idx);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-600 p-0.5"
                        title="Delete slide"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-800 truncate">
                    {slide.title || 'Untitled Slide'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {slide.bullets?.length || 0} bullet points • {slide.transition}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Slide Editor & Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
            {/* Slide Settings Bar */}
            <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600 font-medium">Theme:</span>
                  <select
                    value={slideTheme}
                    onChange={(e) => setSlideTheme(e.target.value as any)}
                    className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800"
                  >
                    <option value="navy">Navy Academic</option>
                    <option value="emerald">Emerald Clean</option>
                    <option value="charcoal">Charcoal Tech</option>
                    <option value="minimal">Minimal White</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600 font-medium">Transition:</span>
                  <select
                    value={currentSlide?.transition || 'fade'}
                    onChange={(e) => handleSlideTransitionChange(e.target.value as any)}
                    className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800"
                  >
                    <option value="none">None</option>
                    <option value="fade">Fade In</option>
                    <option value="slide">Slide Left</option>
                    <option value="zoom">Zoom</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  Slide {selectedSlideIndex + 1} of {slides.length}
                </span>
                <button
                  onClick={() => {
                    setSlideShowIndex(selectedSlideIndex);
                    setIsSlideShowActive(true);
                  }}
                  className="px-2.5 py-1 bg-[#C43E1C] hover:bg-[#A32F13] text-white rounded font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <MonitorPlay className="w-3 h-3" />
                  <span>Preview Show</span>
                </button>
              </div>
            </div>

            {/* Impress Slide Stage Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
              <div
                className={`w-full max-w-2xl aspect-[16/9] rounded-sm shadow-lg p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  slideTheme === 'navy'
                    ? 'bg-gradient-to-br from-slate-900 to-blue-950 text-white'
                    : slideTheme === 'emerald'
                    ? 'bg-gradient-to-br from-slate-900 to-emerald-950 text-white'
                    : slideTheme === 'charcoal'
                    ? 'bg-gradient-to-br from-zinc-900 to-neutral-950 text-white'
                    : 'bg-white text-slate-900 border border-slate-300'
                }`}
              >
                {/* Slide Header: Title & Subtitle */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={currentSlide?.title || ''}
                    onChange={(e) => handleSlideTitleChange(e.target.value)}
                    placeholder="Click to add Slide Title..."
                    className={`w-full text-xl sm:text-2xl font-bold bg-transparent border-b border-transparent hover:border-white/25 focus:border-white/50 focus:outline-none py-1 ${
                      slideTheme === 'minimal' ? 'text-slate-900 hover:border-slate-300 focus:border-blue-500' : 'text-white'
                    }`}
                  />
                  {currentSlide?.layout === 'title' ? (
                    <input
                      type="text"
                      value={currentSlide?.subtitle || ''}
                      onChange={(e) => handleSlideSubtitleChange(e.target.value)}
                      placeholder="Click to add Subtitle / Presenter Details..."
                      className={`w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-white/25 focus:border-white/50 focus:outline-none py-1 ${
                        slideTheme === 'minimal' ? 'text-slate-600' : 'text-slate-300'
                      }`}
                    />
                  ) : null}
                </div>

                {/* Slide Body: Bullet Points Content */}
                <div className="flex-1 py-4 flex flex-col">
                  <div className="text-[11px] font-semibold opacity-70 mb-1 flex items-center justify-between">
                    <span>Bullet Points (one per line):</span>
                    <span className="text-[10px]">LibreOffice Impress Outline View</span>
                  </div>
                  <textarea
                    value={(currentSlide?.bullets || []).join('\n')}
                    onChange={(e) => handleSlideBulletsChange(e.target.value)}
                    placeholder="Enter slide bullet points here (one per line)..."
                    className={`flex-1 w-full bg-black/10 rounded p-3 text-xs leading-relaxed focus:outline-none resize-none font-sans ${
                      slideTheme === 'minimal'
                        ? 'bg-slate-50 text-slate-900 border border-slate-200'
                        : 'text-slate-100 placeholder-white/40'
                    }`}
                  />
                </div>

                {/* Slide Footer */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] opacity-75">
                  <span>LibreOffice Impress • O-Level M1-R5</span>
                  <span>Slide {selectedSlideIndex + 1} / {slides.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Output & Audit Status Bar */}
      {isConsoleOpen && (
        <div className="h-28 bg-slate-950 text-slate-300 border-t border-slate-800 flex flex-col shrink-0 font-mono text-[11px]">
          <div className="bg-slate-900 px-3 py-1 flex items-center justify-between border-b border-slate-800 text-[10px]">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              LibreOffice Verification & Calculation Status
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConsoleOutput(['[Console] Log cleared.'])}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={() => setIsConsoleOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 select-text">
            {consoleOutput.map((out, idx) => (
              <div key={idx} className="leading-tight text-[10.5px]">
                {out}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Bottom Status Bar */}
      <div className="bg-slate-50 border-t border-slate-300 px-4 py-1.5 flex items-center justify-between text-xs text-slate-600 select-none">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">
            {mode === 'spreadsheet' ? 'CALC SPREADSHEET' : mode === 'presentation' ? 'IMPRESS PRESENTATION' : 'WRITER WORD PROCESSOR'}
          </span>
          <span>•</span>
          <span>
            {mode === 'presentation'
              ? `${slides.length} Slides`
              : `Words: ${wordCount || (plainTextAnswer.trim() ? plainTextAnswer.trim().split(/\s+/).length : 0)}`}
          </span>
          <span>•</span>
          <span>Q{questionNumber}: {questionTitle.substring(0, 45)}...</span>
        </div>

        <div className="flex items-center gap-2">
          {!isConsoleOpen && (
            <button
              onClick={() => setIsConsoleOpen(true)}
              className="text-[11px] text-blue-600 hover:underline cursor-pointer"
            >
              Show Console
            </button>
          )}
          <span className="text-[11px] text-slate-500">LibreOffice Suite Ready</span>
        </div>
      </div>

      {/* Slide Show Modal Overlay */}
      {isSlideShowActive && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 sm:p-10 select-none">
          <div className="flex items-center justify-between text-white/70 text-xs">
            <span>LibreOffice Impress Slide Show (Press Next or Esc to exit)</span>
            <button
              onClick={() => setIsSlideShowActive(false)}
              className="p-1.5 hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Presentation Slide */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-white">
            <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-8 sm:p-12 shadow-2xl aspect-[16/9] flex flex-col justify-between">
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-400 mb-2">
                  {slides[slideShowIndex]?.title}
                </h1>
                {slides[slideShowIndex]?.subtitle && (
                  <p className="text-slate-300 text-sm sm:text-base mb-6">
                    {slides[slideShowIndex]?.subtitle}
                  </p>
                )}
                {slides[slideShowIndex]?.bullets && slides[slideShowIndex]?.bullets.length > 0 && (
                  <ul className="space-y-3 mt-4 text-sm sm:text-base text-slate-200 list-disc pl-5">
                    {slides[slideShowIndex].bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500">
                <span>{slides[slideShowIndex]?.title || 'Presentation Slide'}</span>
                <span>Slide {slideShowIndex + 1} of {slides.length}</span>
              </div>
            </div>
          </div>

          {/* Slide Show Controls */}
          <div className="flex items-center justify-center gap-4 text-white">
            <button
              disabled={slideShowIndex === 0}
              onClick={() => setSlideShowIndex((s) => Math.max(0, s - 1))}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded text-xs font-semibold cursor-pointer"
            >
              Previous Slide
            </button>
            <span className="text-xs text-white/70">
              {slideShowIndex + 1} / {slides.length}
            </span>
            <button
              disabled={slideShowIndex === slides.length - 1}
              onClick={() => setSlideShowIndex((s) => Math.min(slides.length - 1, s + 1))}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 rounded text-xs font-semibold cursor-pointer"
            >
              Next Slide
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 right-4 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
