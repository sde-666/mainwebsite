import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Eye,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowLeft,
  ArrowUp,
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
  Circle,
  BookOpen,
  Languages
} from 'lucide-react';
import { NoteCourse, NoteChapter, NoteTopic } from '../types/notes';
import { notesService } from '../services/notesService';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';

type ReadingTheme = 'light' | 'sepia' | 'dark';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type FontFamily = 'sans' | 'serif' | 'mono';
type ContentWidth = 'narrow' | 'comfort' | 'wide';
type NoteLang = 'en' | 'hi';

interface FlowItem {
  chapter: NoteChapter;
  topic: NoteTopic;
}

const FONT_LINK_ID = 'skilldotpy-notes-reader-fonts';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap';

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function readStoredList(key: string): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export function NotesReader() {
  const {
    courseId: paramCourseId,
    chapterId: paramChapterId,
    topicId: paramTopicId
  } = useParams<{
    courseId?: string;
    chapterId?: string;
    topicId?: string;
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

  // Theme & Appearance (persisted)
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>(() =>
    readStored<ReadingTheme>('skilldotpy_notes_theme', ['light', 'sepia', 'dark'], 'light')
  );
  const [fontSize, setFontSize] = useState<FontSize>(() =>
    readStored<FontSize>('skilldotpy_reader_fontsize', ['sm', 'md', 'lg', 'xl'], 'md')
  );
  const [fontFamily, setFontFamily] = useState<FontFamily>(() =>
    readStored<FontFamily>('skilldotpy_reader_fontfamily', ['sans', 'serif', 'mono'], 'sans')
  );
  const [contentWidth, setContentWidth] = useState<ContentWidth>(() =>
    readStored<ContentWidth>('skilldotpy_reader_width_v2', ['narrow', 'comfort', 'wide'], 'comfort')
  );
  const [lang, setLang] = useState<NoteLang>(() =>
    readStored<NoteLang>('skilldotpy_reader_lang', ['en', 'hi'], 'en')
  );
  const [showTypographyMenu, setShowTypographyMenu] = useState(false);

  // Bookmarks & completed topics (persisted in localStorage)
  const [bookmarks, setBookmarks] = useState<string[]>(() => readStoredList('skilldotpy_note_bookmarks'));
  const [completed, setCompleted] = useState<string[]>(() => readStoredList('skilldotpy_notes_completed'));

  // Search & Filter in sidebar
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded chapters in accordion
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Mobile Drawers
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Interactive & Feedback Elements
  const [shareToast, setShareToast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [computedReadMin, setComputedReadMin] = useState(1);

  const mainScrollContainerRef = useRef<HTMLDivElement>(null);
  const noteBodyRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const typographyWrapRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const userExitedFullscreenRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; t: number; ignore: boolean } | null>(null);
  const lastFlowIndexRef = useRef(-2);
  const navDirRef = useRef<'next' | 'prev' | 'jump'>('jump');

  // Load reader fonts once (Inter / Noto Devanagari / Source Serif / JetBrains Mono)
  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);

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

  // Save preferences
  useEffect(() => { localStorage.setItem('skilldotpy_notes_theme', readingTheme); }, [readingTheme]);
  useEffect(() => { localStorage.setItem('skilldotpy_reader_fontsize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('skilldotpy_reader_fontfamily', fontFamily); }, [fontFamily]);
  useEffect(() => { localStorage.setItem('skilldotpy_reader_width_v2', contentWidth); }, [contentWidth]);
  useEffect(() => { localStorage.setItem('skilldotpy_reader_lang', lang); }, [lang]);

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

  // Close the Aa popover when clicking outside of it
  useEffect(() => {
    if (!showTypographyMenu) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (typographyWrapRef.current && !typographyWrapRef.current.contains(e.target as Node)) {
        setShowTypographyMenu(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [showTypographyMenu]);

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

  // Mark topics as completed
  const setTopicCompleted = (topicId: string, value: boolean) => {
    setCompleted(prev => {
      const has = prev.includes(topicId);
      if (value === has) return prev;
      const next = value ? [...prev, topicId] : prev.filter(id => id !== topicId);
      localStorage.setItem('skilldotpy_notes_completed', JSON.stringify(next));
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
      const cleanParam = paramChapterId.toLowerCase().trim();

      // 1. Direct exact match by ID
      const exactMatch = currentCourseChapters.find(ch =>
        ch.id === paramChapterId ||
        ch.id.toLowerCase() === cleanParam
      );
      if (exactMatch) return exactMatch;

      // 2. Safe chapter number extraction (handles "m2-ch4", "ch4", "chapter-4", "4")
      const chPatternMatch = cleanParam.match(/ch(?:apter)?[-_]?(\d+)/i) || cleanParam.match(/(?:^|[-_])(\d+)$/);
      const extractedNum = chPatternMatch ? parseInt(chPatternMatch[1], 10) : null;

      if (extractedNum !== null) {
        const numMatch = currentCourseChapters.find(ch => ch.chapterNumber === extractedNum);
        if (numMatch) return numMatch;
      }

      // 3. Match against canonical slug patterns
      const slugMatch = currentCourseChapters.find(ch =>
        `${currentCourse.id.replace('-r5', '')}-ch${ch.chapterNumber}` === cleanParam ||
        `ch${ch.chapterNumber}` === cleanParam ||
        `chapter-${ch.chapterNumber}` === cleanParam ||
        `chapter${ch.chapterNumber}` === cleanParam ||
        ch.id.toLowerCase().startsWith(cleanParam)
      );
      if (slugMatch) return slugMatch;
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

  // 7. Navigation — one continuous flow through the whole course (crosses chapter boundaries)
  const courseFlow = useMemo<FlowItem[]>(() => {
    const flow: FlowItem[] = [];
    for (const chapter of currentCourseChapters) {
      for (const topic of getTopicsForChapter(chapter)) {
        flow.push({ chapter, topic });
      }
    }
    return flow;
  }, [currentCourseChapters, getTopicsForChapter]);

  const flowIndex = useMemo(() => {
    if (!activeTopic) return -1;
    return courseFlow.findIndex(f => f.topic.id === activeTopic.id);
  }, [courseFlow, activeTopic]);

  const prevItem = flowIndex > 0 ? courseFlow[flowIndex - 1] : null;
  const nextItem = flowIndex >= 0 && flowIndex < courseFlow.length - 1 ? courseFlow[flowIndex + 1] : null;

  const currentTopicIndex = useMemo(() => {
    if (!activeTopic || currentChapterTopics.length === 0) return -1;
    return currentChapterTopics.findIndex(t => t.id === activeTopic.id);
  }, [activeTopic, currentChapterTopics]);

  // Overall course progress
  const courseTopicIds = useMemo(() => courseFlow.map(f => f.topic.id), [courseFlow]);
  const courseDoneCount = useMemo(
    () => courseTopicIds.filter(id => completed.includes(id)).length,
    [courseTopicIds, completed]
  );
  const coursePct = courseTopicIds.length > 0 ? Math.round((courseDoneCount / courseTopicIds.length) * 100) : 0;

  // 8. Search (titles, tags and full note text)
  const searchIndex = useMemo(() => {
    if (!currentCourse) return [];
    return topics
      .filter(t => t.courseId === currentCourse.id)
      .map(t => ({ topic: t, text: stripHtml(t.content || '') }));
  }, [topics, currentCourse]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !currentCourse) return null;
    const q = searchQuery.toLowerCase().trim();
    const results: { topic: NoteTopic; snippet: string }[] = [];
    for (const { topic, text } of searchIndex) {
      const inTitle = (topic.title || '').toLowerCase().includes(q) || (topic.hindiTitle || '').toLowerCase().includes(q);
      const inTags = !!topic.tags?.some(tag => tag.toLowerCase().includes(q));
      const pos = text.toLowerCase().indexOf(q);
      if (inTitle || inTags || pos >= 0) {
        let snippet = '';
        if (pos >= 0) {
          const start = Math.max(0, pos - 40);
          const end = Math.min(text.length, pos + q.length + 70);
          snippet = `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
        }
        results.push({ topic, snippet });
      }
      if (results.length >= 40) break;
    }
    return results;
  }, [searchIndex, searchQuery, currentCourse]);

  // 9. Bookmarked Topics list
  const savedTopicsList = useMemo(() => {
    return topics.filter(t => bookmarks.includes(t.id));
  }, [topics, bookmarks]);

  // Language: only offer Hindi when the topic has parallel Hindi content
  const hasHindi = !!activeTopic?.hindiContent && activeTopic.hindiContent.trim().length > 0;
  const showHindi = hasHindi && lang === 'hi';
  const activeHtml = activeTopic ? (showHindi ? activeTopic.hindiContent || '' : activeTopic.content || '') : '';
  const displayTitle = showHindi && activeTopic?.hindiTitle ? activeTopic.hindiTitle : activeTopic?.title || '';
  const subTitle = showHindi ? activeTopic?.title : activeTopic?.hindiTitle;

  // Post-process the note HTML: scroll-wrapped tables, lazy images, read time
  useLayoutEffect(() => {
    const root = noteBodyRef.current;
    if (!root) return;

    root.querySelectorAll('table').forEach(tbl => {
      if (!tbl.parentElement?.classList.contains('notes-table-wrapper')) {
        const wrap = document.createElement('div');
        wrap.className = 'notes-table-wrapper';
        tbl.parentNode?.insertBefore(wrap, tbl);
        wrap.appendChild(tbl);
      }
    });

    root.querySelectorAll('img').forEach(img => {
      img.loading = 'lazy';
      img.draggable = false;
    });

    const words = (root.textContent || '').trim().split(/\s+/).filter(Boolean).length;
    setComputedReadMin(Math.max(1, Math.round(words / 180)));
  }, [activeHtml, activeTopic?.id]);

  // Scroll progress is written straight to the DOM (no React re-render while scrolling = smooth)
  const updateScrollState = useCallback(() => {
    const el = mainScrollContainerRef.current;
    if (!el) return;
    const scrollableHeight = el.scrollHeight - el.clientHeight;
    const pct = scrollableHeight > 0 ? Math.min(100, Math.max(0, (el.scrollTop / scrollableHeight) * 100)) : 0;
    if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${pct / 100})`;
    setShowBackToTop(el.scrollTop > 700);
  }, []);

  const handleContainerScroll = () => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      updateScrollState();
    });
  };

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  // Scroll to top on topic change
  useEffect(() => {
    if (mainScrollContainerRef.current) {
      mainScrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
    if (progressBarRef.current) progressBarRef.current.style.transform = 'scaleX(0)';
    setShowBackToTop(false);
  }, [activeTopic?.id]);

  const scrollToTop = () => {
    mainScrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    if (userExitedFullscreenRef.current) return;
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
      userExitedFullscreenRef.current = false;
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      userExitedFullscreenRef.current = true;
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Work out which way we moved so the page can slide in from the correct side
  if (lastFlowIndexRef.current !== flowIndex) {
    const last = lastFlowIndexRef.current;
    navDirRef.current =
      last < 0 || flowIndex < 0 || Math.abs(flowIndex - last) !== 1
        ? 'jump'
        : flowIndex > last ? 'next' : 'prev';
    lastFlowIndexRef.current = flowIndex;
  }

  const goToItem = (item: FlowItem) => {
    if (!currentCourse) return;
    requestFullscreenSafe();
    navigate(`/notes/${currentCourse.id}/${item.chapter.id}/${item.topic.id}`, { replace: true });
    setIsMobileSidebarOpen(false);
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

  // Step-by-Step Back Handler:
  // Navigates back through notes one by one, and on the first note exits to the course page
  const handleBackStep = () => {
    if (prevItem) {
      goToItem(prevItem);
    } else {
      handleExitReader();
    }
  };

  // Finish this topic: mark complete, then go to the next topic (or exit after the last one)
  const handleCompleteAndContinue = () => {
    if (activeTopic) setTopicCompleted(activeTopic.id, true);
    if (nextItem) {
      goToItem(nextItem);
    } else {
      handleExitReader();
    }
  };

  // Swipe left / right on touch screens to change topic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }
    const target = e.target as HTMLElement;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: Date.now(),
      ignore: !!target.closest('.notes-table-wrapper, pre, details')
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || start.ignore) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Date.now() - start.t > 600) return;
    if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
    if (dx < 0 && nextItem) goToItem(nextItem);
    else if (dx > 0 && prevItem) goToItem(prevItem);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement;
      if (typing) {
        if (e.key === 'Escape' && e.target instanceof HTMLInputElement) {
          e.target.blur();
        }
        return;
      }
      if (e.key === 'Escape') {
        if (showTypographyMenu) {
          setShowTypographyMenu(false);
        } else if (isMobileSidebarOpen) {
          setIsMobileSidebarOpen(false);
        } else {
          handleExitReader();
        }
      } else if (e.key === 'ArrowRight' && nextItem) {
        goToItem(nextItem);
      } else if (e.key === 'ArrowLeft' && prevItem) {
        goToItem(prevItem);
      } else if (e.key === '/') {
        e.preventDefault();
        if (window.innerWidth < 768) setIsMobileSidebarOpen(true);
        else setIsSidebarOpen(true);
        setActiveTab('contents');
        setTimeout(() => searchInputRef.current?.focus(), 60);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const fontClass = fontFamily === 'serif' ? 'nr-font-serif' : fontFamily === 'mono' ? 'nr-font-mono' : '';
  const isCurrentTopicBookmarked = activeTopic ? bookmarks.includes(activeTopic.id) : false;
  const isCurrentTopicCompleted = activeTopic ? completed.includes(activeTopic.id) : false;
  const readTimeLabel = activeTopic?.readTime || `${computedReadMin} min read`;

  const chapterLabel = (ch?: NoteChapter | null) =>
    ch ? `Chapter ${ch.chapterNumber}${ch.title ? `: ${ch.title}` : ''}` : '';

  return (
    <div
      className={`nr-root nr-${readingTheme} ${fontClass} nr-width-${contentWidth} notes-reader-theme-${readingTheme} nr-enter fixed inset-0 z-50 overflow-hidden flex flex-col select-none`}
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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 nr-pop">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Note link copied to clipboard!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR + READING PROGRESS                                  */}
      {/* ========================================================================= */}
      <header className="relative h-14 sm:h-16 px-2 sm:px-4 md:px-5 border-b nr-surface nr-border flex items-center justify-between z-30 shrink-0 gap-2">

        {/* Reading progress line (sits on the header's bottom edge) */}
        <div className="absolute left-0 right-0 -bottom-px h-[3px] nr-progress-track overflow-hidden" aria-hidden="true">
          <div ref={progressBarRef} className="h-full w-full nr-progress-bar origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>

        {/* Left Side: Sidebar Toggle, Back Button & Breadcrumb */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
          <button
            id="notes-toggle-sidebar-btn"
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsMobileSidebarOpen(!isMobileSidebarOpen);
              } else {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
            className="nr-btn h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
            title={isSidebarOpen ? 'Hide contents' : 'Show contents'}
            aria-label="Toggle notes navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            id="notes-back-step-btn"
            onClick={handleBackStep}
            className="nr-btn h-10 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 text-sm font-semibold shrink-0"
            title={prevItem ? 'Back to previous topic' : 'Exit back to course syllabus'}
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Breadcrumb: Course · Chapter / Topic title */}
          <div className="flex flex-col min-w-0 pl-1 leading-tight">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold nr-muted min-w-0">
              {currentCourse && (
                <span className="nr-accent-soft px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide shrink-0">
                  {currentCourse.badge}
                </span>
              )}
              <span className="truncate">
                {currentChapter ? `Chapter ${currentChapter.chapterNumber}` : ''}
                {currentChapterTopics.length > 0 && currentTopicIndex >= 0
                  ? ` · Topic ${currentTopicIndex + 1}/${currentChapterTopics.length}`
                  : ''}
              </span>
            </div>
            <div className="text-sm sm:text-[15px] font-bold nr-heading truncate mt-0.5">
              {activeTopic?.title || 'Notes'}
            </div>
          </div>
        </div>

        {/* Right Side: Language, Appearance, Bookmark, Fullscreen, Exit */}
        <div className="flex items-center gap-1.5 shrink-0">

          {hasHindi && (
            <div className="nr-segment hidden sm:flex items-center rounded-xl p-0.5 text-xs font-bold" role="group" aria-label="Note language">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 h-8 rounded-[10px] cursor-pointer ${!showHindi ? 'nr-segment-on' : 'nr-muted'}`}
                aria-pressed={!showHindi}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2.5 h-8 rounded-[10px] cursor-pointer ${showHindi ? 'nr-segment-on' : 'nr-muted'}`}
                aria-pressed={showHindi}
              >
                हिं
              </button>
            </div>
          )}

          <button
            id="notes-theme-switcher-btn"
            onClick={() => {
              setReadingTheme(prev => (prev === 'light' ? 'sepia' : prev === 'sepia' ? 'dark' : 'light'));
            }}
            className="nr-btn h-10 w-10 rounded-xl flex items-center justify-center"
            title="Switch theme (Light → Sepia → Dark)"
            aria-label="Toggle Reading Theme"
          >
            {readingTheme === 'dark' ? <Moon className="w-4 h-4 text-blue-300" /> :
              readingTheme === 'sepia' ? <Coffee className="w-4 h-4 text-amber-700" /> :
              <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Appearance popover */}
          <div className="relative" ref={typographyWrapRef}>
            <button
              id="notes-typography-toggle-btn"
              onClick={() => setShowTypographyMenu(!showTypographyMenu)}
              className={`nr-btn h-10 w-10 rounded-xl flex items-center justify-center ${showTypographyMenu ? 'nr-btn-on' : ''}`}
              title="Text size, font & width"
              aria-label="Text Settings"
              aria-expanded={showTypographyMenu}
            >
              <Type className="w-4 h-4" />
            </button>

            {showTypographyMenu && (
              <div className="nr-pop nr-card absolute right-0 top-12 w-[19rem] max-w-[88vw] p-4 rounded-2xl border z-50">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b nr-border">
                  <span className="text-xs font-extrabold uppercase tracking-wider nr-heading">Reading appearance</span>
                  <button onClick={() => setShowTypographyMenu(false)} className="p-1 rounded-lg nr-muted hover:opacity-70 cursor-pointer" aria-label="Close">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="text-[11px] font-bold nr-muted uppercase tracking-wider mb-1.5">Text size</div>
                  <div className="nr-segment grid grid-cols-4 gap-1 p-1 rounded-xl items-end">
                    {(['sm', 'md', 'lg', 'xl'] as const).map((sz, i) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`h-9 rounded-lg transition-all cursor-pointer flex items-center justify-center ${fontSize === sz ? 'nr-segment-on' : 'nr-muted'}`}
                        style={{ fontSize: `${12 + i * 3}px`, fontWeight: 700 }}
                        aria-label={`Text size ${sz}`}
                        aria-pressed={fontSize === sz}
                      >
                        A
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[11px] font-bold nr-muted uppercase tracking-wider mb-1.5">Font</div>
                  <div className="nr-segment grid grid-cols-3 gap-1 p-1 rounded-xl">
                    {([
                      ['sans', 'Sans', 'Inter, sans-serif'],
                      ['serif', 'Serif', "'Source Serif 4', Georgia, serif"],
                      ['mono', 'Mono', "'JetBrains Mono', monospace"]
                    ] as const).map(([key, label, ff]) => (
                      <button
                        key={key}
                        onClick={() => setFontFamily(key)}
                        className={`h-9 text-xs rounded-lg transition-all cursor-pointer ${fontFamily === key ? 'nr-segment-on' : 'nr-muted font-semibold'}`}
                        style={{ fontFamily: ff }}
                        aria-pressed={fontFamily === key}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[11px] font-bold nr-muted uppercase tracking-wider mb-1.5">Page width</div>
                  <div className="nr-segment grid grid-cols-3 gap-1 p-1 rounded-xl">
                    {([
                      ['narrow', 'Narrow'],
                      ['comfort', 'Comfort'],
                      ['wide', 'Wide']
                    ] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setContentWidth(key)}
                        className={`h-9 text-xs rounded-lg transition-all cursor-pointer ${contentWidth === key ? 'nr-segment-on' : 'nr-muted font-semibold'}`}
                        aria-pressed={contentWidth === key}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold nr-muted uppercase tracking-wider mb-1.5">Theme</div>
                  <div className="nr-segment grid grid-cols-3 gap-1 p-1 rounded-xl">
                    {([
                      ['light', 'Light', Sun],
                      ['sepia', 'Sepia', Coffee],
                      ['dark', 'Dark', Moon]
                    ] as const).map(([key, label, Icon]) => (
                      <button
                        key={key}
                        onClick={() => setReadingTheme(key)}
                        className={`h-9 flex items-center justify-center gap-1.5 text-xs rounded-lg transition-all cursor-pointer ${readingTheme === key ? 'nr-segment-on' : 'nr-muted font-semibold'}`}
                        aria-pressed={readingTheme === key}
                      >
                        <Icon className="w-3.5 h-3.5" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {activeTopic && (
            <button
              id="notes-quick-bookmark-btn"
              onClick={(e) => toggleBookmark(activeTopic.id, e)}
              className={`nr-btn h-10 w-10 rounded-xl flex items-center justify-center ${isCurrentTopicBookmarked ? 'nr-btn-on' : ''}`}
              title={isCurrentTopicBookmarked ? 'Bookmarked (click to remove)' : 'Save / bookmark this note'}
              aria-label="Bookmark Note"
            >
              {isCurrentTopicBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}

          <button
            id="notes-fullscreen-toggle-btn"
            onClick={toggleBrowserFullscreen}
            className="nr-btn hidden md:flex h-10 w-10 rounded-xl items-center justify-center"
            title="Toggle fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isBrowserFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            id="notes-exit-reader-btn"
            onClick={handleExitReader}
            className="nr-btn h-10 px-2.5 sm:px-3.5 rounded-xl text-sm font-semibold flex items-center gap-1.5"
            title="Exit notes reading mode"
            aria-label="Exit Reader"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN BODY (SIDEBAR + READING CANVAS)                                   */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">

        {/* Mobile Backdrop Overlay for Sidebar */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-[35] bg-black/50 backdrop-blur-[2px] md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ======================================================================= */}
        {/* LEFT NAVIGATION SIDEBAR                                                  */}
        {/* ======================================================================= */}
        <aside
          className={`
            fixed md:relative z-40 inset-y-0 left-0 md:inset-auto h-full
            w-[19rem] max-w-[88vw] shrink-0 border-r flex flex-col transition-transform md:transition-all duration-200
            nr-surface nr-border shadow-2xl md:shadow-none
            ${isSidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full md:w-0 md:border-r-0 md:overflow-hidden'}
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >

          {/* Brand + course progress */}
          <div className="px-4 pt-4 pb-3 border-b nr-border shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-black tracking-tight leading-none nr-heading">
                  Skill<span className="text-red-500 font-extrabold">.</span>py
                </div>
                <span className="text-[10px] font-bold nr-accent uppercase tracking-[0.14em] mt-1.5 block">
                  NIELIT Notes Hub
                </span>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="md:hidden p-1.5 rounded-lg nr-muted cursor-pointer"
                aria-label="Close Mobile Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3.5">
              <div className="flex items-center justify-between text-[11px] font-semibold nr-muted mb-1.5">
                <span>Your progress</span>
                <span className="nr-heading">{courseDoneCount}/{courseTopicIds.length} topics · {coursePct}%</span>
              </div>
              <div className="h-1.5 rounded-full nr-progress-track overflow-hidden">
                <div className="h-full rounded-full nr-progress-bar" style={{ width: `${coursePct}%` }} />
              </div>
            </div>
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
              className="nr-input w-full px-3 py-2.5 text-xs font-semibold rounded-xl cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.badge} - {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Segmented Control + Search */}
          <div className="p-3 shrink-0 space-y-2.5">
            <div className="nr-segment grid grid-cols-2 gap-1 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab('contents')}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'contents' ? 'nr-segment-on' : 'nr-muted font-semibold'}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Contents</span>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'saved' ? 'nr-segment-on' : 'nr-muted font-semibold'}`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved</span>
                {bookmarks.length > 0 && (
                  <span className="min-w-4 h-4 px-1 rounded-full nr-accent-fill text-[10px] flex items-center justify-center font-bold">
                    {bookmarks.length}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 nr-muted" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search this module…  ( / )"
                className="nr-input w-full pl-8 pr-8 py-2.5 text-xs rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 nr-muted hover:opacity-70 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Chapter Accordion / Saved Topics Area */}
          <div className="flex-1 overflow-y-auto nr-scroll overscroll-contain px-3 pb-4 space-y-1">

            {searchQuery.trim() !== '' ? (
              /* Search Results */
              <div className="space-y-1">
                <div className="text-[11px] font-bold nr-muted uppercase tracking-wider px-2 py-1">
                  {`Search results (${searchResults?.length || 0})`}
                </div>
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map(({ topic, snippet }) => {
                    const isActive = activeTopic?.id === topic.id;
                    const chap = chapters.find(c => c.id === topic.chapterId);
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
                        className={`nr-row w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-start justify-between gap-2 ${isActive ? 'nr-row-active' : ''}`}
                      >
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{topic.title}</div>
                          {chap && <div className="text-[10px] nr-muted mt-0.5">Chapter {chap.chapterNumber}</div>}
                          {snippet && <div className="text-[11px] nr-muted mt-1 nr-clamp-2 font-normal">{snippet}</div>}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60 mt-0.5 shrink-0" />
                      </button>
                    );
                  })
                ) : (
                  <div className="p-5 text-center text-xs nr-muted">
                    {`No topics matched "${searchQuery}".`}
                  </div>
                )}
              </div>
            ) : activeTab === 'saved' ? (
              /* Saved Notes View */
              <div className="space-y-1">
                <div className="text-[11px] font-bold nr-muted uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                  <span>Saved notes</span>
                  <span className="text-[10px] nr-accent-soft font-bold px-1.5 py-0.5 rounded-md">{savedTopicsList.length}</span>
                </div>
                {savedTopicsList.length > 0 ? (
                  savedTopicsList.map((topic) => {
                    const isActive = activeTopic?.id === topic.id;
                    const savedCourse = courses.find(c => c.id === topic.courseId);
                    return (
                      <div
                        key={topic.id}
                        className={`nr-row w-full rounded-xl text-xs flex items-center justify-between px-3 py-2.5 ${isActive ? 'nr-row-active' : ''}`}
                        onClick={() => {
                          requestFullscreenSafe();
                          navigate(`/notes/${topic.courseId}/${topic.chapterId}/${topic.id}`, { replace: true });
                          setIsMobileSidebarOpen(false);
                        }}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold truncate">{topic.title}</div>
                          {savedCourse && <div className="text-[10px] nr-muted mt-0.5">{savedCourse.badge}</div>}
                        </div>
                        <button
                          onClick={(e) => toggleBookmark(topic.id, e)}
                          className="p-1 nr-muted hover:text-red-500 rounded-md cursor-pointer"
                          title="Remove bookmark"
                          aria-label="Remove bookmark"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs nr-muted space-y-2">
                    <Bookmark className="w-8 h-8 mx-auto opacity-50" />
                    <p className="font-semibold nr-soft">No saved notes yet</p>
                    <p>Tap the bookmark icon on any topic to keep it here.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Chapter accordion */
              <div className="space-y-1.5">
                {currentCourseChapters.map((chapter) => {
                  const isExpanded = !!expandedChapters[chapter.id];
                  const chapTopics = getTopicsForChapter(chapter);
                  const doneInChapter = chapTopics.filter(t => completed.includes(t.id)).length;
                  const allDone = chapTopics.length > 0 && doneInChapter === chapTopics.length;
                  const isCurrentChapter = currentChapter?.id === chapter.id;

                  return (
                    <div key={chapter.id} className="rounded-xl">
                      <button
                        onClick={() => {
                          requestFullscreenSafe();
                          setExpandedChapters(prev => ({
                            ...prev,
                            [chapter.id]: !prev[chapter.id]
                          }));
                        }}
                        className="nr-row w-full py-2.5 px-2.5 text-left flex items-center gap-2.5 rounded-xl"
                        aria-expanded={isExpanded}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-extrabold ${allDone ? 'nr-success-fill' : isCurrentChapter ? 'nr-accent-fill' : 'nr-surface-2 nr-muted'}`}
                        >
                          {allDone ? <Check className="w-4 h-4" /> : chapter.chapterNumber}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-bold nr-heading leading-snug nr-clamp-2">{chapter.title}</span>
                          <span className="block text-[10px] font-semibold nr-muted mt-0.5">
                            {chapTopics.length > 0 ? `${doneInChapter}/${chapTopics.length} done` : 'Coming soon'}
                          </span>
                        </span>
                        <ChevronDown className={`w-4 h-4 nr-muted shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="ml-[1.1rem] pl-3 border-l nr-border mt-1 mb-2 space-y-0.5">
                          {chapTopics.length > 0 ? (
                            chapTopics.map((topic, idx) => {
                              const isActive = activeTopic?.id === topic.id;
                              const isBookmarked = bookmarks.includes(topic.id);
                              const isDone = completed.includes(topic.id);

                              return (
                                <div
                                  key={topic.id}
                                  onClick={() => goToItem({ chapter, topic })}
                                  className={`nr-row w-full pl-2.5 pr-1.5 py-2 rounded-lg text-[12.5px] flex items-center justify-between gap-2 ${isActive ? 'nr-row-active' : ''}`}
                                >
                                  <div className="flex items-start gap-2 min-w-0">
                                    <span className="shrink-0 mt-[1px]">
                                      {isDone ? (
                                        <CheckCircle2 className="w-4 h-4 text-[color:var(--nr-success)]" />
                                      ) : isActive ? (
                                        <Circle className="w-4 h-4 fill-current" />
                                      ) : (
                                        <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold nr-muted">{idx + 1}</span>
                                      )}
                                    </span>
                                    <span className="leading-snug">{topic.title}</span>
                                  </div>

                                  <button
                                    onClick={(e) => toggleBookmark(topic.id, e)}
                                    className={`p-1 rounded-md shrink-0 cursor-pointer transition-opacity ${isBookmarked ? 'nr-accent opacity-100' : 'nr-muted opacity-50 hover:opacity-100'}`}
                                    title={isBookmarked ? 'Bookmarked' : 'Bookmark note'}
                                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark note'}
                                  >
                                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                                  </button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[11px] nr-muted p-2 italic">No topics added yet.</div>
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
        {/* 3. READING CANVAS                                                        */}
        {/* ======================================================================= */}
        <main
          ref={mainScrollContainerRef}
          onScroll={handleContainerScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden nr-scroll select-none relative overscroll-contain"
        >
          {loading ? (
            <div className="mx-auto w-full max-w-[var(--nr-measure)] px-4 sm:px-6 py-8 space-y-4" aria-busy="true">
              <div className="h-4 w-40 rounded nr-skeleton" />
              <div className="h-9 w-3/4 rounded-lg nr-skeleton" />
              <div className="h-4 w-1/2 rounded nr-skeleton" />
              <div className="pt-6 space-y-3">
                {[100, 94, 98, 88, 96, 70].map((w, i) => (
                  <div key={i} className="h-4 rounded nr-skeleton" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          ) : activeTopic ? (
            <div className="mx-auto w-full px-0 sm:px-5 lg:px-8 py-0 sm:py-5 lg:py-8 pb-6">

              <div className="mx-auto w-full max-w-[var(--nr-measure)]">
                <article
                  key={activeTopic.id + (showHindi ? '-hi' : '-en')}
                  className={`nr-card nr-page-${navDirRef.current} sm:rounded-3xl sm:border notes-protected-content px-5 pt-6 pb-8 sm:px-9 sm:pt-9 md:px-12 md:pt-11 md:pb-10`}
                  onCopy={(e) => { e.preventDefault(); return false; }}
                  onCut={(e) => { e.preventDefault(); return false; }}
                  onContextMenu={(e) => { e.preventDefault(); return false; }}
                  onDragStart={(e) => { e.preventDefault(); return false; }}
                >

                  {/* Topic header */}
                  <header className="pb-6 border-b nr-border">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] nr-accent">
                      <span className="nr-accent-soft px-2.5 py-1 rounded-full">
                        {currentChapter ? `Chapter ${currentChapter.chapterNumber}` : 'Notes'}
                      </span>
                      {currentTopicIndex >= 0 && (
                        <span className="nr-muted">Topic {currentTopicIndex + 1} of {currentChapterTopics.length}</span>
                      )}
                    </div>

                    <h1
                      id="notes-topic-heading"
                      className="mt-3.5 text-[1.65rem] sm:text-3xl md:text-[2.15rem] font-extrabold tracking-tight leading-[1.2] nr-heading break-words"
                    >
                      {displayTitle}
                    </h1>

                    {subTitle && (
                      <p className="mt-2 text-base sm:text-lg font-semibold nr-accent break-words" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                        {subTitle}
                      </p>
                    )}

                    {currentChapter && (
                      <p className="mt-2 text-xs nr-muted font-medium">{chapterLabel(currentChapter)}</p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-xs nr-muted font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {readTimeLabel}
                        </span>
                        {activeTopic.views !== undefined && (
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            {`${activeTopic.views.toLocaleString()} reads`}
                          </span>
                        )}
                        {isCurrentTopicCompleted && (
                          <span className="flex items-center gap-1.5 font-bold text-[color:var(--nr-success)]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {hasHindi && (
                          <button
                            onClick={() => setLang(showHindi ? 'en' : 'hi')}
                            className="nr-btn sm:hidden h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            aria-label="Switch language"
                          >
                            <Languages className="w-3.5 h-3.5" />
                            {showHindi ? 'English' : 'हिंदी'}
                          </button>
                        )}
                        <button
                          id="notes-action-share-btn"
                          onClick={handleShare}
                          className="nr-btn h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                          title="Share this note"
                          aria-label="Share note"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </header>

                  {/* Note body (copy protected) */}
                  <div
                    ref={noteBodyRef}
                    className={`notes-body font-size-${fontSize} pt-7 pb-2 select-none notes-protected-content`}
                    dangerouslySetInnerHTML={{ __html: activeHtml }}
                  />

                  {/* End-of-note actions */}
                  <div className="mt-10 pt-6 border-t nr-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <button
                      onClick={() => setTopicCompleted(activeTopic.id, !isCurrentTopicCompleted)}
                      className={`nr-btn h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${isCurrentTopicCompleted ? 'nr-btn-on' : ''}`}
                    >
                      {isCurrentTopicCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      {isCurrentTopicCompleted ? 'Marked as complete' : 'Mark as complete'}
                    </button>

                    <button
                      onClick={handleCompleteAndContinue}
                      className={`h-11 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors ${nextItem ? 'nr-accent-fill' : 'nr-success-fill'}`}
                    >
                      {nextItem ? (
                        <>
                          <span>Complete &amp; next topic</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Finish module</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>

                {/* Previous / Next cards (desktop) */}
                <nav className="hidden md:grid grid-cols-2 gap-4 mt-5" aria-label="Topic navigation">
                  <button
                    id="notes-prev-topic-btn"
                    disabled={!prevItem}
                    onClick={() => prevItem && goToItem(prevItem)}
                    className={`nr-nav-card rounded-2xl p-4 text-left ${!prevItem ? 'opacity-40 pointer-events-none' : ''}`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider nr-muted">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </div>
                    <div className="mt-1.5 text-sm font-bold nr-heading nr-clamp-2">{prevItem ? prevItem.topic.title : 'You are at the start'}</div>
                    {prevItem && prevItem.chapter.id !== currentChapter?.id && (
                      <div className="mt-1 text-[11px] nr-muted">Chapter {prevItem.chapter.chapterNumber}</div>
                    )}
                  </button>

                  <button
                    id="notes-next-topic-btn"
                    disabled={!nextItem}
                    onClick={() => nextItem && goToItem(nextItem)}
                    className={`nr-nav-card rounded-2xl p-4 text-right ${!nextItem ? 'opacity-40 pointer-events-none' : ''}`}
                  >
                    <div className="flex items-center justify-end gap-1.5 text-[11px] font-bold uppercase tracking-wider nr-accent">
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="mt-1.5 text-sm font-bold nr-heading nr-clamp-2">{nextItem ? nextItem.topic.title : 'You have reached the end'}</div>
                    {nextItem && nextItem.chapter.id !== currentChapter?.id && (
                      <div className="mt-1 text-[11px] nr-muted">Chapter {nextItem.chapter.chapterNumber}: {nextItem.chapter.title}</div>
                    )}
                  </button>
                </nav>
              </div>
            </div>
          ) : (
            <div className="min-h-full flex flex-col items-center justify-center text-center p-8 space-y-4 mx-auto max-w-md">
              <div className="w-16 h-16 rounded-3xl nr-accent-soft flex items-center justify-center text-2xl">
                📑
              </div>
              <h2 className="text-xl font-bold nr-heading">No notes selected</h2>
              <p className="text-sm nr-muted">
                Pick a chapter and topic from the contents list to start reading.
              </p>
              <button
                onClick={() => (window.innerWidth < 768 ? setIsMobileSidebarOpen(true) : setIsSidebarOpen(true))}
                className="px-4 py-2.5 rounded-xl nr-accent-fill text-xs font-bold cursor-pointer"
              >
                Open contents
              </button>
            </div>
          )}

          {/* Back to top */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="nr-btn nr-pop fixed right-4 bottom-20 md:bottom-6 md:right-6 z-30 h-11 w-11 rounded-full flex items-center justify-center shadow-lg"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE BOTTOM NAVIGATION                                               */}
      {/* ========================================================================= */}
      {activeTopic && (
        <nav
          className="md:hidden shrink-0 border-t nr-surface nr-border px-3 pt-2 flex items-center gap-2 z-30"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
          aria-label="Topic navigation"
        >
          <button
            disabled={!prevItem}
            onClick={() => prevItem && goToItem(prevItem)}
            className="nr-btn h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
            aria-label="Previous topic"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="nr-btn h-11 flex-1 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold min-w-0"
            aria-label="Open contents"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {flowIndex >= 0 ? `${flowIndex + 1} / ${courseFlow.length}` : 'Contents'}
            </span>
          </button>

          <button
            disabled={!nextItem}
            onClick={() => nextItem && goToItem(nextItem)}
            className="h-11 px-4 rounded-xl nr-accent-fill flex items-center justify-center gap-1 text-sm font-bold shrink-0 disabled:opacity-40 cursor-pointer"
            aria-label="Next topic"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}