import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Cloud,
  RefreshCw,
  Eye,
  Check
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
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  
  // Modals
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ChapterMcqItem> | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  
  // Notification
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const papers = chapterMcqService.getAllPapers();
    setAllPapers(papers);

    const chs = chapterMcqService.getModuleChapters(selectedModule);
    setChapterList(chs);

    const unsub = chapterMcqService.subscribe(() => {
      const items = chapterMcqService.getByChapter(selectedModule, selectedChapter);
      setMcqList(items);
      setChapterList(chapterMcqService.getModuleChapters(selectedModule));
      setAllPapers(chapterMcqService.getAllPapers());
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

  // Save Item (Single Add/Edit to Cloud Firestore & LocalStorage)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.question?.trim()) {
      showToast('Question text is required', 'error');
      return;
    }

    if (!editingItem.options || editingItem.options.some(opt => !opt?.trim())) {
      showToast('All 4 option fields must be filled', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem.id) {
        await chapterMcqService.update(editingItem.id, editingItem);
        showToast('Question updated and saved to Cloud Firestore!');
      } else {
        await chapterMcqService.add({
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
        showToast('New Chapter MCQ created and saved to Cloud Firestore!');
      }
      setIsEditorModalOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save MCQ', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this MCQ? It will be removed from all devices.')) {
      setIsSaving(true);
      try {
        await chapterMcqService.delete(id);
        showToast('Question deleted from Cloud Firestore');
      } catch (err: any) {
        showToast(err.message || 'Failed to delete MCQ', 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Handle CSV Import
  const handleImportQuestions = async (newQuestions: ChapterMcqItem[], replaceExisting: boolean) => {
    setIsSaving(true);
    try {
      const count = await chapterMcqService.bulkImport(newQuestions, replaceExisting, selectedModule, selectedChapter);
      showToast(`Successfully uploaded ${count} MCQs directly to Cloud Firestore! Ready on all devices.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to import CSV questions', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Sync all local / seed questions to Cloud Firestore
  const handleSyncAllToCloud = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await chapterMcqService.syncAllToCloud();
      showToast(`Cloud Sync Complete! ${res.uploaded} MCQs synchronized to Firebase Firestore across all devices.`);
    } catch (err: any) {
      showToast(err.message || 'Cloud sync failed', 'error');
    } finally {
      setIsSyncingCloud(false);
    }
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
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Chapter-Wise MCQ Management Portal
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Cloud className="w-3 h-3" />
                <span>Cloud Synced (Multi-Device Active)</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              NIELIT O Level & CCC Chapter MCQs
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Questions uploaded via Single Question or CSV are stored directly in Firebase Firestore and instantly accessible on mobile phones, tablets, and all student devices.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncAllToCloud}
              disabled={isSyncingCloud || isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Ensure all local and uploaded questions are synced to Firebase Cloud Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span>{isSyncingCloud ? 'Syncing to Cloud...' : 'Sync All MCQs to Cloud'}</span>
            </button>

            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>

            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-100 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-6 border-t border-slate-200">
          {[
            { id: 'm1-r5', label: 'M1-R5: IT Tools', count: 6 },
            { id: 'm2-r5', label: 'M2-R5: Web Design', count: 6 },
            { id: 'm3-r5', label: 'M3-R5: Python', count: 6 },
            { id: 'm4-r5', label: 'M4-R5: IoT', count: 6 },
            { id: 'ccc', label: 'CCC Course', count: 8 },
          ].map((item) => {
            const isSelected = selectedModule === item.id;
            const paper = allPapers.find(p => p.id === item.id);
            const totalCount = paper?.totalMcqsCount || 0;

            return (
              <button
                key={item.id}
                onClick={() => handleModuleChange(item.id as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                  Paper
                </span>
                <span className="text-xs font-black block truncate mt-0.5">
                  {item.label}
                </span>
                <span className="text-[10px] mt-1 block opacity-75 font-mono">
                  {totalCount} Total MCQs
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapters & Questions Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Chapters Navigation List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Syllabus Chapters</h3>
              <span className="text-[11px] text-slate-500">Select chapter to manage questions</span>
            </div>
            <a
              href={`/chapter-wise-mcq/${selectedModule}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
            >
              <span>Student View</span>
              <Eye className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {chapterList.map((ch) => {
              const isSelected = selectedChapter === ch.chapterNumber;
              const count = chapterMcqService.getByChapter(selectedModule, ch.chapterNumber).length;

              return (
                <button
                  key={ch.chapterNumber}
                  onClick={() => setSelectedChapter(ch.chapterNumber)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-blue-400 font-bold">
                        Ch {ch.chapterNumber}
                      </span>
                    </div>
                    <span className="text-xs font-semibold block truncate">
                      {ch.title}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {ch.hindiTitle}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 font-bold ${
                    count > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count} MCQs
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: MCQs List for Selected Chapter */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          
          {/* Chapter Header & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-blue-900 text-blue-300 px-2 py-0.5 rounded-md font-bold">
                  Chapter {selectedChapter}
                </span>
                <span className="text-xs text-slate-500">
                  {selectedModule.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {curChapterMeta?.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {curChapterMeta?.hindiTitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/chapter-wise-mcq/${selectedModule}/${selectedChapter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Test Practice Screen</span>
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions in this chapter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Questions List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredMcqs.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-800/40">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {q.question}
                      </span>
                    </div>

                    {q.hindiQuestion && (
                      <p className="text-[11px] text-slate-500 font-medium pl-6">
                        {q.hindiQuestion}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(q)}
                      disabled={isSaving}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Edit Question"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(q.id)}
                      disabled={isSaving}
                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/30 transition-colors cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctIndex;
                    const hindiOpt = q.hindiOptions?.[optIdx];

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                          isCorrect 
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
                            : 'bg-white/60 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-lg font-mono font-bold text-[10px] flex items-center justify-center shrink-0 ${
                          isCorrect ? 'bg-emerald-500 text-slate-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{opt}</span>
                          {hindiOpt && (
                            <span className="block truncate text-[10px] text-slate-500">{hindiOpt}</span>
                          )}
                        </div>
                        {isCorrect && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {(q.explanation || q.hindiExplanation) && (
                  <div className="p-2.5 bg-white/40 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Explanation:
                    </span>
                    {q.explanation && <p>{q.explanation}</p>}
                    {q.hindiExplanation && <p className="text-slate-700">{q.hindiExplanation}</p>}
                  </div>
                )}
              </div>
            ))}

            {filteredMcqs.length === 0 && (
              <div className="text-center py-12 bg-slate-50/40 rounded-2xl border border-slate-200/50 space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  No MCQs found for this chapter yet.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIsCsvModalOpen(true)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-100 font-bold rounded-xl text-xs"
                  >
                    Upload CSV for Ch {selectedChapter}
                  </button>
                  <button
                    onClick={handleOpenCreate}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs"
                  >
                    Add First Question
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CSV Upload Modal */}
      <ChapterCsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        moduleId={selectedModule}
        chapterNumber={selectedChapter}
        onImportQuestions={handleImportQuestions}
      />

      {/* Add / Edit Single Question Modal */}
      {isEditorModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  {selectedModule.toUpperCase()} • Chapter {selectedChapter}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem.id ? 'Edit MCQ Question' : 'Add New Chapter MCQ (Cloud Synced)'}
                </h3>
              </div>
              <button 
                onClick={() => setIsEditorModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Question (English) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Which shortcut key is used to save a document in LibreOffice Writer?"
                  value={editingItem.question || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Question (Hindi - Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. लिब्रे ऑफिस राइटर में डॉक्यूमेंट को सेव करने के लिए किस शॉर्टकट कुंजी का उपयोग किया जाता है?"
                  value={editingItem.hindiQuestion || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, hindiQuestion: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  4 Options & Correct Answer * (Click the button letter to mark correct)
                </label>

                {[0, 1, 2, 3].map((optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, correctIndex: optIdx })}
                      className={`w-9 h-9 rounded-xl border font-black text-xs flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                        editingItem.correctIndex === optIdx
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs scale-105'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'
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
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
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
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* Explanations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Explanation (English)
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.explanation || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, explanation: e.target.value })}
                    placeholder="Brief explanation shown instantly after student selects answer..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Explanation (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.hindiExplanation || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, hindiExplanation: e.target.value })}
                    placeholder="विस्तृत व्याख्या जो उत्तर चुनने के तुरंत बाद दिखाई देगी..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Cloud...</span>
                    </>
                  ) : (
                    <span>Save to Cloud Firestore</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
