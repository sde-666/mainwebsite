import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  Clock, 
  Printer, 
  Check, 
  Copy, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Search, 
  X, 
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  List,
  Calculator,
  Bookmark,
  BookmarkCheck,
  Type,
  AlignLeft,
  Share2,
  Compass,
  GraduationCap,
  HelpCircle,
  Hash,
  ChevronUp,
  FileCheck,
  Zap,
  BookMarked
} from 'lucide-react';
import { NoteCourse, NoteChapter, NoteTopic } from '../types/notes';
import { notesService } from '../services/notesService';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { useAiAssistant } from '../context/AiAssistantContext';

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function NotesReader() {
  const { courseId: paramCourseId, chapterId: paramChapterId, topicId: paramTopicId } = useParams<{ 
    courseId?: string; 
    chapterId?: string; 
    topicId?: string 
  }>();
  const navigate = useNavigate();
  const { openAssistant } = useAiAssistant();

  const [courses, setCourses] = useState<NoteCourse[]>([]);
  const [chapters, setChapters] = useState<NoteChapter[]>([]);
  const [topics, setTopics] = useState<NoteTopic[]>([]);
  const [loading, setLoading] = useState(true);

  // Layout View Controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [isWideReadingMode, setIsWideReadingMode] = useState(true); // Default to expansive, wide layout
  
  // Typography & Reading Preferences (Persisted in localStorage)
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(() => {
    return (localStorage.getItem('skilldotpy_reader_fontsize') as any) || 'md';
  });

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
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'bookmarked'>('all');
  
  // Expanded folders in sidebar
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Memory Systems': true,
    'Software': true
  });

  // Mobile Drawers
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  // Interactive Elements
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  const contentRef = useRef<HTMLDivElement>(null);
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

  // 2. Reading Scroll Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
        setScrollProgress(scrollPercent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Resolve Active Course
  const currentCourse = useMemo(() => {
    if (courses.length === 0) return null;
    if (paramCourseId) {
      const cleanParam = paramCourseId.toLowerCase();
      const match = courses.find(c => 
        c.id === paramCourseId || 
        c.id.toLowerCase() === cleanParam ||
        c.code.toLowerCase().includes(cleanParam)
      );
      if (match) return match;
    }
    return courses[0] || null;
  }, [courses, paramCourseId]);

  // 4. Filtered Chapters for Active Course (Strictly isolated by courseId)
  const currentCourseChapters = useMemo(() => {
    if (!currentCourse) return [];
    return chapters
      .filter(ch => ch.courseId === currentCourse.id)
      .sort((a, b) => (a.chapterNumber || a.order || 0) - (b.chapterNumber || b.order || 0));
  }, [chapters, currentCourse]);

  // 5. Resolve Active Chapter (Strictly within current course)
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
        const matchingChap = currentCourseChapters.find(ch => ch.id === topicObj.chapterId);
        if (matchingChap) return matchingChap;
      }
    }

    const chapWithTopics = currentCourseChapters.find(ch => 
      topics.some(t => t.chapterId === ch.id && t.courseId === currentCourse.id)
    );
    if (chapWithTopics) return chapWithTopics;

    return currentCourseChapters[0] || null;
  }, [currentCourseChapters, paramChapterId, paramTopicId, topics, currentCourse]);

  // 6. Filtered Topics for Active Chapter (Strictly isolated by courseId & chapterId)
  const currentChapterTopics = useMemo(() => {
    if (!currentCourse || !currentChapter) {
      return [];
    }
    const filtered = topics.filter(t => 
      t.courseId === currentCourse.id && t.chapterId === currentChapter.id
    );
    return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [topics, currentChapter, currentCourse]);

  // 7. Resolve Active Topic (Strictly within current course)
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

  // Group topics by parentFolder + Search filter
  const groupedTopics = useMemo(() => {
    const rootItems: NoteTopic[] = [];
    const folders: Record<string, NoteTopic[]> = {};

    currentChapterTopics.forEach(t => {
      // Bookmark filter
      if (selectedFilter === 'bookmarked' && !bookmarks.includes(t.id)) {
        return;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = t.title.toLowerCase().includes(q) || 
                      (t.hindiTitle && t.hindiTitle.toLowerCase().includes(q)) ||
                      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)));
        if (!match) return;
      }

      if (t.parentFolder) {
        if (!folders[t.parentFolder]) {
          folders[t.parentFolder] = [];
        }
        folders[t.parentFolder].push(t);
      } else {
        rootItems.push(t);
      }
    });

    return { rootItems, folders };
  }, [currentChapterTopics, searchQuery, selectedFilter, bookmarks]);

  // Previous and Next topic navigation
  const { prevTopic, nextTopic, currentIndex, totalTopics } = useMemo(() => {
    if (!activeTopic || currentChapterTopics.length === 0) {
      return { prevTopic: null, nextTopic: null, currentIndex: 0, totalTopics: 0 };
    }
    const idx = currentChapterTopics.findIndex(t => t.id === activeTopic.id);
    return {
      prevTopic: idx > 0 ? currentChapterTopics[idx - 1] : null,
      nextTopic: idx >= 0 && idx < currentChapterTopics.length - 1 ? currentChapterTopics[idx + 1] : null,
      currentIndex: idx + 1,
      totalTopics: currentChapterTopics.length
    };
  }, [currentChapterTopics, activeTopic]);

  // 8. Extract Table of Contents (Headings) from the rendered HTML content
  const tocHeadings = useMemo<TocHeading[]>(() => {
    if (!activeTopic?.content) return [];
    
    // Parse h2 and h3 from HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(activeTopic.content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');
    
    const items: TocHeading[] = [];
    headings.forEach((h, index) => {
      const text = h.textContent?.trim() || '';
      if (!text) return;
      const level = parseInt(h.tagName.replace('H', ''), 10);
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `heading-${index}`;
      items.push({ id: slug, text, level });
    });
    
    return items;
  }, [activeTopic?.content]);

  // Insert IDs into rendered headings for TOC jumping & setup copy buttons
  useEffect(() => {
    if (!contentRef.current) return;
    
    const headings = contentRef.current.querySelectorAll('h1, h2, h3');
    headings.forEach((h, index) => {
      const text = h.textContent?.trim() || '';
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `heading-${index}`;
      h.setAttribute('id', slug);
    });

    // Add Copy buttons to <pre> code blocks automatically
    const preBlocks = contentRef.current.querySelectorAll('pre');
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return;
      
      pre.style.position = 'relative';
      const btn = document.createElement('button');
      btn.className = 'code-copy-btn absolute top-2.5 right-2.5 px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-mono border border-slate-700 transition-all cursor-pointer flex items-center gap-1';
      btn.innerHTML = '<span>Copy</span>';
      
      btn.onclick = (e) => {
        e.stopPropagation();
        const codeText = pre.querySelector('code')?.innerText || pre.innerText.replace('Copy', '');
        navigator.clipboard.writeText(codeText.trim());
        btn.innerHTML = '<span class="text-emerald-400 font-bold">Copied!</span>';
        setTimeout(() => {
          btn.innerHTML = '<span>Copy</span>';
        }, 2000);
      };

      pre.appendChild(btn);
    });

  }, [activeTopic?.content]);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveHeadingId(id);
      setIsMobileTocOpen(false);
    }
  };

  // Keyboard navigation shortcuts (Left/Right arrow for prev/next lesson, '/' for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        return;
      }
      if (e.key === 'ArrowLeft' && prevTopic) {
        handleSelectTopic(prevTopic);
      } else if (e.key === 'ArrowRight' && nextTopic) {
        handleSelectTopic(nextTopic);
      } else if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevTopic, nextTopic]);

  // Toggle Bookmark
  const toggleBookmark = (topicId: string) => {
    setBookmarks(prev => {
      const updated = prev.includes(topicId) 
        ? prev.filter(id => id !== topicId) 
        : [...prev, topicId];
      localStorage.setItem('skilldotpy_note_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // Set Font Size
  const changeFontSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    setFontSize(size);
    localStorage.setItem('skilldotpy_reader_fontsize', size);
  };

  // Folder expand/collapse toggle
  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  // Handle Course Change
  const handleSelectCourse = (newCourseId: string) => {
    const firstChap = chapters.find(ch => ch.courseId === newCourseId);
    if (firstChap) {
      const firstTop = topics.find(t => t.chapterId === firstChap.id);
      if (firstTop) {
        navigate(`/notes/${newCourseId}/${firstChap.id}/${firstTop.id}`);
      } else {
        navigate(`/notes/${newCourseId}/${firstChap.id}`);
      }
    } else {
      navigate(`/notes/${newCourseId}`);
    }
  };

  // Handle Chapter Change
  const handleSelectChapter = (newChapterId: string) => {
    const courseIdToUse = currentCourse?.id || 'm1-r5';
    const firstTop = topics.find(t => t.chapterId === newChapterId);
    if (firstTop) {
      navigate(`/notes/${courseIdToUse}/${newChapterId}/${firstTop.id}`);
    } else {
      navigate(`/notes/${courseIdToUse}/${newChapterId}`);
    }
  };

  // Handle Topic Selection
  const handleSelectTopic = (topic: NoteTopic) => {
    const targetCourseId = topic.courseId || currentCourse?.id || 'm1-r5';
    const targetChapterId = topic.chapterId || currentChapter?.id || 'm1-ch1-intro-computer';
    navigate(`/notes/${targetCourseId}/${targetChapterId}/${topic.id}`);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isCurrentBookmarked = activeTopic ? bookmarks.includes(activeTopic.id) : false;

  return (
    <div className="bg-slate-100/70 min-h-screen text-slate-800">
      <SEO 
        title={`${activeTopic?.title || 'Chapter Notes'} | ${currentCourse?.title || 'NIELIT O Level'}`}
        description={activeTopic?.hindiTitle ? `${activeTopic.title} (${activeTopic.hindiTitle}) - Comprehensive free study notes for NIELIT exams.` : 'Comprehensive free chapter notes for NIELIT exams.'}
        keywords={[
          activeTopic?.title || 'NIELIT Notes',
          currentCourse?.title || 'O Level Notes',
          'Skilldotpy free study notes',
          'NIELIT exam notes pdf'
        ]}
      />

      {/* =========================================================================
          TOP READING PROGRESS BAR (Sleek Gradient Indicator)
         ========================================================================= */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* =========================================================================
          MODERN COURSE SELECTOR TABS HEADER STRIP
         ========================================================================= */}
      <div className="bg-white border-b border-slate-200/90 sticky top-14 sm:top-15 z-30 shadow-2xs">
        <div className="max-w-[1680px] mx-auto px-3 sm:px-6 py-2.5">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* 1. Interactive Course Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-1 hidden md:inline">
                Courses:
              </span>
              {courses.map(c => {
                const isActive = c.id === currentCourse?.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCourse(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    <GraduationCap className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{c.code}</span>
                  </button>
                );
              })}
            </div>

            {/* 2. Top Right Usability Controls (Chapter Dropdown, View Toggles) */}
            <div className="flex items-center gap-2 ml-auto">
              
              {/* Chapter Selector Dropdown */}
              <div className="relative">
                <select
                  value={currentChapter?.id || ''}
                  onChange={(e) => handleSelectChapter(e.target.value)}
                  className="text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs max-w-[180px] sm:max-w-[240px] truncate pr-7"
                >
                  {currentCourseChapters.map(ch => (
                    <option key={ch.id} value={ch.id}>
                      Ch {ch.chapterNumber}: {ch.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Toggle Left Sidebar Button */}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSidebarCollapsed
                    ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title={isSidebarCollapsed ? "Open Lecture Index" : "Collapse Sidebar for Wider View"}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5 text-blue-600" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
                <span className="hidden xl:inline">{isSidebarCollapsed ? 'Show Index' : 'Hide Index'}</span>
              </button>

              {/* Toggle Reading Width (Standard / Expanded) */}
              <button
                onClick={() => setIsWideReadingMode(!isWideReadingMode)}
                className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isWideReadingMode
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Toggle Reading Canvas Width"
              >
                {isWideReadingMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden xl:inline">{isWideReadingMode ? 'Standard' : 'Full Canvas'}</span>
              </button>

              {/* Mobile Drawer Triggers */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 text-xs font-bold"
              >
                <List className="w-4 h-4" />
                <span>Lectures</span>
              </button>

              {tocHeadings.length > 0 && (
                <button
                  onClick={() => setIsMobileTocOpen(true)}
                  className="xl:hidden p-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 text-xs font-bold"
                >
                  <Hash className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">On Page</span>
                </button>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          MAIN EXPANSIVE CONTAINER (Extended Width Layout)
         ========================================================================= */}
      <div className="max-w-[1680px] mx-auto px-3 sm:px-6 py-5 sm:py-7">
        
        {/* Full Page Mode Alert Banner */}
        {isSidebarCollapsed && (
          <div className="mb-4 hidden lg:flex items-center justify-between bg-blue-50/80 border border-blue-200/70 rounded-2xl px-4 py-2 text-xs text-blue-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span><strong>Immersive Reading Canvas Active</strong>: Sidebar collapsed for maximum comfortable study space.</span>
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <PanelLeftOpen className="w-3.5 h-3.5" />
              <span>Restore Sidebar</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: SEARCHABLE LECTURE TREE (Desktop)
             ========================================================================= */}
          {!isSidebarCollapsed && (
            <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-4 no-print animate-in fade-in duration-150">
              
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                
                {/* 1. Sidebar Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                      Ch {currentChapter?.chapterNumber || 1} Syllabus
                    </span>
                    <button
                      onClick={() => setIsSidebarCollapsed(true)}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/70 transition-colors"
                      title="Hide Sidebar"
                    >
                      <PanelLeftClose className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-2 line-clamp-1">
                    {currentChapter?.title || 'Chapter Index'}
                  </h3>
                  
                  {/* 2. Fast Instant Search Input */}
                  <div className="relative mt-3">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search lecture... (/)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-7 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400 transition-all"
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

                  {/* 3. Filter Tabs (All / Bookmarked) */}
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                        selectedFilter === 'all'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      All ({currentChapterTopics.length})
                    </button>
                    <button
                      onClick={() => setSelectedFilter('bookmarked')}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-bold text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        selectedFilter === 'bookmarked'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>Saved ({currentChapterTopics.filter(t => bookmarks.includes(t.id)).length})</span>
                    </button>
                  </div>

                </div>

                {/* 4. Tree Items List */}
                <div className="p-2.5 max-h-[62vh] overflow-y-auto space-y-1 text-xs">
                  
                  {/* Root Level Items */}
                  {groupedTopics.rootItems.map(topic => {
                    const isActive = topic.id === activeTopic?.id;
                    const isBookmarked = bookmarks.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer group ${
                          isActive
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100/90'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                          <span className="truncate text-xs">{topic.title}</span>
                        </div>
                        {isBookmarked && (
                          <BookmarkCheck className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-amber-500'}`} />
                        )}
                      </button>
                    );
                  })}

                  {/* Subfolder Topic Groups */}
                  {Object.entries(groupedTopics.folders).map(([folderName, childTopics]) => {
                    const isExpanded = expandedFolders[folderName] ?? true;
                    const isFolderActive = childTopics.some(t => t.id === activeTopic?.id);

                    return (
                      <div key={folderName} className="space-y-1 pt-1">
                        
                        {/* Folder Header Item */}
                        <button
                          onClick={() => toggleFolder(folderName)}
                          className={`w-full text-left px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isFolderActive
                              ? 'bg-blue-50 text-blue-900 border border-blue-200/80'
                              : 'text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isExpanded ? (
                              <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                            ) : (
                              <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate text-xs">{folderName}</span>
                            <span className="text-[10px] font-bold text-slate-400 ml-1">({childTopics.length})</span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {/* Child topics inside Folder */}
                        {isExpanded && (
                          <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-3.5">
                            {childTopics.map(child => {
                              const isChildActive = child.id === activeTopic?.id;
                              const isChildBookmarked = bookmarks.includes(child.id);
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => handleSelectTopic(child)}
                                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                    isChildActive
                                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isChildActive ? 'text-white' : 'text-slate-400'}`} />
                                    <span className="truncate text-[11px]">{child.title}</span>
                                  </div>
                                  {isChildBookmarked && (
                                    <BookmarkCheck className={`w-3 h-3 shrink-0 ${isChildActive ? 'text-amber-300' : 'text-amber-500'}`} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    );
                  })}

                  {groupedTopics.rootItems.length === 0 && Object.keys(groupedTopics.folders).length === 0 && (
                    <div className="text-center py-8 px-3 text-slate-400 text-xs">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-slate-600">
                        {searchQuery ? `No topics match "${searchQuery}"` : 'No lecture notes found'}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mt-2 text-blue-600 hover:underline font-bold text-xs"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  )}

                </div>

                {/* 5. Bottom Navigation Shortcut Links */}
                <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold">
                  <Link to={`/o-level/${currentCourse?.id || 'm1-r5'}`} className="text-blue-600 hover:underline flex items-center gap-1">
                    <span>← Full Syllabus</span>
                  </Link>
                  <Link to="/o-level-result-calculator" className="text-emerald-700 hover:underline flex items-center gap-1">
                    <Calculator className="w-3 h-3" />
                    <span>Calculator</span>
                  </Link>
                </div>

              </div>

              {/* Sidebar Sponsor Card */}
              <AdBanner slotId="notes-sidebar-sponsor" format="rectangle" fallbackType="app" />

            </aside>
          )}

          {/* =========================================================================
              CENTER COLUMN: EXPANSIVE & PROFESSIONAL NOTE ARTICLE CANVAS
             ========================================================================= */}
          <main className={`${
            isSidebarCollapsed 
              ? (isTocCollapsed || tocHeadings.length === 0 ? 'lg:col-span-12' : 'lg:col-span-9 xl:col-span-10')
              : (isTocCollapsed || tocHeadings.length === 0 ? 'lg:col-span-9' : 'lg:col-span-6 xl:col-span-7')
          } transition-all duration-200`}>
            
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8 lg:p-12 notes-main-content">
              
              {activeTopic ? (
                <div className={isWideReadingMode ? 'w-full' : 'max-w-[85ch] mx-auto'}>
                  
                  {/* 1. Header Badges & Quick Tools */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
                    
                    {/* Course & Chapter Breadcrumb Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-blue-50 text-blue-800 text-xs font-extrabold uppercase px-3 py-1 rounded-xl tracking-wide border border-blue-200/80 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                        <span>{currentCourse?.code || 'M1-R5.1'}</span>
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold uppercase px-3 py-1 rounded-xl tracking-wide border border-slate-200">
                        {currentChapter?.title} (Ch {currentChapter?.chapterNumber || 1})
                      </span>
                      {totalTopics > 0 && (
                        <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-xl border border-emerald-200/60 hidden sm:inline-flex items-center gap-1">
                          <FileCheck className="w-3 h-3 text-emerald-600" />
                          <span>Topic {currentIndex} of {totalTopics}</span>
                        </span>
                      )}
                    </div>

                    {/* Learning Toolbar: Font Size, Bookmark, Share, Print */}
                    <div className="flex items-center gap-1.5 no-print">
                      
                      {/* Font Size Adjuster Group */}
                      <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                        <button
                          onClick={() => changeFontSize('sm')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            fontSize === 'sm' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Small font size"
                        >
                          A-
                        </button>
                        <button
                          onClick={() => changeFontSize('md')}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            fontSize === 'md' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Default font size"
                        >
                          A
                        </button>
                        <button
                          onClick={() => changeFontSize('lg')}
                          className={`px-2 py-1 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                            fontSize === 'lg' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Large font size"
                        >
                          A+
                        </button>
                        <button
                          onClick={() => changeFontSize('xl')}
                          className={`px-2 py-1 rounded-lg text-base font-bold transition-all cursor-pointer ${
                            fontSize === 'xl' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                          title="Extra large font size"
                        >
                          A++
                        </button>
                      </div>

                      {/* Bookmark Toggle Button */}
                      <button
                        onClick={() => toggleBookmark(activeTopic.id)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                          isCurrentBookmarked
                            ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        title={isCurrentBookmarked ? "Remove Bookmark" : "Save this note"}
                      >
                        {isCurrentBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="hidden md:inline">{isCurrentBookmarked ? 'Saved' : 'Save'}</span>
                      </button>

                      {/* Print Button */}
                      <button
                        onClick={handlePrint}
                        className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold transition-all cursor-pointer text-xs"
                        title="Print this note"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Share / Copy Link */}
                      <button
                        onClick={copyToClipboard}
                        className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer border ${
                          copied 
                            ? 'bg-emerald-600 text-white border-emerald-600' 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title="Share note link"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
                      </button>

                    </div>

                  </div>

                  {/* 2. Main Article Title & Hindi Subtitle */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2 break-words">
                    {activeTopic.title}
                  </h1>
                  
                  {activeTopic.hindiTitle && (
                    <p className="text-base sm:text-lg lg:text-xl font-bold text-blue-700 mb-5 break-words">
                      {activeTopic.hindiTitle}
                    </p>
                  )}

                  {/* 3. Article Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-slate-200/90 mb-8 text-xs text-slate-600 no-print bg-slate-50/50 px-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span>{activeTopic.views || 1} views</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span>{activeTopic.readTime || '3 min read'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openAssistant(currentCourse?.title || 'NIELIT Notes', `Explain "${activeTopic.title}" in simple exam-friendly terms with practical examples.`)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Explain with AI Guru</span>
                      </button>
                    </div>
                  </div>

                  {/* 4. Rich Note Body Content with Dynamic Typography */}
                  <div 
                    ref={contentRef}
                    className={`notes-body font-size-${fontSize} text-slate-800 leading-relaxed space-y-6 max-w-none break-words overflow-hidden`}
                    dangerouslySetInnerHTML={{ __html: activeTopic.content }}
                  />

                  {/* PRIME AD PLACEMENT: Topic Content End Banner */}
                  <div className="no-print pt-8">
                    <AdBanner slotId="notes-topic-end" format="horizontal" fallbackType="telegram" />
                  </div>

                  {/* 5. Bottom Navigation Bar (Prev / Next Lesson) */}
                  <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
                    {prevTopic ? (
                      <button
                        onClick={() => handleSelectTopic(prevTopic)}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-md text-left transition-all group flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:border-blue-300 shadow-2xs shrink-0">
                          <ArrowLeft className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Previous Topic</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 truncate block">
                            {prevTopic.title}
                          </span>
                        </div>
                      </button>
                    ) : (
                      <div />
                    )}

                    {nextTopic ? (
                      <button
                        onClick={() => handleSelectTopic(nextTopic)}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-md text-right transition-all group flex items-center justify-end gap-3 cursor-pointer ml-auto w-full sm:w-auto"
                      >
                        <div className="truncate text-right">
                          <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Next Topic</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 truncate block">
                            {nextTopic.title}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* 6. Ask Doubt AI Guru Tutor Card */}
                  <div className="mt-10 p-6 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-5 no-print shadow-xs">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900">Have an exam doubt in this topic?</h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                          Ask AI Guru for easy-to-remember notes, previous years' exam questions, and Hindi/English formulas.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => openAssistant(currentCourse?.title || 'NIELIT Notes', activeTopic?.title ? `I have a doubt in "${activeTopic.title}". Can you explain it simply with exam examples?` : undefined)}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
                    >
                      Ask AI Guru
                    </button>
                  </div>

                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {currentCourseChapters.length === 0 
                      ? `No Chapters or Notes in ${currentCourse?.code || 'this Course'}`
                      : 'Select a Lecture Topic to Read'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                    {currentCourseChapters.length === 0
                      ? 'You can add new chapters and detailed lecture notes for this module in the Admin Dashboard.'
                      : 'Choose any lecture topic from the syllabus tree on the left to start studying.'}
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <Link
                      to="/admin"
                      className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Open Admin Dashboard
                    </Link>
                    <Link
                      to="/"
                      className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              )}

            </div>

          </main>

          {/* =========================================================================
              RIGHT COLUMN: "ON THIS PAGE" TABLE OF CONTENTS (TOC) (Desktop)
             ========================================================================= */}
          {tocHeadings.length > 0 && !isTocCollapsed && (
            <aside className="hidden xl:block xl:col-span-2 sticky top-28 space-y-4 no-print animate-in fade-in duration-150">
              
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 text-xs">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">
                    <Hash className="w-3.5 h-3.5 text-blue-600" />
                    <span>On This Page</span>
                  </div>
                  <button
                    onClick={() => setIsTocCollapsed(true)}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
                    title="Hide Table of Contents"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <nav className="mt-3 space-y-1 max-h-[60vh] overflow-y-auto">
                  {tocHeadings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToHeading(heading.id)}
                      className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-xs cursor-pointer block truncate ${
                        heading.level === 3 ? 'pl-4 text-[11px]' : 'font-bold'
                      } ${
                        activeHeadingId === heading.id
                          ? 'bg-blue-50 text-blue-700 font-extrabold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>

                {/* Quick Top Scroll button */}
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Back to top</span>
                </button>

              </div>

              {/* TOC Column Sponsor */}
              <AdBanner slotId="notes-toc-sponsor" format="rectangle" fallbackType="youtube" />

            </aside>
          )}

        </div>
      </div>

      {/* =========================================================================
          MOBILE LECTURE TREE SLIDE-OVER DRAWER
         ========================================================================= */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden flex">
          
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-[85%] max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            
            <div>
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-700">Course Syllabus</span>
                  <h4 className="text-xs font-extrabold text-slate-900 truncate max-w-[200px]">
                    {currentChapter?.title}
                  </h4>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Course switch in mobile drawer */}
              <div className="p-3 border-b border-slate-100 bg-white">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  Switch Module
                </label>
                <select
                  value={currentCourse?.id || 'm1-r5'}
                  onChange={(e) => {
                    handleSelectCourse(e.target.value);
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full text-xs font-bold p-2 rounded-xl border border-slate-200 bg-slate-50"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 space-y-1 text-xs">
                {groupedTopics.rootItems.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      handleSelectTopic(topic);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center justify-between gap-2 cursor-pointer ${
                      topic.id === activeTopic?.id ? 'bg-blue-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{topic.title}</span>
                    </div>
                    {bookmarks.includes(topic.id) && (
                      <BookmarkCheck className="w-3 h-3 text-amber-400" />
                    )}
                  </button>
                ))}

                {Object.entries(groupedTopics.folders).map(([folderName, childTopics]) => (
                  <div key={folderName} className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                      {folderName}
                    </span>
                    {childTopics.map(child => (
                      <button
                        key={child.id}
                        onClick={() => {
                          handleSelectTopic(child);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2 cursor-pointer ${
                          child.id === activeTopic?.id ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3 h-3 shrink-0" />
                          <span className="truncate">{child.title}</span>
                        </div>
                        {bookmarks.includes(child.id) && (
                          <BookmarkCheck className="w-3 h-3 text-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
              <Link
                to="/o-level-result-calculator"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-full py-2.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 border border-blue-200"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Result Calculator</span>
              </Link>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Index
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE "ON THIS PAGE" TOC SLIDE-OVER DRAWER
         ========================================================================= */}
      {isMobileTocOpen && tocHeadings.length > 0 && (
        <div className="fixed inset-0 z-[90] xl:hidden flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileTocOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-[80%] max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Hash className="w-4 h-4 text-blue-600" />
                  <span>On This Page</span>
                </div>
                <button
                  onClick={() => setIsMobileTocOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-3 space-y-1 text-xs">
                {tocHeadings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`w-full text-left py-2 px-2.5 rounded-xl transition-all text-xs cursor-pointer block truncate ${
                      heading.level === 3 ? 'pl-4 text-[11px]' : 'font-bold'
                    } ${
                      activeHeadingId === heading.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setIsMobileTocOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Outline
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
