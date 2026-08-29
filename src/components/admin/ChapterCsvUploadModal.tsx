import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Trash2, 
  HelpCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { ChapterMcqItem } from '../../types/chapterMcq';
import { parseChapterQuestionsCSV, generateChapterSampleCSV, ParsedChapterMcqResult } from '../../utils/chapterCsvParser';

interface ChapterCsvUploadModalProps {
  moduleId: 'm1-r5' | 'm2-r5' | 'm3-r5' | 'm4-r5' | 'ccc';
  chapterNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onImportQuestions: (questions: ChapterMcqItem[], replaceExisting: boolean) => Promise<void>;
}

export function ChapterCsvUploadModal({
  moduleId,
  chapterNumber,
  isOpen,
  onClose,
  onImportQuestions
}: ChapterCsvUploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [fileName, setFileName] = useState<string>('');
  const [csvContent, setCsvContent] = useState<string>('');
  const [parsedResult, setParsedResult] = useState<ParsedChapterMcqResult | null>(null);
  const [replaceExisting, setReplaceExisting] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessCsvText = (text: string, name?: string) => {
    setCsvContent(text);
    if (name) setFileName(name);
    const result = parseChapterQuestionsCSV(text, moduleId, chapterNumber);
    setParsedResult(result);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleProcessCsvText(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleProcessCsvText(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const sample = generateChapterSampleCSV(moduleId, chapterNumber);
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `skilldotpy_${moduleId}_chapter_${chapterNumber}_mcqs_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = async () => {
    if (!parsedResult || parsedResult.validQuestions.length === 0) return;
    setIsProcessing(true);
    try {
      await onImportQuestions(parsedResult.validQuestions, replaceExisting);
      onClose();
    } catch (err) {
      console.error('Failed to import MCQs:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFileName('');
    setCsvContent('');
    setParsedResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/50 rounded-lg border border-blue-400/30">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">Upload Chapter MCQs via CSV</h3>
              <p className="text-xs text-blue-200">
                Target: <strong>{moduleId.toUpperCase()}</strong> • Chapter <strong>{chapterNumber}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Quick Helper & Template Download */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <p className="font-bold text-slate-900">Recommended CSV Columns:</p>
                <p className="text-slate-600 mt-0.5">
                  <code>Module, Chapter, Question, HindiQuestion, OptA, OptB, OptC, OptD, Correct(A/B/C/D), Explanation, HindiExplanation</code>
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 rounded-lg text-xs font-bold shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-4 border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Upload File (.csv)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`py-2 px-4 border-b-2 transition-colors ${
                activeTab === 'paste'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Paste CSV Content Directly
            </button>
          </div>

          {/* File Upload Mode */}
          {activeTab === 'upload' && (
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                    : fileName
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {fileName ? (
                  <div className="flex flex-col items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    <p className="font-bold text-sm">{fileName}</p>
                    <p className="text-xs text-slate-500">Click or drag another file to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-sm text-slate-800">
                      Drag & Drop your CSV file here, or <span className="text-blue-600 underline">Browse</span>
                    </p>
                    <p className="text-xs text-slate-400">Supports standard UTF-8 CSV exported from Excel or Google Sheets</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Paste CSV Mode */}
          {activeTab === 'paste' && (
            <div>
              <textarea
                value={csvContent}
                onChange={(e) => handleProcessCsvText(e.target.value)}
                placeholder={`Module,Chapter,Question,HindiQuestion,OptA,OptB,OptC,OptD,Correct,Explanation\n${moduleId},${chapterNumber},"What is CPU?","सीपीयू क्या है?","Central Unit","Central Processing Unit","Core Unit","None","B","Brain of computer"`}
                rows={6}
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
              />
            </div>
          )}

          {/* Parsing Results & Live Preview */}
          {parsedResult && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Validation & Extraction Summary</span>
                </h4>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-lg font-black text-slate-900 block">{parsedResult.totalRows}</span>
                  <span className="text-[11px] font-semibold text-slate-500">Total Rows</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-lg font-black text-emerald-600 block">{parsedResult.validQuestions.length}</span>
                  <span className="text-[11px] font-semibold text-emerald-700">Valid MCQs Ready</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 col-span-2 sm:col-span-1">
                  <span className="text-lg font-black text-rose-600 block">{parsedResult.invalidRows.length}</span>
                  <span className="text-[11px] font-semibold text-rose-700">Skipped / Errors</span>
                </div>
              </div>

              {/* Invalid Rows Warning */}
              {parsedResult.invalidRows.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 max-h-32 overflow-y-auto">
                  <div className="font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Skipped Rows ({parsedResult.invalidRows.length}):
                  </div>
                  {parsedResult.invalidRows.map((err, i) => (
                    <p key={i} className="text-[11px] text-amber-800">
                      Row {err.rowNumber}: {err.reason}
                    </p>
                  ))}
                </div>
              )}

              {/* Sample Preview of Extracted Questions */}
              {parsedResult.validQuestions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-600">Sample Extracted Question:</span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <p className="font-bold text-slate-900">
                      {parsedResult.validQuestions[0].question}
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                      {parsedResult.validQuestions[0].options.map((opt, i) => (
                        <div key={i} className={i === parsedResult.validQuestions[0].correctIndex ? 'text-emerald-700 font-bold' : ''}>
                          {String.fromCharCode(65 + i)}. {opt} {i === parsedResult.validQuestions[0].correctIndex ? '✓' : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Replace Existing Option */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="replaceChapterQuestions"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="replaceChapterQuestions" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Replace all existing questions in {moduleId.toUpperCase()} Chapter {chapterNumber} with this imported list
                </label>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={!parsedResult || parsedResult.validQuestions.length === 0 || isProcessing}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
              !parsedResult || parsedResult.validQuestions.length === 0 || isProcessing
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            }`}
          >
            {isProcessing ? (
              <span>Saving Questions...</span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Import {parsedResult?.validQuestions.length || 0} Questions</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
