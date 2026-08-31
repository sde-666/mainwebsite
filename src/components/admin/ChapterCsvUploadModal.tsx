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
import { DynamicQuizTest, QuizQuestionItem } from '../../types/database';
import { parseQuestionsCSV, generateSampleCSV, sanitizeQuizQuestions, ParsedQuestionResult } from '../../utils/csvParser';

interface CsvUploadModalProps {
  quiz: DynamicQuizTest;
  isOpen: boolean;
  onClose: () => void;
  onImportQuestions: (questions: QuizQuestionItem[], replaceExisting: boolean) => Promise<void>;
}

export function CsvUploadModal({ quiz, isOpen, onClose, onImportQuestions }: CsvUploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [fileName, setFileName] = useState<string>('');
  const [csvContent, setCsvContent] = useState<string>('');
  const [parsedResult, setParsedResult] = useState<ParsedQuestionResult | null>(null);
  const [replaceExisting, setReplaceExisting] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessCsvText = (text: string, name?: string) => {
    setCsvContent(text);
    if (name) setFileName(name);
    const result = parseQuestionsCSV(text);
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
    const sample = generateSampleCSV();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `skilldotpy_${quiz.module}_test_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = async () => {
    if (!parsedResult || parsedResult.validQuestions.length === 0) return;
    setIsProcessing(true);
    try {
      const cleanQuestions = sanitizeQuizQuestions(parsedResult.validQuestions);
      await onImportQuestions(cleanQuestions, replaceExisting);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveQuestionFromPreview = (index: number) => {
    if (!parsedResult) return;
    const updated = [...parsedResult.validQuestions];
    updated.splice(index, 1);
    setParsedResult({
      ...parsedResult,
      validQuestions: updated
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl text-slate-900">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Import Questions via CSV File</h3>
                <p className="text-xs text-slate-500">
                  Target Test: <strong className="text-amber-300">{quiz.title}</strong> ({quiz.moduleLabel})
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info & Sample CSV Download Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Required CSV Columns:</span>
            </div>
            <p className="text-[11px] text-slate-700 font-mono">
              Question, Option1, Option2, Option3, Option4, Correct Index (1-4)
            </p>
            <p className="text-[10px] text-slate-500">
              Optional columns: <code>Explanation</code>, <code>Hindi Question</code>
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadSample}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-blue-300 hover:text-blue-200 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample CSV Template</span>
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Attach CSV File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste CSV Text</span>
          </button>
        </div>

        {/* Tab 1: Upload Drag & Drop */}
        {activeTab === 'upload' && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-300 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,text/csv,text/plain"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-900">
                {fileName ? `Selected: ${fileName}` : 'Click to browse or drag and drop your .csv file here'}
              </p>
              <p className="text-[11px] text-slate-500">
                Supports standard comma-delimited CSV exported from Excel, Google Sheets, or LibreOffice Calc
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Raw CSV */}
        {activeTab === 'paste' && (
          <div className="space-y-2">
            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => handleProcessCsvText(e.target.value)}
              placeholder="Paste raw CSV text here...&#10;Question,Option1,Option2,Option3,Option4,Correct Index (1-4)&#10;What is CPU?,Central Processing Unit,Memory,Disk,Power,1"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
            <p className="text-[10px] text-slate-500">
              Tip: You can copy cells directly from Microsoft Excel or Google Sheets, export as CSV, and paste here.
            </p>
          </div>
        )}

        {/* Parsed Results Live Preview */}
        {parsedResult && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{parsedResult.validQuestions.length} Questions Successfully Parsed</span>
                </div>
                {parsedResult.invalidRows.length > 0 && (
                  <span className="text-[11px] text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {parsedResult.invalidRows.length} Rows Skipped
                  </span>
                )}
              </div>

              {/* Import Options */}
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="importMode"
                    checked={!replaceExisting}
                    onChange={() => setReplaceExisting(false)}
                    className="text-blue-600 focus:ring-0"
                  />
                  <span>Append to existing ({quiz.questions?.length || 0})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-amber-300 font-semibold">
                  <input
                    type="radio"
                    name="importMode"
                    checked={replaceExisting}
                    onChange={() => setReplaceExisting(true)}
                    className="text-blue-600 focus:ring-0"
                  />
                  <span>Replace all</span>
                </label>
              </div>
            </div>

            {/* Questions Preview List */}
            {parsedResult.validQuestions.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {parsedResult.validQuestions.map((q, idx) => (
                  <div 
                    key={q.id || idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-400 font-mono font-bold shrink-0">#{idx + 1}</span>
                        <div>
                          <p className="font-semibold text-white">{q.question}</p>
                          {q.hindiQuestion && (
                            <p className="text-[11px] text-slate-500">{q.hindiQuestion}</p>
                          )}
                        </div>
                      </div>

                      {/* Options with designated correct answer badge */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 text-[10px]">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-1.5 rounded-lg border ${
                              oIdx === q.correctIndex
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                                : 'bg-white text-slate-500 border-slate-200'
                            }`}
                          >
                            <span className="opacity-70 mr-1">{String.fromCharCode(65 + oIdx)}.</span>
                            <span>{opt || '(empty)'}</span>
                            {oIdx === q.correctIndex && <span className="ml-1 text-emerald-400 font-bold">✓ (Ans)</span>}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <p className="text-[10px] text-slate-500 italic">
                          Explanation: {q.explanation}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestionFromPreview(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-white rounded transition-colors shrink-0"
                      title="Remove from import"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Invalid rows warning if any */}
            {parsedResult.invalidRows.length > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>The following rows had missing data and were skipped:</span>
                </div>
                <ul className="text-[10px] text-slate-500 space-y-0.5 pl-4 list-disc">
                  {parsedResult.invalidRows.map((inv, i) => (
                    <li key={i}>
                      Row {inv.rowNumber}: {inv.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!parsedResult || parsedResult.validQuestions.length === 0 || isProcessing}
            onClick={handleConfirmImport}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all"
          >
            {isProcessing ? (
              <span>Importing & Saving to Database...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Import {parsedResult?.validQuestions.length || 0} Questions to Test
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
