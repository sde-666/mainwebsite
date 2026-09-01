import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  Clock, 
  ChevronRight, 
  ChevronUp,
  ArrowLeft, 
  Search, 
  X, 
  Menu,
  Maximize2,
  Minimize2,
  Bookmark,
  BookmarkCheck,
  Type,
  Share2,
  Check,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
  BookOpen,
  Laptop,
  Info
} from 'lucide-react';
import { NoteCourse, NoteChapter, NoteTopic } from '../types/notes';
import { notesService } from '../services/notesService';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { AdUnit } from '../components/AdUnit';

export function NotesReader() {
  const { 
    courseId: paramCourseId, 
    chapterId: paramChapterId, 
    topicId: paramTopicId 
  } = useParams<{ 
    courseId?: string; 
    chapterId?: string; 
    topicId?: string 
  }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [courses, setCourses] = useState<NoteCourse[]>([]);
  const [chapters, setChapters] = useState<NoteChapter[]>([]);
  const [topics, setTopics] = useState<NoteTopic[]>([]);
  const [loading, setLoading] = useState(true);

  // Layout View Controls
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'contents' | 'saved'>('contents');
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  // Theme & Appearance
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>(() => {
    return (localStorage.getItem('skilldotpy_notes_theme') as any) || 'light';
  });
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(() => {
    return (localStorage.getItem('skilldotpy_reader_fontsize') as any) || 'md';
  });
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>(() => {
    return (localStorage.getItem('skilldotpy_reader_fontfamily') as any) || 'sans';
  });
  const [showTypographyMenu, setShowTypographyMenu] = useState(false);

  // Bookmarks state (Persisted in localStorage)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('skilldotpy_note_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  // Search & Filter in sidebar
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded chapters in accordion
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Mobile Drawers
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Interactive & Feedback Elements
  const [shareToast, setShareToast] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const mainScrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. Live Subscribe to courses, chapters, and topics
  useEffect(() => {
    const unsubCourses = notesService.subscribeCourses((cList) => {
      setCourses(cList);
    });
    const unsubChapters = notesService.subscribeChapters((chList) => {
      setChapters(chList);
    });
    const unsubTopics = notesService.subscribeTopics((tList) => {
      setTopics(tList);
      setLoading(false);
    });

    return () => {
      unsubCourses();
      unsubChapters();
      unsubTopics();
    };
  }, []);

  // Save theme preferences
  useEffect(() => {
    localStorage.setItem('skilldotpy_notes_theme', readingTheme);
  }, [readingTheme]);

  useEffect(() => {
    localStorage.setItem('skilldotpy_reader_fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('skilldotpy_reader_fontfamily', fontFamily);
  }, [fontFamily]);

  // Anti-Copy & Strict Content Protection
  useEffect(() => {
    const handleCopyProtection = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.clearData();
      }
      return false;
    };

    const handleKeyProtection = (e: KeyboardEvent) => {
      const isModifier = e.ctrlKey || e.metaKey;
      if (isModifier) {
        const key = e.key.toLowerCase();
        // Prevent Copy (C), Select All (A), Cut (X), View Source (U), Save (S), Print (P)
        if (['c', 'a', 'x', 'u', 's', 'p'].includes(key)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('copy', handleCopyProtection, true);
    document.addEventListener('cut', handleCopyProtection, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('keydown', handleKeyProtection, true);

    return () => {
      document.removeEventListener('copy', handleCopyProtection, true);
      document.removeEventListener('cut', handleCopyProtection, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('keydown', handleKeyProtection, true);
    };
  }, []);

  // Save bookmarks
  const toggleBookmark = (topicId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setBookmarks(prev => {
      const next = prev.includes(topicId) 
        ? prev.filter(id => id !== topicId) 
        : [...prev, topicId];
      localStorage.setItem('skilldotpy_note_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  // 2. Resolve Active Course
  const currentCourse = useMemo(() => {
    if (courses.length === 0) return null;
    if (paramCourseId) {
      const cleanParam = paramCourseId.toLowerCase();
      const match = courses.find(c => 
        c.id === paramCourseId || 
        c.id.toLowerCase() === cleanParam ||
        c.code.toLowerCase().includes(cleanParam) ||
        (cleanParam.includes('m1') && c.id.includes('m1')) ||
        (cleanParam.includes('m2') && c.id.includes('m2')) ||
        (cleanParam.includes('m3') && c.id.includes('m3')) ||
        (cleanParam.includes('m4') && c.id.includes('m4')) ||
        (cleanParam.includes('ccc') && c.id.includes('ccc'))
      );
      if (match) return match;
    }
    // Default to M2-R5 or first course
    const m2Course = courses.find(c => c.id === 'm2-r5');
    return m2Course || courses[0] || null;
  }, [courses, paramCourseId]);

  // 3. Filtered Chapters for Active Course (Strictly Deduplicated so chapters NEVER repeat)
  const currentCourseChapters = useMemo(() => {
    if (!currentCourse) return [];
    const courseChaps = chapters
      .filter(ch => ch.courseId === currentCourse.id)
      .sort((a, b) => (a.chapterNumber || a.order || 0) - (b.chapterNumber || b.order || 0));

    const seenNumbers = new Set<number>();
    const seenIds = new Set<string>();
    const result: NoteChapter[] = [];

    for (const ch of courseChaps) {
      if (seenIds.has(ch.id)) continue;
      const num = Number(ch.chapterNumber) || 0;
      if (num > 0 && seenNumbers.has(num)) {
        continue;
      }
      seenIds.add(ch.id);
      if (num > 0) seenNumbers.add(num);
      result.push(ch);
    }
    return result;
  }, [chapters, currentCourse]);

  // Helper to get topics for any chapter, strictly deduplicated
  const getTopicsForChapter = useMemo(() => {
    return (chapter: NoteChapter): NoteTopic[] => {
      if (!currentCourse) return [];
      const chapNum = Number(chapter.chapterNumber) || 0;
      const filtered = topics.filter(t => 
        t.courseId === currentCourse.id && 
        (t.chapterId === chapter.id || 
         (chapNum > 0 && (
           t.chapterId === `ch${chapNum}` || 
           t.chapterId.endsWith(`ch${chapNum}`) || 
           t.chapterId.includes(`ch${chapNum}-`) ||
           t.chapterId.includes(`chapter-${chapNum}`)
         )))
      );

      const seenIds = new Set<string>();
      const seenTitles = new Set<string>();
      const unique: NoteTopic[] = [];

      const sorted = [...filtered].sort((a, b) => (a.order || 0) - (b.order || 0));
      for (const t of sorted) {
        const titleKey = (t.title || '').trim().toLowerCase();
        if (seenIds.has(t.id) || seenTitles.has(titleKey)) continue;
        seenIds.add(t.id);
        if (titleKey) seenTitles.add(titleKey);
        unique.push(t);
      }
      return unique;
    };
  }, [topics, currentCourse]);

  // 4. Resolve Active Chapter
  const currentChapter = useMemo(() => {
    if (!currentCourse || currentCourseChapters.length === 0) {
      return null;
    }

    if (paramChapterId) {
      const cleanParam = paramChapterId.toLowerCase();
      const numMatch = cleanParam.match(/\d+/);
      const extractedNum = numMatch ? parseInt(numMatch[0], 10) : null;

      const match = currentCourseChapters.find(ch => 
        ch.id === paramChapterId || 
        ch.id.toLowerCase() === cleanParam ||
        ch.id.startsWith(paramChapterId) || 
        ch.id.includes(paramChapterId) ||
        cleanParam.includes(ch.id.toLowerCase()) ||
        (extractedNum !== null && ch.chapterNumber === extractedNum) ||
        `ch${ch.chapterNumber}` === cleanParam ||
        `chapter-${ch.chapterNumber}` === cleanParam ||
        `chapter${ch.chapterNumber}` === cleanParam ||
        `${currentCourse.id.replace('-r5', '')}-ch${ch.chapterNumber}` === cleanParam
      );
      if (match) return match;
    }

    if (paramTopicId) {
      const topicObj = topics.find(t => t.id === paramTopicId && t.courseId === currentCourse.id);
      if (topicObj) {
        const matchingChap = currentCourseChapters.find(ch => 
          ch.id === topicObj.chapterId || 
          (topicObj.chapterId && topicObj.chapterId.includes(`ch${ch.chapterNumber}`))
        );
        if (matchingChap) return matchingChap;
      }
    }

    const chapWithTopics = currentCourseChapters.find(ch => 
      getTopicsForChapter(ch).length > 0
    );
    if (chapWithTopics) return chapWithTopics;

    return currentCourseChapters[0] || null;
  }, [currentCourseChapters, paramChapterId, paramTopicId, topics, currentCourse, getTopicsForChapter]);

  // Expand active chapter by default
  useEffect(() => {
    if (currentChapter) {
      setExpandedChapters(prev => ({
        ...prev,
        [currentChapter.id]: true
      }));
    }
  }, [currentChapter?.id]);

  // 5. Filtered Topics for Active Chapter
  const currentChapterTopics = useMemo(() => {
    if (!currentCourse || !currentChapter) {
      return [];
    }
    return getTopicsForChapter(currentChapter);
  }, [currentChapter, currentCourse, getTopicsForChapter]);

  // 6. Resolve Active Topic
  const activeTopic = useMemo(() => {
    if (!currentCourse) return null;

    if (paramTopicId) {
      const directFound = currentChapterTopics.find(t => 
        t.id === paramTopicId || 
        t.id.toLowerCase() === paramTopicId.toLowerCase()
      ) || topics.find(t => 
        (t.id === paramTopicId || t.id.toLowerCase() === paramTopicId.toLowerCase()) && 
        t.courseId === currentCourse.id
      );
      if (directFound) return directFound;
    }

    if (currentChapterTopics.length > 0) {
      return currentChapterTopics[0];
    }

    return null;
  }, [topics, paramTopicId, currentChapterTopics, currentCourse]);

  // Track topic views
  useEffect(() => {
    if (activeTopic?.id) {
      notesService.incrementTopicViews(activeTopic.id);
    }
  }, [activeTopic?.id]);

  // 7. Navigation (Previous & Next Topics in current chapter / course)
  const currentTopicIndex = useMemo(() => {
    if (!activeTopic || currentChapterTopics.length === 0) return -1;
    return currentChapterTopics.findIndex(t => t.id === activeTopic.id);
  }, [activeTopic, currentChapterTopics]);

  const prevTopic = useMemo(() => {
    if (currentTopicIndex > 0) {
      return currentChapterTopics[currentTopicIndex - 1];
    }
    return null;
  }, [currentTopicIndex, currentChapterTopics]);

  const nextTopic = useMemo(() => {
    if (currentTopicIndex >= 0 && currentTopicIndex < currentChapterTopics.length - 1) {
      return currentChapterTopics[currentTopicIndex + 1];
    }
    return null;
  }, [currentTopicIndex, currentChapterTopics]);

  // 8. Search Filter results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !currentCourse) return null;
    const q = searchQuery.toLowerCase().trim();
    return topics.filter(t => 
      t.courseId === currentCourse.id && 
      (t.title.toLowerCase().includes(q) || 
       t.tags?.some(tag => tag.toLowerCase().includes(q)))
    );
  }, [topics, searchQuery, currentCourse]);

  // 9. Bookmarked Topics list
  const savedTopicsList = useMemo(() => {
    return topics.filter(t => bookmarks.includes(t.id));
  }, [topics, bookmarks]);

  // Handle Scroll Progress inside the main reading container
  const handleContainerScroll = () => {
    const el = mainScrollContainerRef.current;
    if (!el) return;
    const totalScroll = el.scrollTop;
    const scrollableHeight = el.scrollHeight - el.clientHeight;
    if (scrollableHeight > 0) {
      const pct = Math.min(100, Math.max(0, (totalScroll / scrollableHeight) * 100));
      setScrollProgress(pct);
    }
  };

  // Scroll to top on topic change
  useEffect(() => {
    if (mainScrollContainerRef.current) {
      mainScrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTopic?.id]);

  // Share Note URL Handler (Works smoothly with Web Share API or Clipboard fallback)
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${activeTopic?.title || 'Notes'} - ${currentCourse?.title || 'Skilldotpy'}`;
    const shareText = `Read notes on ${activeTopic?.title || 'this topic'} on Skilldotpy`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch {
        // Ignore user cancellation
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      } catch {
        // Fallback for older environments
      }
    }
  };

  // Safe Fullscreen Request
  const requestFullscreenSafe = () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}
  };

  // Automatically request fullscreen on mount and first interaction
  useEffect(() => {
    requestFullscreenSafe();
    const handleFirstInteraction = () => {
      requestFullscreenSafe();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Sync fullscreen state with document events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle Fullscreen mode
  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Step-by-Step Back Handler:
  // Navigates back through notes one by one, and on the first note exits to the course page
  const handleBackStep = () => {
    if (prevTopic && currentCourse && currentChapter) {
      requestFullscreenSafe();
      navigate(`/notes/${currentCourse.id}/${currentChapter.id}/${prevTopic.id}`, { replace: true });
    } else {
      handleExitReader();
    }
  };

  // Immediate and Safe Exit Handler:
  // Releases fullscreen and immediately navigates out of the reader directly to the course page
  const handleExitReader = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}

    if (currentCourse?.id === 'ccc') {
      navigate('/ccc', { replace: true });
    } else if (currentCourse?.id) {
      navigate(`/o-level/${currentCourse.id}`, { replace: true });
    } else {
      navigate('/o-level', { replace: true });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Escape') {
        handleExitReader();
      } else if (e.key === 'ArrowRight' && nextTopic && currentCourse && currentChapter) {
        navigate(`/notes/${currentCourse.id}/${currentChapter.id}/${nextTopic.id}`, { replace: true });
      } else if (e.key === 'ArrowLeft' && prevTopic && currentCourse && currentChapter) {
        navigate(`/notes/${currentCourse.id}/${currentChapter.id}/${prevTopic.id}`, { replace: true });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextTopic, prevTopic, currentCourse, currentChapter]);

  // Dynamic Theme Colors
  const themeClasses = useMemo(() => {
    if (readingTheme === 'dark') {
      return {
        bg: 'bg-[#0F172A] text-slate-100',
        headerBg: 'bg-[#1E293B]/95 border-slate-700/80 text-slate-100',
        sidebarBg: 'bg-[#0B1120] border-slate-800 text-slate-200',
        cardBg: 'bg-[#1E293B] border-slate-700/80 text-slate-100 shadow-xl shadow-black/20',
        subtleBg: 'bg-[#1E293B] border-slate-700 text-slate-300',
        accentText: 'text-blue-400',
        hoverItem: 'hover:bg-slate-800/80 text-slate-300',
        divider: 'border-slate-800',
        textMuted: 'text-slate-400',
        textBody: 'text-slate-200',
        exitBtn: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700',
        calloutBg: 'bg-blue-950/40 border-blue-800/60 text-blue-200'
      };
    }
    if (readingTheme === 'sepia') {
      return {
        bg: 'bg-[#FBF7EE] text-[#4A3E3D]',
        headerBg: 'bg-[#F4EDE0]/95 border-[#E2D5C3] text-[#3D3231]',
        sidebarBg: 'bg-[#F4EDE0] border-[#E2D5C3] text-[#4A3E3D]',
        cardBg: 'bg-[#FFFDF9] border-[#E8DEC8] text-[#3D3231] shadow-xs',
        subtleBg: 'bg-[#F0E6D2] border-[#E0D4BE] text-[#4A3E3D]',
        accentText: 'text-[#A05A2C]',
        hoverItem: 'hover:bg-[#EFE5D3] text-[#4A3E3D]',
        divider: 'border-[#E2D5C3]',
        textMuted: 'text-[#857470]',
        textBody: 'text-[#3D3231]',
        exitBtn: 'bg-[#EBDDC3] hover:bg-[#E2D2B5] text-[#3D3231] border-[#DCCBB0]',
        calloutBg: 'bg-[#F5EAD4] border-[#DFCBB0] text-[#5A4638]'
      };
    }
    // Default Light Theme (Matches Reference UI)
    return {
      bg: 'bg-[#F8FAFC] text-slate-900',
      headerBg: 'bg-white border-slate-200 text-slate-900',
      sidebarBg: 'bg-white border-slate-200 text-slate-800',
      cardBg: 'bg-white border-slate-200/90 text-slate-900 shadow-xs',
      subtleBg: 'bg-slate-100 border-slate-200 text-slate-700',
      accentText: 'text-blue-600',
      hoverItem: 'hover:bg-slate-50 text-slate-700',
      divider: 'border-slate-200',
      textMuted: 'text-slate-500',
      textBody: 'text-slate-800',
      exitBtn: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300',
      calloutBg: 'bg-blue-50/70 border-blue-100 text-slate-700'
    };
  }, [readingTheme]);

  const typographyStyleClass = useMemo(() => {
    const sizeMap = {
      sm: 'text-sm leading-relaxed',
      md: 'text-base leading-relaxed',
      lg: 'text-lg leading-loose',
      xl: 'text-xl leading-loose'
    };
    const familyMap = {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono'
    };
    return `${sizeMap[fontSize]} ${familyMap[fontFamily]}`;
  }, [fontSize, fontFamily]);

  const isCurrentTopicBookmarked = activeTopic ? bookmarks.includes(activeTopic.id) : false;

  return (
    <div 
      className={`fixed inset-0 z-50 h-screen w-screen overflow-hidden flex flex-col select-none notes-reader-theme-${readingTheme} ${readingTheme === 'dark' ? 'dark' : ''} ${themeClasses.bg}`}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => { e.preventDefault(); return false; }}
      onCut={(e) => { e.preventDefault(); return false; }}
    >
      
      <SEO 
        title={`${activeTopic?.title || 'Notes'} - ${currentCourse?.title || 'NIELIT'} | Skilldotpy`}
        description={activeTopic ? `Read chapter-wise revision notes on ${activeTopic.title}.` : 'Minimalist clean NIELIT Notes reader.'}
        url={`https://skilldotpy.com/notes/${currentCourse?.id || ''}/${currentChapter?.id || ''}/${activeTopic?.id || ''}`}
      />

      {/* Share Toast Feedback */}
      {shareToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Note link copied to clipboard!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className={`h-14 sm:h-16 px-2 sm:px-4 md:px-6 border-b flex items-center justify-between z-30 shrink-0 transition-colors gap-2 ${themeClasses.headerBg}`}>
        
        {/* Left Side: Sidebar Toggle, Back Button & Step Breadcrumb */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
          
          {/* Hamburger Sidebar Toggle Button */}
          <button
            id="notes-toggle-sidebar-btn"
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsMobileSidebarOpen(!isMobileSidebarOpen);
              } else {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
            className="min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] p-2 sm:p-2.5 rounded-xl transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center shrink-0"
            title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            aria-label="Toggle notes navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Back Step-by-Step Button: Backs topic by topic, lastly exits to previous course page */}
          <button
            id="notes-back-step-btn"
            onClick={handleBackStep}
            className="min-h-[36px] sm:min-h-[40px] px-2 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs sm:text-sm font-semibold shrink-0 cursor-pointer shadow-2xs"
            title={prevTopic ? "Back to previous topic" : "Exit back to course syllabus"}
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back</span>
          </button>

          {/* Chapter / Topic Step Breadcrumb with Underline Bar */}
          <div className="flex flex-col min-w-0 flex-1 pl-1">
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold tracking-tight">
              <span className="text-slate-900 dark:text-white shrink-0">
                {currentChapter ? `Ch ${currentChapter.chapterNumber}` : 'Ch 1'}
              </span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium truncate text-[11px] sm:text-xs md:text-sm">
                {currentChapterTopics.length > 0 && currentTopicIndex >= 0 
                  ? `Topic ${currentTopicIndex + 1} of ${currentChapterTopics.length}` 
                  : (activeTopic?.title || 'Topic 1 of 6')}
              </span>
            </div>
            
            {/* Progress Underline */}
            <div className="w-16 sm:w-36 md:w-56 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ 
                  width: `${currentChapterTopics.length > 0 && currentTopicIndex >= 0 
                    ? ((currentTopicIndex + 1) / currentChapterTopics.length) * 100 
                    : 16}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Theme, Typography, Bookmark & Exit Button */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* Theme Quick Switcher Toggle */}
          <button
            id="notes-theme-switcher-btn"
            onClick={() => {
              setReadingTheme(prev => {
                if (prev === 'light') return 'sepia';
                if (prev === 'sepia') return 'dark';
                return 'light';
              });
            }}
            className="p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Toggle Theme"
            aria-label="Toggle Reading Theme"
          >
            {readingTheme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : 
             readingTheme === 'sepia' ? <Coffee className="w-4 h-4 text-amber-700" /> : 
             <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Typography Customization Menu (Aa) */}
          <div className="relative">
            <button
              id="notes-typography-toggle-btn"
              onClick={() => setShowTypographyMenu(!showTypographyMenu)}
              className={`px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs font-bold transition-colors cursor-pointer ${
                showTypographyMenu ? 'bg-blue-50 border-blue-300 text-blue-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
              title="Reading Appearance & Font Size"
              aria-label="Text Settings"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Typography Popover Modal */}
            {showTypographyMenu && (
              <div className={`absolute right-0 top-12 w-64 p-4 rounded-2xl shadow-2xl border z-50 animate-in fade-in zoom-in-95 ${themeClasses.cardBg}`}>
                <div className="flex items-center justify-between pb-2 border-b mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Appearance</span>
                  <button 
                    onClick={() => setShowTypographyMenu(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Font Size Selector */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">Text Size</label>
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                    {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`py-1 text-xs font-bold rounded-lg uppercase transition-all ${
                          fontSize === sz ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family Selector */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">Font Style</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                    {(['sans', 'serif', 'mono'] as const).map((fm) => (
                      <button
                        key={fm}
                        onClick={() => setFontFamily(fm)}
                        className={`py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                          fontFamily === fm ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {fm}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selector inside Aa menu */}
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1.5">Theme Canvas</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                    <button
                      onClick={() => setReadingTheme('light')}
                      className={`flex items-center justify-center gap-1 py-1 text-xs font-semibold rounded-lg ${
                        readingTheme === 'light' ? 'bg-white shadow-xs text-amber-600' : 'text-slate-600'
                      }`}
                    >
                      <Sun className="w-3 h-3" /> Light
                    </button>
                    <button
                      onClick={() => setReadingTheme('sepia')}
                      className={`flex items-center justify-center gap-1 py-1 text-xs font-semibold rounded-lg ${
                        readingTheme === 'sepia' ? 'bg-[#FBF7EE] shadow-xs text-[#8C461B]' : 'text-slate-600'
                      }`}
                    >
                      <Coffee className="w-3 h-3" /> Sepia
                    </button>
                    <button
                      onClick={() => setReadingTheme('dark')}
                      className={`flex items-center justify-center gap-1 py-1 text-xs font-semibold rounded-lg ${
                        readingTheme === 'dark' ? 'bg-slate-900 shadow-xs text-blue-400' : 'text-slate-600'
                      }`}
                    >
                      <Moon className="w-3 h-3" /> Dark
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Bookmark Button */}
          {activeTopic && (
            <button
              id="notes-quick-bookmark-btn"
              onClick={(e) => toggleBookmark(activeTopic.id, e)}
              className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer ${
                isCurrentTopicBookmarked 
                  ? 'text-blue-600 bg-blue-50 border-blue-300 dark:bg-blue-950/50' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
              title={isCurrentTopicBookmarked ? "Bookmarked (Click to remove)" : "Save / Bookmark Note"}
              aria-label="Bookmark Note"
            >
              {isCurrentTopicBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-blue-600 fill-blue-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Fullscreen Toggle (Hidden on small mobile) */}
          <button
            id="notes-fullscreen-toggle-btn"
            onClick={toggleBrowserFullscreen}
            className="hidden md:flex p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Toggle Browser Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isBrowserFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Clean 'Exit' button (Direct immediate exit out of reader to course hub) */}
          <button
            id="notes-exit-reader-btn"
            onClick={handleExitReader}
            className={`px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-1 sm:gap-1.5 transition-all shadow-2xs cursor-pointer ${themeClasses.exitBtn}`}
            title="Exit Notes Reading Mode"
            aria-label="Exit Reader"
          >
            <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="hidden sm:inline">Exit Notes</span>
            <span className="sm:hidden">Exit</span>
          </button>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN BODY (SIDEBAR + EXPANSIVE READING CANVAS + RIGHT AD PLACEMENT) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Mobile Backdrop Overlay for Sidebar */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-35 bg-black/50 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ======================================================================= */}
        {/* LEFT NAVIGATION SIDEBAR */}
        {/* ======================================================================= */}
        <aside 
          className={`
            fixed md:relative z-40 inset-y-0 left-0 md:inset-auto h-full 
            w-72 max-w-[85vw] md:w-72 shrink-0 border-r flex flex-col transition-transform md:transition-all duration-200 bg-white dark:bg-[#0B1120] border-slate-200 dark:border-slate-800 shadow-2xl md:shadow-none
            ${isSidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full md:w-0 md:border-r-0 md:overflow-hidden'}
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          
          {/* Logo Branding */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col">
                <div className="text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white flex items-center">
                  Skill<span className="text-red-500 font-extrabold">.</span>py
                </div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  NIELIT Notes Hub
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              aria-label="Close Mobile Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Selector Dropdown */}
          <div className="px-3 pt-3 shrink-0">
            <select
              id="notes-course-selector"
              value={currentCourse?.id || ''}
              onChange={(e) => {
                const targetCourseId = e.target.value;
                const selectedCourseChapters = chapters
                  .filter(ch => ch.courseId === targetCourseId)
                  .sort((a, b) => (a.chapterNumber || a.order || 0) - (b.chapterNumber || b.order || 0));
                const firstChap = selectedCourseChapters[0];
                const firstTopic = firstChap ? topics.find(t => t.chapterId === firstChap.id) : null;
                
                if (firstChap && firstTopic) {
                  navigate(`/notes/${targetCourseId}/${firstChap.id}/${firstTopic.id}`, { replace: true });
                } else if (firstChap) {
                  navigate(`/notes/${targetCourseId}/${firstChap.id}`, { replace: true });
                } else {
                  navigate(`/notes/${targetCourseId}`, { replace: true });
                }
              }}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.badge} - {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Segmented Control: [Contents] vs [Saved] */}
          <div className="p-3 shrink-0 space-y-2">
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100/90 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold border border-slate-200/60 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('contents')}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'contents' 
                    ? 'bg-white dark:bg-slate-800 shadow-xs text-blue-600 dark:text-blue-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Contents</span>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'saved' 
                    ? 'bg-white dark:bg-slate-800 shadow-xs text-blue-600 dark:text-blue-400 font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved</span>
                {bookmarks.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {bookmarks.length}
                  </span>
                )}
              </button>
            </div>

            {/* Search Input: 'Search in chapter...' */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in chapter..."
                className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none transition-all focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Chapter Accordion / Saved Topics Area */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1.5">
            
            {/* Search Results */}
            {searchQuery.trim() !== '' ? (
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  {`Search Results (${searchResults?.length || 0})`}
                </div>
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map((topic) => {
                    const isActive = activeTopic?.id === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => {
                          requestFullscreenSafe();
                          if (currentCourse) {
                            navigate(`/notes/${currentCourse.id}/${topic.chapterId}/${topic.id}`, { replace: true });
                            setIsMobileSidebarOpen(false);
                          }
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between cursor-pointer ${
                          isActive ? 'bg-blue-600 text-white font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate">{topic.title}</div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60 mt-0.5 shrink-0" />
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    {`No topics matched "${searchQuery}".`}
                  </div>
                )}
              </div>
            ) : activeTab === 'saved' ? (
              /* Saved Notes View */
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                  <span>Saved Notes</span>
                  <span className="text-[10px] text-blue-600 font-bold">{savedTopicsList.length}</span>
                </div>
                {savedTopicsList.length > 0 ? (
                  savedTopicsList.map((topic) => {
                    const isActive = activeTopic?.id === topic.id;
                    return (
                      <div
                        key={topic.id}
                        className={`w-full rounded-xl text-xs transition-colors flex items-center justify-between p-2.5 group cursor-pointer ${
                          isActive ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        onClick={() => {
                          requestFullscreenSafe();
                          navigate(`/notes/${topic.courseId}/${topic.chapterId}/${topic.id}`, { replace: true });
                          setIsMobileSidebarOpen(false);
                        }}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate">{topic.title}</div>
                        </div>
                        <button
                          onClick={(e) => toggleBookmark(topic.id, e)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded-md cursor-pointer"
                          title="Remove bookmark"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                    <Bookmark className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                    <p>No saved notes yet.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Standard Exact Chapter Accordion (No duplicates) */
              <div className="space-y-2 pb-4">
                {currentCourseChapters.map((chapter) => {
                  const isExpanded = !!expandedChapters[chapter.id];
                  const chapTopics = getTopicsForChapter(chapter);

                  return (
                    <div 
                      key={chapter.id} 
                      className="border-b border-slate-100 dark:border-slate-800/80 pb-1"
                    >
                      {/* Chapter Heading with Collapse Toggle */}
                      <button
                        onClick={() => {
                          requestFullscreenSafe();
                          setExpandedChapters(prev => ({
                            ...prev,
                            [chapter.id]: !prev[chapter.id]
                          }));
                        }}
                        className="w-full py-2.5 px-2 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight truncate">
                          {`CH ${chapter.chapterNumber}: `}
                          {chapter.title}
                        </span>
                        <div className="shrink-0 text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {/* Topics List inside Chapter */}
                      {isExpanded && (
                        <div className="pl-1 pr-1 pb-2 pt-1 space-y-1">
                          {chapTopics.length > 0 ? (
                            chapTopics.map((topic, idx) => {
                              const isActive = activeTopic?.id === topic.id;
                              const isBookmarked = bookmarks.includes(topic.id);

                              return (
                                <div
                                  key={topic.id}
                                  onClick={() => {
                                    requestFullscreenSafe();
                                    if (currentCourse) {
                                      navigate(`/notes/${currentCourse.id}/${chapter.id}/${topic.id}`, { replace: true });
                                      setIsMobileSidebarOpen(false);
                                    }
                                  }}
                                  className={`
                                    w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 
                                    transition-all group cursor-pointer
                                    ${isActive 
                                      ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                                  `}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {/* Dot for Active Topic vs Number for Inactive */}
                                    {isActive ? (
                                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                    ) : (
                                      <span className="text-slate-400 font-medium shrink-0">
                                        {idx + 1}.
                                      </span>
                                    )}
                                    <span className="truncate">
                                      {topic.title}
                                    </span>
                                  </div>

                                  {/* Bookmark Icon on right */}
                                  <button
                                    onClick={(e) => toggleBookmark(topic.id, e)}
                                    className={`p-1 rounded-md transition-opacity cursor-pointer ${
                                      isActive
                                        ? 'text-white/80 hover:text-white'
                                        : isBookmarked 
                                          ? 'text-blue-600 opacity-100' 
                                          : 'text-slate-400 opacity-60 hover:opacity-100 hover:text-slate-600'
                                    }`}
                                    title={isBookmarked ? "Bookmarked" : "Bookmark note"}
                                  >
                                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                                  </button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[11px] text-slate-400 p-2 text-center italic">
                              No topics added yet.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </aside>

        {/* ======================================================================= */}
        {/* 3. CENTER MAIN READING CANVAS & EXPANSIVE CONTENT AREA */}
        {/* ======================================================================= */}
        <main 
          ref={mainScrollContainerRef}
          onScroll={handleContainerScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 md:p-4 lg:p-5 flex justify-center select-none"
        >
          {loading ? (
            <div className="my-auto flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Loading chapter notes...</p>
            </div>
          ) : activeTopic ? (
            <div className="w-full flex items-start justify-center gap-3.5 md:gap-4 lg:gap-5 pb-20">

              {/* =============================================================== */}
              {/* 📄 CENTER READING ARTICLE CONTAINER (Copy Protected) */}
              {/* =============================================================== */}
              <div className="flex-1 min-w-0 max-w-6xl 2xl:max-w-7xl w-full space-y-6">

                {/* Main Reading Card with Anti-Copy Protection */}
                <article 
                  className={`p-4 sm:p-7 md:p-10 rounded-2xl border transition-colors select-none notes-protected-content ${themeClasses.cardBg}`}
                  onCopy={(e) => { e.preventDefault(); return false; }}
                  onCut={(e) => { e.preventDefault(); return false; }}
                  onContextMenu={(e) => { e.preventDefault(); return false; }}
                  onDragStart={(e) => { e.preventDefault(); return false; }}
                >

                  {/* Topic Title & Blue Accent Bar */}
                  <header className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                    <div>
                      <h1 
                        id="notes-topic-heading"
                        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug sm:leading-tight transition-colors break-words ${
                          readingTheme === 'dark' 
                            ? 'text-white' 
                            : readingTheme === 'sepia' 
                              ? 'text-[#2E2221]' 
                              : 'text-slate-900'
                        }`}
                      >
                        {activeTopic.title}
                      </h1>
                      
                      {activeTopic.hindiTitle && (
                        <p 
                          className={`text-sm sm:text-base md:text-lg font-semibold mt-1.5 transition-colors break-words ${
                            readingTheme === 'dark'
                              ? 'text-blue-300'
                              : readingTheme === 'sepia'
                                ? 'text-[#8A502E]'
                                : 'text-blue-700'
                          }`}
                        >
                          {activeTopic.hindiTitle}
                        </p>
                      )}

                      {/* Clean Blue Horizontal Accent Line */}
                      <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-blue-600 rounded-full mt-3 sm:mt-3.5" />
                    </div>

                    {/* Quick Tools Row (Share Button active, print and copy removed) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{activeTopic.readTime || '3 min read'}</span>
                        </div>
                        {activeTopic.views !== undefined && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{`${activeTopic.views.toLocaleString()} reads`}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Share Button with feedback */}
                        <button
                          id="notes-action-share-btn"
                          onClick={handleShare}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                            readingTheme === 'dark'
                              ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                              : readingTheme === 'sepia'
                                ? 'border-[#E2D5C3] text-[#4A3E3D] hover:bg-[#EFE5D3]'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                          title="Share this note"
                          aria-label="Share note"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </header>

                  {/* Render Protected Note HTML Content */}
                  <div 
                    className={`notes-body font-size-${fontSize} ${typographyStyleClass} py-4 select-none notes-protected-content`}
                    dangerouslySetInnerHTML={{ 
                      __html: activeTopic.content 
                    }}
                  />

                  {/* Bottom Navigation Section (< Previous, 1 / 6, Next >) */}
                  <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    
                    {/* Previous Topic Button */}
                    <button
                      id="notes-prev-topic-btn"
                      disabled={!prevTopic}
                      onClick={() => {
                        if (prevTopic && currentCourse && currentChapter) {
                          requestFullscreenSafe();
                          navigate(`/notes/${currentCourse.id}/${currentChapter.id}/${prevTopic.id}`, { replace: true });
                        }
                      }}
                      className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                        prevTopic 
                          ? 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' 
                          : 'opacity-40 cursor-not-allowed text-slate-400'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      <span>Previous</span>
                    </button>

                    {/* Pagination Step Indicator: '1 / 6' */}
                    <div className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 select-none">
                      {currentTopicIndex >= 0 && currentChapterTopics.length > 0
                        ? `${currentTopicIndex + 1} / ${currentChapterTopics.length}`
                        : '1 / 6'}
                    </div>

                    {/* Next Topic Button */}
                    {nextTopic && currentCourse && currentChapter ? (
                      <button
                        id="notes-next-topic-btn"
                        onClick={() => {
                          requestFullscreenSafe();
                          navigate(`/notes/${currentCourse.id}/${currentChapter.id}/${nextTopic.id}`, { replace: true });
                        }}
                        className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleExitReader}
                        className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Done</span>
                      </button>
                    )}

                  </footer>

                </article>

              </div>

              {/* =============================================================== */}
              {/* 🔵 RIGHT SIDE AD PLACEMENTS (Official AdSense Slots) */}
              {/* =============================================================== */}
              <aside 
                className="hidden xl:flex flex-col w-72 2xl:w-80 shrink-0 sticky top-2 space-y-4 select-none"
                aria-label="Sponsored Content"
              >
                {/* 1. Primary Sidebar Ad Unit */}
                <div className="p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-2xs relative">
                  <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center justify-between">
                    <span>Advertisement</span>
                    <Info className="w-3 h-3 text-slate-400" />
                  </div>
                  <AdUnit format="rectangle" />
                </div>

                {/* 2. Secondary Vertical Ad Unit */}
                <div className="p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-2xs relative">
                  <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center justify-between">
                    <span>Sponsored Link</span>
                    <Info className="w-3 h-3 text-slate-400" />
                  </div>
                  <AdUnit format="vertical" />
                </div>
              </aside>

            </div>
          ) : (
            <div className="my-auto flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-slate-800 text-blue-600 flex items-center justify-center text-2xl">
                📑
              </div>
              <h2 className="text-xl font-bold">No Notes Selected</h2>
              <p className="text-sm text-slate-500">
                Please select a chapter and topic from the sidebar navigation to start reading.
              </p>
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Open Topics List
              </button>
            </div>
          )}
        </main>

      </div>

    </div>
  );
}
