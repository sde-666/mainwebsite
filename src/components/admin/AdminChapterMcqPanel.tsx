import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  HelpCircle,
  X,
  RotateCcw
} from 'lucide-react';
import { chapterMcqService } from '../../services/chapterMcqService';
import { ChapterMcqItem, ChapterMeta, PaperMeta } from '../../types/chapterMcq';
import { ChapterCsvUploadModal } from './ChapterCsvUploadModal';
import { generateChapterSampleCSV } from '../../utils/chapterCsvParser';

export function AdminChapterMcqPanel() {
  const [selectedModule, setSelectedModule] = useState<'m1-r5' | 'm2-r5' | 'm3-r5' | 'm4-r5' | 'ccc'>('m1-r5');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [mcqList, setMcqList] = useState<ChapterMcqItem[]>([]);
  const [allPapers, setAllPapers] = useState<PaperMeta[]>([]);
  const [chapterList, setChapterList] = useState<ChapterMeta[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ChapterMcqItem> | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  
  // Notification
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const papers = chapterMcqService.getAllPapers();
    setAllPapers(papers);

    const chs = chapterMcqService.getModuleChapters(selectedModule);
    setChapterList(chs);

    const unsub = chapterMcqService.subscribe(() => {
      const items = chapterMcqService.getByChapter(selectedModule, selectedChapter);
      setMcqList(items);
    });

    return () => unsub();
  }, [selectedModule, selectedChapter]);

  // Handle module change
  const handleModuleChange = (mod: 'm1-r5' | 'm2-r5' | 'm3-r5' | 'm4-r5' | 'ccc') => {
    setSelectedModule(mod);
    setSelectedChapter(1);
    const chs = chapterMcqService.getModuleChapters(mod);
    setChapterList(chs);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem({
      moduleId: selectedModule,
      chapterNumber: selectedChapter,
      question: '',
      hindiQuestion: '',
      options: ['', '', '', ''],
      hindiOptions: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      hindiExplanation: ''
    });
    setIsEditorModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: ChapterMcqItem) => {
    setEditingItem({ ...item });
    setIsEditorModalOpen(true);
  };

  // Save Item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.question?.trim()) {
      showToast('Question text is required', 'error');
      return;
    }

    if (!editingItem.options || editingItem.options.some(opt => !opt?.trim())) {
      showToast('All 4 option fields must be filled', 'error');
      return;
    }

    if (editingItem.id) {
      chapterMcqService.update(editingItem.id, editingItem);
      showToast('Question updated successfully!');
    } else {
      chapterMcqService.add({
        moduleId: selectedModule,
        chapterNumber: selectedChapter,
        question: editingItem.question!,
        hindiQuestion: editingItem.hindiQuestion,
        options: editingItem.options,
        hindiOptions: editingItem.hindiOptions,
        correctIndex: editingItem.correctIndex || 0,
        explanation: editingItem.explanation,
        hindiExplanation: editingItem.hindiExplanation
      });
      showToast('New Chapter MCQ created!');
    }

    setIsEditorModalOpen(false);
    setEditingItem(null);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this MCQ?')) {
      chapterMcqService.delete(id);
      showToast('Question deleted');
    }
  };

  // Handle CSV Import
  const handleImportQuestions = async (newQuestions: ChapterMcqItem[], replaceExisting: boolean) => {
    chapterMcqService.bulkImport(newQuestions, replaceExisting, selectedModule, selectedChapter);
    showToast(`Successfully imported ${newQuestions.length} MCQs!`);
  };

  // Download Sample Template
  const handleDownloadSample = () => {
    const sample = generateChapterSampleCSV(selectedModule, selectedChapter);
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mcq_template_${selectedModule}_ch${selectedChapter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Questions
  const filteredMcqs = mcqList.filter(m => 
    m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.hindiQuestion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.options.some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const curChapterMeta = chapterList.find(c => c.chapterNumber === selectedChapter);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-bold ${
            toast.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-rose-950 border-rose-500 text-rose-200'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Top Banner & Module Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Chapter-Wise MCQ Management Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              NIELIT O Level & CCC Chapter MCQs
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Manage instant feedback questions, bilingual options, and batch upload via CSV for each individual chapter.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>

            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Single MCQ</span>
            </button>
          </div>
        </div>

        {/* Paper / Module Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-6 border-t border-slate-800">
          {[
            { id: 'm1-r5', label: 'M1-R5: IT Tools', count: 6 },
            { id: 'm2-r5', label: 'M2-R5: Web Design', count: 6 },
            { id: 'm3-r5', label: 'M3-R5: Python', count: 6 },
            { id: 'm4-r5', label: 'M4-R5: IoT', count: 6 },
            { id: 'ccc', label: 'CCC: 9 Chapters', count: 9 },
          ].map((mod) => (
            <button
              key={mod.id}
              onClick={() => handleModuleChange(mod.id as any)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedModule === mod.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold truncate">{mod.label}</div>
              <div className="text-[11px] opacity-75 mt-0.5">{mod.count} Chapters</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Carousel / Pills */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Chapter to Manage:
          </span>
          <span className="text-xs text-blue-400 font-semibold">
            {curChapterMeta?.title || `Chapter ${selectedChapter}`}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {chapterList.map((ch) => {
            const isSel = ch.chapterNumber === selectedChapter;
            const count = chapterMcqService.getByChapter(selectedModule, ch.chapterNumber).length;

            return (
              <button
                key={ch.chapterNumber}
                onClick={() => setSelectedChapter(ch.chapterNumber)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Ch {ch.chapterNumber}: {ch.title.split(' ')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSel ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions in this chapter..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Showing <strong className="text-white">{filteredMcqs.length}</strong> of {mcqList.length} MCQs for Chapter {selectedChapter}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredMcqs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No MCQs Found for This Chapter</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
              Upload a CSV file or add individual questions to make this chapter live for students.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsCsvModalOpen(true)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition-colors"
              >
                Upload CSV File
              </button>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-500 transition-colors"
              >
                Add First MCQ
              </button>
            </div>
          </div>
        ) : (
          filteredMcqs.map((q, idx) => (
            <div
              key={q.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Correct: <strong className="text-emerald-400">{String.fromCharCode(65 + q.correctIndex)}</strong> ({q.options[q.correctIndex]})
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {q.question}
                  </h4>

                  {q.hindiQuestion && (
                    <p className="text-xs text-blue-300 font-medium">
                      {q.hindiQuestion}
                    </p>
                  )}

                  {/* Options Mini Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border flex items-center gap-2 ${
                          i === q.correctIndex
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="w-5 h-5 rounded bg-slate-800 text-[11px] flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="truncate">{opt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  {(q.explanation || q.hindiExplanation) && (
                    <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mt-2 space-y-1">
                      {q.explanation && <div>💡 <strong>Explanation:</strong> {q.explanation}</div>}
                      {q.hindiExplanation && <div>🇮🇳 <strong>व्याख्या:</strong> {q.hindiExplanation}</div>}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit MCQ"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteItem(q.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete MCQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CSV Upload Modal */}
      <ChapterCsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        moduleId={selectedModule}
        chapterNumber={selectedChapter}
        onImportQuestions={handleImportQuestions}
      />

      {/* Single MCQ Editor Modal */}
      {isEditorModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {editingItem.id ? 'Edit Chapter MCQ' : 'Create New Chapter MCQ'}
              </h3>
              <button
                onClick={() => setIsEditorModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Question (English) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.question || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  placeholder="e.g. Which layer of the OSI model handles end-to-end communication?"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Question (Hindi - optional)
                </label>
                <textarea
                  rows={2}
                  value={editingItem.hindiQuestion || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, hindiQuestion: e.target.value })}
                  placeholder="उदा. OSI मॉडल की कौन सी लेयर एंड-टू-एंड संचार को संभालती है?"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-300">
                  4 Options & Correct Answer *
                </label>

                {[0, 1, 2, 3].map((optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, correctIndex: optIdx })}
                      className={`w-9 h-9 rounded-xl border font-black text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                        editingItem.correctIndex === optIdx
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="Click to mark as correct answer"
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </button>

                    <input
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)} (English)`}
                      value={editingItem.options?.[optIdx] || ''}
                      onChange={(e) => {
                        const newOpts = [...(editingItem.options || ['', '', '', ''])];
                        newOpts[optIdx] = e.target.value;
                        setEditingItem({ ...editingItem, options: newOpts });
                      }}
                      className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)} (Hindi)`}
                      value={editingItem.hindiOptions?.[optIdx] || ''}
                      onChange={(e) => {
                        const newHindi = [...(editingItem.hindiOptions || ['', '', '', ''])];
                        newHindi[optIdx] = e.target.value;
                        setEditingItem({ ...editingItem, hindiOptions: newHindi });
                      }}
                      className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* Explanations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Explanation (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.explanation || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, explanation: e.target.value })}
                    placeholder="Brief explanation shown instantly after student selects answer..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Explanation (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.hindiExplanation || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, hindiExplanation: e.target.value })}
                    placeholder="विस्तृत व्याख्या जो उत्तर चुनने के तुरंत बाद दिखाई देगी..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Save Question
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
