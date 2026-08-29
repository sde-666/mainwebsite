import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ExternalLink, 
  HelpCircle, 
  Layers, 
  LogOut, 
  RefreshCw, 
  Sparkles, 
  Search, 
  Eye, 
  Database,
  Link as LinkIcon,
  BookOpen,
  Code,
  Laptop,
  FileSpreadsheet,
  Upload,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resourceService, formatDirectPdfUrl } from '../../services/resourceService';
import { quizService } from '../../services/quizService';
import { DynamicResource, DynamicQuizTest, QuizQuestionItem, ResourceCategoryType } from '../../types/database';
import { resourceCategories } from '../../data/resources';
import { BrandLogo } from '../../components/BrandLogo';
import { SEO } from '../../components/SEO';
import { CsvUploadModal } from '../../components/admin/CsvUploadModal';
import { getPracticalTests, savePracticalTest, deletePracticalTest, getPracticalSubmissions } from '../../services/practicalService';
import { PracticalTestSet, PracticalSubmission } from '../../types/practical';
import { initialPracticalTests } from '../../data/practicalTests';
import { notesService } from '../../services/notesService';
import { NoteCourse, NoteChapter, NoteTopic } from '../../types/notes';
import { RichNoteEditor } from '../../components/admin/RichNoteEditor';
import { AdminChapterMcqPanel } from '../../components/admin/AdminChapterMcqPanel';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<'resources' | 'quizzes' | 'chapter-mcqs' | 'practicals' | 'chapter-notes' | 'tools' | 'overview'>('chapter-notes');

  // Notes & Chapters CMS State
  const [noteCourses, setNoteCourses] = useState<NoteCourse[]>([]);
  const [noteChapters, setNoteChapters] = useState<NoteChapter[]>([]);
  const [noteTopics, setNoteTopics] = useState<NoteTopic[]>([]);
  const [selectedNoteCourseId, setSelectedNoteCourseId] = useState<string>('m1-r5');
  const [selectedNoteChapterId, setSelectedNoteChapterId] = useState<string>('all');
  const [noteTopicSearch, setNoteTopicSearch] = useState('');
  
  // Note Modals
  const [editingChapter, setEditingChapter] = useState<Partial<NoteChapter> | null>(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingNoteTopic, setEditingNoteTopic] = useState<Partial<NoteTopic> | null>(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);

  // Practicals State
  const [practicalTests, setPracticalTests] = useState<PracticalTestSet[]>([]);
  const [practicalSubmissions, setPracticalSubmissions] = useState<PracticalSubmission[]>([]);

  // Resources State
  const [resources, setResources] = useState<DynamicResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [resourceSearch, setResourceSearch] = useState('');
  const [editingResource, setEditingResource] = useState<Partial<DynamicResource> | null>(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  // Quizzes State
  const [quizzes, setQuizzes] = useState<DynamicQuizTest[]>([]);
  const [quizSearch, setQuizSearch] = useState('');
  const [editingQuiz, setEditingQuiz] = useState<Partial<DynamicQuizTest> | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [activeQuizForQuestions, setActiveQuizForQuestions] = useState<DynamicQuizTest | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Partial<QuizQuestionItem> | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  
  // CSV Question Import State
  const [csvImportQuiz, setCsvImportQuiz] = useState<DynamicQuizTest | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Practical Test State
  const [isPracticalModalOpen, setIsPracticalModalOpen] = useState(false);
  const [editingPractical, setEditingPractical] = useState<Partial<PracticalTestSet> | null>(null);

  // Status & Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // URL Helper Tool state
  const [rawDriveUrl, setRawDriveUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // Subscribe to Resources & Quizzes
  useEffect(() => {
    const unsubResources = resourceService.subscribeResources((data) => {
      setResources(data);
    });
    const unsubQuizzes = quizService.subscribeQuizzes((data) => {
      setQuizzes(data);
    });

    // Subscribe to Notes
    const unsubCourses = notesService.subscribeCourses((cList) => {
      setNoteCourses(cList);
    });
    const unsubChapters = notesService.subscribeChapters((chList) => {
      setNoteChapters(chList);
    });
    const unsubTopics = notesService.subscribeTopics((tList) => {
      setNoteTopics(tList);
    });

    return () => {
      unsubResources();
      unsubQuizzes();
      unsubCourses();
      unsubChapters();
      unsubTopics();
    };
  }, []);

  // ================= NOTES & CHAPTERS HANDLERS =================
  const handleOpenCreateChapter = () => {
    const chaptersInCourse = noteChapters.filter(c => c.courseId === selectedNoteCourseId);
    const nextNum = chaptersInCourse.length + 1;
    setEditingChapter({
      courseId: selectedNoteCourseId,
      chapterNumber: nextNum,
      title: '',
      hindiTitle: '',
      description: '',
      order: nextNum
    });
    setIsChapterModalOpen(true);
  };

  const handleOpenEditChapter = (chapter: NoteChapter) => {
    setEditingChapter({ ...chapter });
    setIsChapterModalOpen(true);
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter || !editingChapter.title) {
      showNotification('error', 'Chapter title is required');
      return;
    }

    setLoading(true);
    try {
      const chapterId = editingChapter.id || `${editingChapter.courseId || selectedNoteCourseId}-ch${editingChapter.chapterNumber || 1}-${editingChapter.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
      const chapterToSave: NoteChapter = {
        id: chapterId,
        courseId: editingChapter.courseId || selectedNoteCourseId,
        chapterNumber: Number(editingChapter.chapterNumber) || 1,
        title: editingChapter.title.trim(),
        ...(editingChapter.hindiTitle?.trim() ? { hindiTitle: editingChapter.hindiTitle.trim() } : {}),
        ...(editingChapter.description?.trim() ? { description: editingChapter.description.trim() } : {}),
        order: Number(editingChapter.order) || Number(editingChapter.chapterNumber) || 1
      };

      await notesService.saveChapter(chapterToSave);
      showNotification('success', `Chapter "${chapterToSave.title}" saved successfully!`);
      setIsChapterModalOpen(false);
      setEditingChapter(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete chapter "${title}" and all its topics?`)) return;
    try {
      await notesService.deleteChapter(chapterId);
      showNotification('success', `Chapter "${title}" deleted`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete chapter');
    }
  };

  const handleClearAllNotes = async () => {
    if (!window.confirm('Are you sure you want to delete ALL chapters and notes from Firestore? You will be able to build everything from scratch.')) return;
    setLoading(true);
    try {
      const res = await notesService.clearAllNotesFromCloud();
      showNotification('success', `Database cleared! Deleted ${res.chaptersDeleted} chapters and ${res.topicsDeleted} notes. Ready to build from scratch!`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to clear notes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateNoteTopic = (chapterId?: string) => {
    const chaptersInCourse = noteChapters.filter(ch => ch.courseId === selectedNoteCourseId);
    if (chaptersInCourse.length === 0) {
      showNotification('error', 'Please create at least one Chapter for this course first before adding lecture notes.');
      handleOpenCreateChapter();
      return;
    }

    const targetChapId = chapterId || (selectedNoteChapterId !== 'all' ? selectedNoteChapterId : chaptersInCourse[0]?.id);
    setEditingNoteTopic({
      courseId: selectedNoteCourseId,
      chapterId: targetChapId,
      title: '',
      hindiTitle: '',
      content: '',
      readTime: '2 min read',
      tags: ['Notes', 'NIELIT']
    });
    setIsNoteEditorOpen(true);
  };

  const handleOpenEditNoteTopic = (topic: NoteTopic) => {
    setEditingNoteTopic({ ...topic });
    setIsNoteEditorOpen(true);
  };

  const handleSaveNoteTopic = async (topic: NoteTopic) => {
    try {
      await notesService.saveTopic(topic);
      showNotification('success', `Note topic "${topic.title}" published!`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save note topic');
      throw err;
    }
  };

  const handleDeleteNoteTopic = async (topicId: string, title: string) => {
    if (!window.confirm(`Delete note "${title}"?`)) return;
    try {
      await notesService.deleteTopic(topicId);
      showNotification('success', `Note "${title}" removed`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete note');
    }
  };

  // Load practical tests & submissions
  useEffect(() => {
    async function loadPracticalData() {
      try {
        const pTests = await getPracticalTests();
        setPracticalTests(pTests);
        const pSubs = await getPracticalSubmissions();
        setPracticalSubmissions(pSubs);
      } catch (err) {
        console.warn('Could not load practical data:', err);
      }
    }
    loadPracticalData();
  }, []);

  const handleSyncPracticals = async () => {
    setLoading(true);
    try {
      for (const t of initialPracticalTests) {
        await savePracticalTest(t);
      }
      const updated = await getPracticalTests();
      setPracticalTests(updated);
      showNotification('success', 'Official NIELIT Practical test sets synchronized to Firestore!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to sync practical tests');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  // ================= RESOURCE HANDLERS =================
  const handleOpenCreateResource = () => {
    setEditingResource({
      category: 'o-level',
      categoryLabel: 'NIELIT O Level',
      moduleCode: 'M1-R5',
      title: '',
      hindiTitle: '',
      description: '',
      fileType: 'PDF',
      fileSize: '2.5 MB',
      downloadCount: '1,200+',
      downloadUrl: '',
      directPdfUrl: '',
      tags: ['O Level', 'Notes', 'PDF'],
      isOfficialSyllabus: false
    });
    setIsResourceModalOpen(true);
  };

  const handleOpenEditResource = (resource: DynamicResource) => {
    setEditingResource({ ...resource });
    setIsResourceModalOpen(true);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource || !editingResource.title) {
      showNotification('error', 'Title is required');
      return;
    }

    setLoading(true);
    try {
      if (editingResource.id) {
        // Update
        await resourceService.updateResource(editingResource.id, editingResource);
        showNotification('success', 'Resource updated successfully!');
      } else {
        // Create
        await resourceService.createResource(editingResource as Omit<DynamicResource, 'id'>);
        showNotification('success', 'New PDF / Note card created successfully!');
      }
      setIsResourceModalOpen(false);
      setEditingResource(null);
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Failed to save resource');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource card?')) return;
    try {
      await resourceService.deleteResource(id);
      showNotification('success', 'Resource deleted successfully!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete');
    }
  };

  // ================= QUIZ HANDLERS =================
  const handleOpenCreateQuiz = () => {
    setEditingQuiz({
      title: '',
      hindiTitle: '',
      module: 'm1',
      moduleLabel: 'M1-R5: IT Tools',
      description: '',
      durationMinutes: 45,
      totalMarks: 50,
      passingMarks: 25,
      negativeMarking: false,
      isPublished: true,
      questions: []
    });
    setIsQuizModalOpen(true);
  };

  const handleOpenEditQuiz = (quiz: DynamicQuizTest) => {
    setEditingQuiz({ ...quiz });
    setIsQuizModalOpen(true);
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz || !editingQuiz.title) {
      showNotification('error', 'Test Title is required');
      return;
    }

    setLoading(true);
    try {
      if (editingQuiz.id) {
        await quizService.updateQuiz(editingQuiz.id, editingQuiz);
        showNotification('success', 'Quiz Test updated successfully!');
      } else {
        await quizService.createQuiz(editingQuiz as Omit<DynamicQuizTest, 'id'>);
        showNotification('success', 'New Online MCQ Test created!');
      }
      setIsQuizModalOpen(false);
      setEditingQuiz(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save test');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this MCQ Test?')) return;
    try {
      await quizService.deleteQuiz(id);
      showNotification('success', 'Quiz deleted successfully!');
      if (activeQuizForQuestions?.id === id) {
        setActiveQuizForQuestions(null);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete');
    }
  };

  // ================= PRACTICAL EXAM MANAGEMENT =================
  const handleOpenCreatePractical = () => {
    setEditingPractical({
      id: `prac-${Date.now()}`,
      module: 'M3-R5',
      paperCode: 'PR3',
      title: '',
      hindiTitle: '',
      description: '',
      durationMinutes: 50,
      totalMarks: 100,
      requiredQuestionsCount: 2,
      codingMarksPerQuestion: 40,
      vivaMarks: 20,
      questions: [],
      vivaQuestions: [],
      instructions: [
        'Attempt any TWO questions out of the given three.',
        'Each coding question carries 40 marks.',
        'Viva voce carries 20 marks.'
      ]
    });
    setIsPracticalModalOpen(true);
  };

  const handleOpenEditPractical = (test: PracticalTestSet) => {
    setEditingPractical(test);
    setIsPracticalModalOpen(true);
  };

  const handleSavePractical = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPractical || !editingPractical.title) {
      showNotification('error', 'Test Title is required');
      return;
    }

    setLoading(true);
    try {
      const testToSave = {
        ...editingPractical,
        questions: editingPractical.questions || [],
        vivaQuestions: editingPractical.vivaQuestions || []
      } as PracticalTestSet;

      await savePracticalTest(testToSave);
      
      setPracticalTests(prev => {
        const idx = prev.findIndex(t => t.id === testToSave.id);
        if (idx !== -1) {
          const newTests = [...prev];
          newTests[idx] = testToSave;
          return newTests;
        }
        return [...prev, testToSave];
      });

      showNotification('success', 'Practical Test saved successfully!');
      setIsPracticalModalOpen(false);
      setEditingPractical(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save practical test');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePractical = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Practical Test Set?')) return;
    try {
      await deletePracticalTest(id);
      setPracticalTests(prev => prev.filter(t => t.id !== id));
      showNotification('success', 'Practical Test deleted successfully!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete practical test');
    }
  };

  // ================= QUESTION MANAGEMENT =================
  const handleOpenAddQuestion = (quiz: DynamicQuizTest) => {
    setActiveQuizForQuestions(quiz);
    setEditingQuestion({
      id: `q-${Date.now()}`,
      question: '',
      hindiQuestion: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      marks: 1
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (quiz: DynamicQuizTest, question: QuizQuestionItem) => {
    setActiveQuizForQuestions(quiz);
    setEditingQuestion({ ...question, options: [...question.options] });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuizForQuestions || !editingQuestion || !editingQuestion.question) {
      showNotification('error', 'Question text is required');
      return;
    }

    if (!editingQuestion.options || editingQuestion.options.some(opt => !opt.trim())) {
      showNotification('error', 'Please fill all 4 answer options');
      return;
    }

    setLoading(true);
    try {
      const existingQuestions = [...(activeQuizForQuestions.questions || [])];
      const qIndex = existingQuestions.findIndex(q => q.id === editingQuestion.id);

      if (qIndex >= 0) {
        existingQuestions[qIndex] = editingQuestion as QuizQuestionItem;
      } else {
        existingQuestions.push(editingQuestion as QuizQuestionItem);
      }

      await quizService.updateQuiz(activeQuizForQuestions.id, {
        questions: existingQuestions,
        totalMarks: existingQuestions.reduce((sum, q) => sum + (q.marks || 1), 0)
      });

      // Update local active quiz state
      setActiveQuizForQuestions({
        ...activeQuizForQuestions,
        questions: existingQuestions
      });

      showNotification('success', 'Question saved to test!');
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (quiz: DynamicQuizTest, qId: string) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      const updatedQuestions = quiz.questions.filter(q => q.id !== qId);
      await quizService.updateQuiz(quiz.id, {
        questions: updatedQuestions,
        totalMarks: updatedQuestions.reduce((sum, q) => sum + (q.marks || 1), 0)
      });
      setActiveQuizForQuestions({
        ...quiz,
        questions: updatedQuestions
      });
      showNotification('success', 'Question removed from test');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete question');
    }
  };

  // ================= CSV QUESTION IMPORT HANDLERS =================
  const handleOpenCsvImport = (quiz: DynamicQuizTest) => {
    setCsvImportQuiz(quiz);
    setIsCsvModalOpen(true);
  };

  const handleImportCsvQuestions = async (newQuestions: QuizQuestionItem[], replaceExisting: boolean) => {
    if (!csvImportQuiz) return;
    setLoading(true);
    try {
      let finalQuestions: QuizQuestionItem[] = [];
      if (replaceExisting) {
        finalQuestions = newQuestions;
      } else {
        finalQuestions = [...(csvImportQuiz.questions || []), ...newQuestions];
      }

      const updatedTotalMarks = finalQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);

      await quizService.updateQuiz(csvImportQuiz.id, {
        questions: finalQuestions,
        totalMarks: updatedTotalMarks
      });

      // Update active quiz state if currently open
      if (activeQuizForQuestions?.id === csvImportQuiz.id) {
        setActiveQuizForQuestions({
          ...csvImportQuiz,
          questions: finalQuestions,
          totalMarks: updatedTotalMarks
        });
      }

      showNotification('success', `Successfully imported and saved ${newQuestions.length} questions into "${csvImportQuiz.title}"!`);
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.message || 'Failed to import CSV questions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= SEED DATA =================
  const handleSeedDatabase = async () => {
    if (!window.confirm('This will populate / sync standard NIELIT O Level & CCC resources and tests into your Firebase Firestore. Continue?')) return;
    setIsSeeding(true);
    try {
      const resCount = await resourceService.seedDefaultResources();
      const quizCount = await quizService.seedDefaultQuizzes();
      showNotification('success', `Successfully seeded ${resCount} PDF Notes & ${quizCount} MCQ Tests to Firebase Firestore!`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  // ================= URL CONVERTER =================
  const handleConvertUrl = () => {
    if (!rawDriveUrl) return;
    const direct = formatDirectPdfUrl(rawDriveUrl);
    setConvertedUrl(direct);
  };

  // Filtered resources
  const filteredResources = resources.filter(r => {
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchSearch = !resourceSearch || 
      r.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      (r.hindiTitle && r.hindiTitle.toLowerCase().includes(resourceSearch.toLowerCase())) ||
      (r.moduleCode && r.moduleCode.toLowerCase().includes(resourceSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Filtered quizzes
  const filteredQuizzes = quizzes.filter(q => {
    return !quizSearch || 
      q.title.toLowerCase().includes(quizSearch.toLowerCase()) ||
      q.moduleLabel.toLowerCase().includes(quizSearch.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <SEO title="Skilldotpy Admin Control Panel" description="Manage NIELIT courses, PDF notes, and MCQ quizzes." noIndex />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-white p-0.5 shadow-sm">
                <img src="/skilldotpy-logo.svg" alt="Skilldotpy" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                Skilldotpy <span className="text-blue-400 font-normal">Admin</span>
              </span>
            </a>

            <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Firestore Live
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              title="Sync standard NIELIT materials into Firebase"
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isSeeding ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isSeeding ? 'Syncing...' : 'Sync Standard Data'}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">View Website</span>
            </a>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-500/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-bold ${
            notification.type === 'success' 
              ? 'bg-emerald-950 border-emerald-500 text-emerald-200' 
              : 'bg-rose-950 border-rose-500 text-rose-200'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-4 border-b border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'resources'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Free PDF & Notes ({resources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'quizzes'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Online CBT Tests ({quizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chapter-mcqs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'chapter-mcqs'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Chapter Wise MCQs</span>
          </button>

          <button
            onClick={() => setActiveTab('chapter-notes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'chapter-notes'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Chapter Notes CMS ({noteTopics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('practicals')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'practicals'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <Code className="w-4 h-4 text-emerald-400" />
            <span>Practical Exam Sets ({practicalTests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Analytics & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'tools'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Direct PDF Link Helper</span>
          </button>
        </div>

        {/* ================= TAB 1: FREE PDF & NOTES ================= */}
        {activeTab === 'resources' && (
          <div className="pt-6 space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({resources.length})
                </button>
                {resourceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.title.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    placeholder="Search notes / syllabus..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={handleOpenCreateResource}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New PDF Note</span>
                </button>
              </div>
            </div>

            {/* Resource Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                        {res.categoryLabel || res.category}
                      </span>
                      {res.moduleCode && (
                        <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          {res.moduleCode}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {res.title}
                      </h4>
                      {res.hindiTitle && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {res.hindiTitle}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {res.tags?.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">
                      <span>{res.fileSize}</span> • <span>{res.downloadCount} downloads</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {res.directPdfUrl && (
                        <a
                          href={res.directPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview Direct PDF"
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleOpenEditResource(res)}
                        title="Edit Card"
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        title="Delete Card"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Notes Found</h4>
                <p className="text-xs text-slate-400">Click "Add New PDF Note" or "Sync Standard Data" to populate.</p>
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 2: ONLINE MCQ TESTS ================= */}
        {activeTab === 'quizzes' && (
          <div className="pt-6 space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  placeholder="Search test name, subject..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleOpenCreateQuiz}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create New MCQ Test</span>
              </button>
            </div>

            {/* Quiz Tests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                        {quiz.moduleLabel || quiz.module}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {quiz.questions?.length || 0} Questions • {quiz.durationMinutes} Mins
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{quiz.title}</h4>
                      {quiz.hindiTitle && (
                        <p className="text-xs text-slate-400 mt-0.5">{quiz.hindiTitle}</p>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {quiz.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Total Marks</span>
                        <span className="font-bold text-white">{quiz.totalMarks}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Pass Marks</span>
                        <span className="font-bold text-emerald-400">{quiz.passingMarks}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Attempts</span>
                        <span className="font-bold text-blue-400">{quiz.totalAttempts || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Question Management Actions */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveQuizForQuestions(activeQuizForQuestions?.id === quiz.id ? null : quiz)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>{activeQuizForQuestions?.id === quiz.id ? '▲ Hide Questions' : `▼ Manage ${quiz.questions?.length || 0} Questions`}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenCsvImport(quiz)}
                        className="inline-flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-blue-500/30 transition-colors shadow-2xs"
                        title="Upload Questions from CSV file"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                        <span>Attach CSV</span>
                      </button>
                      <button
                        onClick={() => handleOpenAddQuestion(quiz)}
                        className="inline-flex items-center gap-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-emerald-500/30 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Question</span>
                      </button>
                      <button
                        onClick={() => handleOpenEditQuiz(quiz)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Questions List Accordion */}
                  {activeQuizForQuestions?.id === quiz.id && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                          Questions inside this test ({quiz.questions?.length || 0})
                        </h5>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenCsvImport(quiz)}
                            className="text-[11px] text-blue-400 hover:underline font-bold flex items-center gap-1"
                          >
                            <FileSpreadsheet className="w-3 h-3" />
                            <span>Upload CSV</span>
                          </button>
                          <button
                            onClick={() => handleOpenAddQuestion(quiz)}
                            className="text-[11px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Question</span>
                          </button>
                        </div>
                      </div>

                      {quiz.questions?.map((q, qIndex) => (
                        <div key={q.id || qIndex} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-mono text-blue-400 font-bold mr-1.5">
                                Q{qIndex + 1}.
                              </span>
                              <span className="text-xs font-medium text-white">{q.question}</span>
                              {q.hindiQuestion && (
                                <p className="text-[11px] text-slate-400 mt-0.5">{q.hindiQuestion}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleOpenEditQuestion(quiz, q)}
                                className="p-1 text-slate-400 hover:text-blue-400"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(quiz, q.id)}
                                className="p-1 text-slate-400 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Options preview */}
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                            {q.options?.map((opt, optIndex) => (
                              <div
                                key={optIndex}
                                className={`px-2 py-1 rounded-md text-[10px] ${
                                  optIndex === q.correctIndex
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                                    : 'bg-slate-950 text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {opt} {optIndex === q.correctIndex && '✓'}
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">
                              Explanation: {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB: CHAPTER WISE MCQS ================= */}
        {activeTab === 'chapter-mcqs' && (
          <div className="pt-6">
            <AdminChapterMcqPanel />
          </div>
        )}

        {/* ================= TAB: PRACTICAL EXAM SETS & SUBMISSIONS ================= */}
        {activeTab === 'practicals' && (
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">NIELIT O Level Practical Exam Sets</h3>
                <p className="text-xs text-slate-400">
                  Manage Python (PR3), Web Design (PR2), IoT (PR4), and IT Tools (PR1) practical lab exams with coding tasks and Viva Voce.
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={handleOpenCreatePractical}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Practical Test</span>
                </button>
                <button
                  onClick={handleSyncPracticals}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Standard Sets to Firestore</span>
                </button>
                <a
                  href="/practical-practice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Student View</span>
                </a>
              </div>
            </div>

            {/* Test Sets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practicalTests.map((t) => (
                <div key={t.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded border border-blue-800/60">
                      {t.paperCode} • {t.module}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{t.durationMinutes} Mins • 100 Marks</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{t.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <span className="font-bold text-slate-300 block">Tasks ({t.questions.length}):</span>
                    {t.questions.map((q) => (
                      <div key={q.id} className="text-slate-400 flex items-center gap-2">
                        <span className="text-blue-400 font-bold">Q{q.number}.</span>
                        <span className="truncate">{q.title} ({q.language.toUpperCase()})</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-slate-800 text-[11px] text-amber-400">
                      + {t.vivaQuestions.length} Viva Voce Questions (20 Marks)
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditPractical(t)}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePractical(t.id)}
                        className="text-[10px] bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-900/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                    <a
                      href={`/practical-practice/${t.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                    >
                      <span>Open Workspace Simulator</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Submissions Section */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Recent Practical Exam Submissions ({practicalSubmissions.length})</span>
              </h4>

              {practicalSubmissions.length === 0 ? (
                <p className="text-xs text-slate-500">No student submissions recorded yet. Take a test to see live submissions!</p>
              ) : (
                <div className="space-y-2">
                  {practicalSubmissions.map((sub, i) => (
                    <div key={sub.id || i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{sub.studentName}</span>
                        <span className="text-slate-500 ml-2">({sub.paperCode} - {sub.module})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold">
                          Score: {sub.scorecard.totalScore}/100 (Grade {sub.scorecard.grade})
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: CHAPTER NOTES CMS ================= */}
        {activeTab === 'chapter-notes' && (
          <div className="pt-6 space-y-6">
            {/* Top Action & Course Selector Bar */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-bold text-white">Hierarchical Notes & Blog CMS</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Create and publish rich Word-style study notes organized by Module &rarr; Chapter &rarr; Topic with Hindi/English bilingual formatting.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleClearAllNotes}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-800/60 transition-colors"
                    title="Delete all chapters and notes from cloud database to start fresh from 0"
                  >
                    <Trash2 className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Clear / Wipe Cloud Notes</span>
                  </button>

                  <a
                    href={`/notes/${selectedNoteCourseId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview in Notes Reader</span>
                  </a>

                  <button
                    onClick={() => handleOpenCreateNoteTopic()}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Write Note Article (Word Editor)</span>
                  </button>
                </div>
              </div>

              {/* Course Selector Tabs */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                {[
                  { id: 'm1-r5', label: 'M1-R5.1: IT Tools & Network Basics' },
                  { id: 'm2-r5', label: 'M2-R5.1: Web Design & Publishing' },
                  { id: 'm3-r5', label: 'M3-R5.1: Python Programming' },
                  { id: 'm4-r5', label: 'M4-R5.1: Internet of Things (IoT)' },
                  { id: 'ccc', label: 'NIELIT CCC (Computer Concepts)' }
                ].map((c) => {
                  const courseTopicsCount = noteTopics.filter(t => t.courseId === c.id).length;
                  const isSelected = selectedNoteCourseId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedNoteCourseId(c.id);
                        setSelectedNoteChapterId('all');
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                          : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-950 text-slate-400'
                      }`}>
                        {courseTopicsCount} Notes
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Two Column Grid: Chapters on Left, Topics on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Chapters Manager (4 cols) */}
              <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span>Chapters</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {noteChapters.filter(ch => ch.courseId === selectedNoteCourseId).length} Chapters in this Course
                    </span>
                  </div>

                  <button
                    onClick={handleOpenCreateChapter}
                    className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Chapter</span>
                  </button>
                </div>

                {/* Filter By All Chapters Pill */}
                <button
                  onClick={() => setSelectedNoteChapterId('all')}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                    selectedNoteChapterId === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>Show All Topics ({noteTopics.filter(t => t.courseId === selectedNoteCourseId).length})</span>
                  {selectedNoteChapterId === 'all' && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>

                {/* Chapter List */}
                <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                  {noteChapters
                    .filter(ch => ch.courseId === selectedNoteCourseId)
                    .sort((a, b) => (a.chapterNumber || a.order || 0) - (b.chapterNumber || b.order || 0))
                    .map((ch) => {
                      const chapTopics = noteTopics.filter(t => t.chapterId === ch.id);
                      const isSelected = selectedNoteChapterId === ch.id;
                      return (
                        <div
                          key={ch.id}
                          className={`p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-blue-950/50 border-blue-500/50 text-white'
                              : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <button
                              onClick={() => setSelectedNoteChapterId(ch.id)}
                              className="text-left flex-1 cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-extrabold text-[10px]">
                                  Ch {ch.chapterNumber}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {chapTopics.length} {chapTopics.length === 1 ? 'topic' : 'topics'}
                                </span>
                              </div>
                              <h5 className="font-bold text-xs text-white leading-tight">
                                {ch.title}
                              </h5>
                              {ch.hindiTitle && (
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {ch.hindiTitle}
                                </p>
                              )}
                            </button>

                            <div className="flex items-center gap-1 shrink-0 pt-1">
                              <button
                                onClick={() => handleOpenCreateNoteTopic(ch.id)}
                                title="Add note in this chapter"
                                className="p-1 rounded bg-blue-900/40 text-blue-300 hover:bg-blue-800/60"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditChapter(ch)}
                                title="Edit chapter info"
                                className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteChapter(ch.id, ch.title)}
                                title="Delete chapter"
                                className="p-1 rounded bg-rose-900/30 text-rose-300 hover:bg-rose-800/50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {noteChapters.filter(ch => ch.courseId === selectedNoteCourseId).length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No chapters defined for this course yet.<br />
                      Click <strong className="text-blue-400">"Add Chapter"</strong> or <strong className="text-amber-400">"Sync Default Notes"</strong> above.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Topics / Note Articles (8 cols) */}
              <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
                
                {/* Search & Filter Header */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Note Articles & Blog Topics</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {selectedNoteChapterId === 'all' 
                        ? 'Showing all topics in course'
                        : `Showing topics in ${noteChapters.find(c => c.id === selectedNoteChapterId)?.title || 'Chapter'}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search notes in course..."
                        value={noteTopicSearch}
                        onChange={(e) => setNoteTopicSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Topics List */}
                <div className="space-y-3">
                  {noteTopics
                    .filter(t => t.courseId === selectedNoteCourseId)
                    .filter(t => selectedNoteChapterId === 'all' || t.chapterId === selectedNoteChapterId)
                    .filter(t => {
                      if (!noteTopicSearch) return true;
                      const q = noteTopicSearch.toLowerCase();
                      return (
                        t.title.toLowerCase().includes(q) ||
                        (t.hindiTitle && t.hindiTitle.toLowerCase().includes(q)) ||
                        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
                      );
                    })
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((topic) => {
                      const parentChapter = noteChapters.find(ch => ch.id === topic.chapterId);
                      return (
                        <div
                          key={topic.id}
                          className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {parentChapter && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  Ch {parentChapter.chapterNumber}: {parentChapter.title}
                                </span>
                              )}
                              {topic.readTime && (
                                <span className="text-[10px] text-slate-400">
                                  ⏱ {topic.readTime}
                                </span>
                              )}
                              {topic.views !== undefined && (
                                <span className="text-[10px] text-slate-400">
                                  👁 {topic.views} views
                                </span>
                              )}
                            </div>

                            <h5 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                              {topic.title}
                            </h5>

                            {topic.hindiTitle && (
                              <p className="text-xs text-slate-400">
                                {topic.hindiTitle}
                              </p>
                            )}

                            {topic.tags && topic.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {topic.tags.map((tag, idx) => (
                                  <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <a
                              href={`/notes/${topic.courseId}/${topic.chapterId}/${topic.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </a>

                            <button
                              onClick={() => handleOpenEditNoteTopic(topic)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Word Note</span>
                            </button>

                            <button
                              onClick={() => handleDeleteNoteTopic(topic.id, topic.title)}
                              className="p-1.5 rounded-lg bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 border border-rose-500/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {noteTopics.filter(t => t.courseId === selectedNoteCourseId && (selectedNoteChapterId === 'all' || t.chapterId === selectedNoteChapterId)).length === 0 && (
                    <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800/50 space-y-3">
                      <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-medium">
                        No note articles created for this section yet.
                      </p>
                      <button
                        onClick={() => handleOpenCreateNoteTopic()}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Write First Note in Word Editor</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: OVERVIEW & STATS ================= */}
        {activeTab === 'overview' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400">Total PDF Notes</span>
                <span className="block text-3xl font-extrabold text-white">{resources.length}</span>
                <span className="text-[11px] text-blue-400">Published across 5 categories</span>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400">Online MCQ Tests</span>
                <span className="block text-3xl font-extrabold text-white">{quizzes.length}</span>
                <span className="text-[11px] text-emerald-400">O Level M1-M4 & CCC</span>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400">Total Quiz Questions</span>
                <span className="block text-3xl font-extrabold text-white">
                  {quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0)}
                </span>
                <span className="text-[11px] text-purple-400">With Hindi & English explanations</span>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400">Database Engine</span>
                <span className="block text-xl font-bold text-amber-400">Firebase Firestore</span>
                <span className="text-[11px] text-slate-400">Serverless • Real-time Sync</span>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white">Firebase Connection Status</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <p>• <strong>Project:</strong> diesel-aloe-f8gvj</p>
                <p>• <strong>Firestore Collections:</strong> <code>resources</code>, <code>mcq_tests</code>, <code>test_results</code></p>
                <p>• <strong>Logged-in Educator:</strong> {currentUser?.email || 'Skilldotpy Master Admin'}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: DIRECT PDF LINK CONVERTER ================= */}
        {activeTab === 'tools' && (
          <div className="pt-6 space-y-6 max-w-3xl">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white">Direct PDF Link Generator</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Paste any Google Drive sharing link, Dropbox link, or raw PDF link. This tool automatically converts it into a direct embedded preview URL so students can view the PDF directly on your website without redirection!
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Paste Google Drive / Cloud Link
                  </label>
                  <input
                    type="url"
                    value={rawDriveUrl}
                    onChange={(e) => setRawDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/1a2b3c4d5e/view?usp=sharing"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleConvertUrl}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Convert to Direct In-Browser Embed URL
                </button>

                {convertedUrl && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs text-emerald-400 font-bold block">Converted Direct URL:</span>
                    <code className="text-xs text-slate-300 font-mono break-all block bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      {convertedUrl}
                    </code>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(convertedUrl);
                          showNotification('success', 'URL copied to clipboard!');
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Copy URL
                      </button>
                      <a
                        href={convertedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Test Preview</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL 1: CREATE / EDIT RESOURCE ================= */}
      {isResourceModalOpen && editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingResource.id ? 'Edit Study Material / PDF Card' : 'Add New Study Material / PDF Card'}
              </h3>
              <button onClick={() => setIsResourceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingResource.category}
                    onChange={(e) => {
                      const cat = e.target.value as ResourceCategoryType;
                      const catInfo = resourceCategories.find(c => c.id === cat);
                      setEditingResource({
                        ...editingResource,
                        category: cat,
                        categoryLabel: catInfo ? catInfo.title : cat
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="o-level">O level (M1,M2,M3,M4)</option>
                    <option value="ccc">CCC (Grade S Prep)</option>
                    <option value="programming">Programming (Python,Web)</option>
                    <option value="office-suite">Office (LibreOffice & MS Office)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Module / Paper Code (Optional)</label>
                  <input
                    type="text"
                    value={editingResource.moduleCode || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, moduleCode: e.target.value })}
                    placeholder="e.g. M1-R5.1, M3-R5 (Python), CCC"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={editingResource.title || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  placeholder="e.g. NIELIT O Level M3-R5 Python Full Handwritten Notes PDF"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Hindi Title (Optional)</label>
                <input
                  type="text"
                  value={editingResource.hindiTitle || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, hindiTitle: e.target.value })}
                  placeholder="e.g. ओ लेवल M3-R5 पायथन कम्पलीट नोट्स पीडीएफ"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingResource.description || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                  placeholder="Detailed description of what is included inside this note or paper..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">File Type</label>
                  <select
                    value={editingResource.fileType}
                    onChange={(e) => setEditingResource({ ...editingResource, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="SYLLABUS">Official Syllabus</option>
                    <option value="CODE">Source Code (.py / .html / .ino)</option>
                    <option value="ZIP">ZIP Archive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">File Size</label>
                  <input
                    type="text"
                    value={editingResource.fileSize || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, fileSize: e.target.value })}
                    placeholder="e.g. 2.4 MB"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Initial Downloads</label>
                  <input
                    type="text"
                    value={editingResource.downloadCount || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, downloadCount: e.target.value })}
                    placeholder="e.g. 15,200+"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Direct PDF URL (Google Drive / GitHub / Direct Download Link)
                </label>
                <input
                  type="text"
                  value={editingResource.directPdfUrl || editingResource.downloadUrl || ''}
                  onChange={(e) => setEditingResource({ 
                    ...editingResource, 
                    directPdfUrl: e.target.value,
                    downloadUrl: e.target.value 
                  })}
                  placeholder="https://drive.google.com/file/d/... or direct https://...pdf"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  If you paste a Google Drive link, the system will automatically convert it to open directly in the website's built-in PDF viewer!
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={editingResource.tags?.join(', ') || ''}
                  onChange={(e) => setEditingResource({ 
                    ...editingResource, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                  })}
                  placeholder="O Level, Python, M3-R5, Notes"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition-all"
                >
                  {loading ? 'Saving...' : 'Save PDF Resource'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CREATE / EDIT QUIZ ================= */}
      {isQuizModalOpen && editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingQuiz.id ? 'Edit MCQ Test Series' : 'Create New Online MCQ Test'}
              </h3>
              <button onClick={() => setIsQuizModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject / Paper</label>
                <select
                  value={editingQuiz.module}
                  onChange={(e) => {
                    const mod = e.target.value as any;
                    const labels: { [k: string]: string } = {
                      m1: 'M1-R5: IT Tools & Network Basics',
                      m2: 'M2-R5: Web Designing & Publishing',
                      m3: 'M3-R5: Python Programming',
                      m4: 'M4-R5: Internet of Things (IoT)',
                      ccc: 'NIELIT CCC (Course on Computer Concepts)',
                      python: 'Python Programming Masterclass',
                      libreoffice: 'LibreOffice Office Suite'
                    };
                    setEditingQuiz({
                      ...editingQuiz,
                      module: mod,
                      moduleLabel: labels[mod] || mod
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="m1">NIELIT O Level M1-R5 (IT Tools)</option>
                  <option value="m2">NIELIT O Level M2-R5 (Web Design)</option>
                  <option value="m3">NIELIT O Level M3-R5 (Python)</option>
                  <option value="m4">NIELIT O Level M4-R5 (IoT)</option>
                  <option value="ccc">NIELIT CCC Mega CBT Test</option>
                  <option value="python">Python Programming Special</option>
                  <option value="libreoffice">LibreOffice Suite Test</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  value={editingQuiz.title || ''}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                  placeholder="e.g. NIELIT O Level M3-R5 Python Full 100-Question Mock Test"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Hindi Title (Optional)</label>
                <input
                  type="text"
                  value={editingQuiz.hindiTitle || ''}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, hindiTitle: e.target.value })}
                  placeholder="e.g. ओ लेवल M3-R5 पायथन 100 प्रश्नों का ऑनलाइन टेस्ट"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  value={editingQuiz.description || ''}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, description: e.target.value })}
                  placeholder="Instructions for students before starting test..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min={5}
                    value={editingQuiz.durationMinutes || 45}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, durationMinutes: parseInt(e.target.value) || 45 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={editingQuiz.totalMarks || 50}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, totalMarks: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={editingQuiz.passingMarks || 25}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, passingMarks: parseInt(e.target.value) || 25 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition-all"
                >
                  {loading ? 'Saving...' : 'Save MCQ Test'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PRACTICAL SET ================= */}
      {isPracticalModalOpen && editingPractical && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingPractical.id?.startsWith('prac-') ? 'Create Practical Test' : 'Edit Practical Test'}
              </h3>
              <button onClick={() => setIsPracticalModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePractical} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Module</label>
                  <select
                    value={editingPractical.module}
                    onChange={(e) => setEditingPractical({ ...editingPractical, module: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="M1-R5">M1-R5 (IT Tools)</option>
                    <option value="M2-R5">M2-R5 (Web Design)</option>
                    <option value="M3-R5">M3-R5 (Python)</option>
                    <option value="M4-R5">M4-R5 (IoT)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Paper Code</label>
                  <input
                    type="text"
                    required
                    value={editingPractical.paperCode || ''}
                    onChange={(e) => setEditingPractical({ ...editingPractical, paperCode: e.target.value })}
                    placeholder="e.g. PR3 B1"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  value={editingPractical.title || ''}
                  onChange={(e) => setEditingPractical({ ...editingPractical, title: e.target.value })}
                  placeholder="e.g. Python Practical Mock 1"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingPractical.description || ''}
                  onChange={(e) => setEditingPractical({ ...editingPractical, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-bold text-white text-sm">Coding Tasks (Questions)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newQ = {
                        id: `q-${Date.now()}`,
                        number: (((editingPractical.questions?.length || 0) + 1) as 1 | 2 | 3),
                        title: '',
                        description: '',
                        marks: 40,
                        language: 'python' as any,
                        starterCode: {}
                      };
                      setEditingPractical({
                        ...editingPractical,
                        questions: [...(editingPractical.questions || []), newQ]
                      });
                    }}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Task
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(editingPractical.questions || []).map((q, idx) => (
                    <div key={q.id || idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const newQs = [...(editingPractical.questions || [])];
                          newQs.splice(idx, 1);
                          setEditingPractical({ ...editingPractical, questions: newQs });
                        }}
                        className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-3 gap-3 pr-8">
                        <div className="col-span-2">
                          <label className="block text-slate-400 text-[10px] mb-1">Task Title</label>
                          <input
                            type="text"
                            required
                            value={q.title}
                            onChange={(e) => {
                              const newQs = [...(editingPractical.questions || [])];
                              newQs[idx].title = e.target.value;
                              setEditingPractical({ ...editingPractical, questions: newQs });
                            }}
                            placeholder="e.g. Write a Python program..."
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-[10px] mb-1">Language</label>
                          <select
                            value={q.language}
                            onChange={(e) => {
                              const newQs = [...(editingPractical.questions || [])];
                              newQs[idx].language = e.target.value as any;
                              setEditingPractical({ ...editingPractical, questions: newQs });
                            }}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:border-blue-500"
                          >
                            <option value="python">Python</option>
                            <option value="html">HTML/JS</option>
                            <option value="arduino">Arduino</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-slate-400 text-[10px] mb-1">Full Description / Logic</label>
                        <textarea
                          rows={2}
                          value={q.description}
                          onChange={(e) => {
                            const newQs = [...(editingPractical.questions || [])];
                            newQs[idx].description = e.target.value;
                            setEditingPractical({ ...editingPractical, questions: newQs });
                          }}
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-slate-400 text-[10px] mb-1">Starter Code (Main File)</label>
                        <textarea
                          rows={3}
                          value={
                            q.starterCode ? Object.values(q.starterCode)[0] || '' : ''
                          }
                          onChange={(e) => {
                            const newQs = [...(editingPractical.questions || [])];
                            const filename = q.language === 'html' ? 'index.html' : q.language === 'arduino' ? 'sketch.ino' : 'main.py';
                            newQs[idx].starterCode = { [filename]: e.target.value };
                            setEditingPractical({ ...editingPractical, questions: newQs });
                          }}
                          placeholder="# Write your code here..."
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-mono text-[10px] focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-bold text-white text-sm">Viva Voce Questions</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newV = {
                        id: `v-${Date.now()}`,
                        question: '',
                        marks: 5,
                        modelAnswer: ''
                      };
                      setEditingPractical({
                        ...editingPractical,
                        vivaQuestions: [...(editingPractical.vivaQuestions || []), newV]
                      });
                    }}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Viva
                  </button>
                </div>

                <div className="space-y-4">
                  {(editingPractical.vivaQuestions || []).map((vq, idx) => (
                    <div key={vq.id || idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const newVs = [...(editingPractical.vivaQuestions || [])];
                          newVs.splice(idx, 1);
                          setEditingPractical({ ...editingPractical, vivaQuestions: newVs });
                        }}
                        className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="pr-8">
                        <label className="block text-slate-400 text-[10px] mb-1">Question</label>
                        <input
                          type="text"
                          required
                          value={vq.question}
                          onChange={(e) => {
                            const newVs = [...(editingPractical.vivaQuestions || [])];
                            newVs[idx].question = e.target.value;
                            setEditingPractical({ ...editingPractical, vivaQuestions: newVs });
                          }}
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 text-[10px] mb-1">Model Answer / Key Points</label>
                        <textarea
                          rows={2}
                          value={vq.modelAnswer}
                          onChange={(e) => {
                            const newVs = [...(editingPractical.vivaQuestions || [])];
                            newVs[idx].modelAnswer = e.target.value;
                            setEditingPractical({ ...editingPractical, vivaQuestions: newVs });
                          }}
                          className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPracticalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition-all"
                >
                  {loading ? 'Saving...' : 'Save Practical'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: ADD / EDIT QUESTION ================= */}
      {isQuestionModalOpen && editingQuestion && activeQuizForQuestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  {activeQuizForQuestions.title}
                </span>
                <h3 className="text-base font-bold text-white">Add / Edit Question</h3>
              </div>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Question (English)</label>
                <textarea
                  rows={2}
                  required
                  value={editingQuestion.question || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  placeholder="e.g. Which keyword is used to create a function in Python?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Question (Hindi - Optional)</label>
                <textarea
                  rows={2}
                  value={editingQuestion.hindiQuestion || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, hindiQuestion: e.target.value })}
                  placeholder="e.g. पायथन में फंक्शन बनाने के लिए किस कीवर्ड का उपयोग किया जाता है?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-3 pt-2">
                <label className="block font-semibold text-slate-300">
                  4 Multiple Choice Options (Select radio button for Correct Answer)
                </label>

                {[0, 1, 2, 3].map((optIdx) => (
                  <div key={optIdx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={editingQuestion.correctIndex === optIdx}
                      onChange={() => setEditingQuestion({ ...editingQuestion, correctIndex: optIdx })}
                      className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold font-mono text-slate-400 w-4">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <input
                      type="text"
                      required
                      value={editingQuestion.options?.[optIdx] || ''}
                      onChange={(e) => {
                        const newOpts = [...(editingQuestion.options || ['', '', '', ''])];
                        newOpts[optIdx] = e.target.value;
                        setEditingQuestion({ ...editingQuestion, options: newOpts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                      className={`flex-1 px-3 py-2 bg-slate-950 border rounded-xl text-white focus:outline-none ${
                        editingQuestion.correctIndex === optIdx 
                          ? 'border-emerald-500 ring-1 ring-emerald-500' 
                          : 'border-slate-700 focus:border-blue-500'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Answer Explanation & Concept (Shown after test)</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  placeholder="e.g. 'def' keyword is used to define functions in Python."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition-all"
                >
                  {loading ? 'Saving...' : 'Save Question'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: CSV QUESTION UPLOAD & PARSER ================= */}
      {isCsvModalOpen && csvImportQuiz && (
        <CsvUploadModal
          quiz={csvImportQuiz}
          isOpen={isCsvModalOpen}
          onClose={() => {
            setIsCsvModalOpen(false);
            setCsvImportQuiz(null);
          }}
          onImportQuestions={handleImportCsvQuestions}
        />
      )}

      {/* ================= MODAL 5: ADD / EDIT CHAPTER ================= */}
      {isChapterModalOpen && editingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Layers className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-white">
                  {editingChapter.id ? 'Edit Chapter' : 'Add New Chapter to Module'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsChapterModalOpen(false);
                  setEditingChapter(null);
                }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Course / Paper</label>
                <select
                  value={editingChapter.courseId || selectedNoteCourseId}
                  onChange={(e) => setEditingChapter({ ...editingChapter, courseId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="m1-r5">M1-R5.1: IT Tools & Network Basics</option>
                  <option value="m2-r5">M2-R5.1: Web Design & Publishing</option>
                  <option value="m3-r5">M3-R5.1: Python Programming</option>
                  <option value="m4-r5">M4-R5.1: Internet of Things (IoT)</option>
                  <option value="ccc">NIELIT CCC (Computer Concepts)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Chapter Number</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingChapter.chapterNumber || 1}
                    onChange={(e) => setEditingChapter({ ...editingChapter, chapterNumber: parseInt(e.target.value) || 1, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingChapter.order || editingChapter.chapterNumber || 1}
                    onChange={(e) => setEditingChapter({ ...editingChapter, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Chapter Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Computer & LibreOffice"
                  value={editingChapter.title || ''}
                  onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Hindi Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. कंप्यूटर का परिचय एवं अनुप्रयोग"
                  value={editingChapter.hindiTitle || ''}
                  onChange={(e) => setEditingChapter({ ...editingChapter, hindiTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Short Summary / Syllabus Overview</label>
                <textarea
                  rows={2}
                  placeholder="Brief overview of topics covered in this chapter..."
                  value={editingChapter.description || ''}
                  onChange={(e) => setEditingChapter({ ...editingChapter, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsChapterModalOpen(false);
                    setEditingChapter(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition-all"
                >
                  {loading ? 'Saving...' : 'Save Chapter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: RICH WORD / WRITER NOTE EDITOR ================= */}
      {isNoteEditorOpen && editingNoteTopic && (
        <RichNoteEditor
          topic={editingNoteTopic}
          courses={noteCourses}
          chapters={noteChapters}
          onSave={handleSaveNoteTopic}
          onClose={() => {
            setIsNoteEditorOpen(false);
            setEditingNoteTopic(null);
          }}
        />
      )}

    </div>
  );
}
