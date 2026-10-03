import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  BookOpen,
  Check,
  Bookmark,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sun,
  Moon,
  Lightbulb,
  X,
  SkipForward,
  Target
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { chapterMcqService } from '../services/chapterMcqService';
import { ChapterMcqItem, ChapterMeta, PaperMeta } from '../types/chapterMcq';

type LangMode = 'both' | 'en' | 'hi';
type Theme = 'light' | 'dark';
type FontScale = 'sm' | 'md' | 'lg';
type Sheet = null | 'palette' | 'settings' | 'reset';
type Dir = 'next' | 'prev' | 'jump';

interface SavedProgress {
  order: string[];
  answers: Record<string, number>;
  index: number;
}

const FONT_LINK_ID = 'skilldotpy-notes-reader-fonts';
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap';

const correctOf = (q: ChapterMcqItem): number => q.correctIndex ?? q.correctAnswer ?? 0;

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------------ */
/* Small presentational pieces                                               */
/* ------------------------------------------------------------------------ */

function ScoreRing({ percent }: { percent: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 80);
    return () => window.clearTimeout(t);
  }, []);
  const r = 54;
  const c = 2 * Math.PI * r;
  const color = percent >= 70 ? 'var(--mq-good)' : percent >= 50 ? 'var(--mq-warn)' : 'var(--mq-bad)';
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="11" className="mq-ring-track" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          strokeWidth="11"
          strokeLinecap="round"
          className="mq-ring-bar"
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={on ? c - (c * percent) / 100 : c}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black mq-heading leading-none">{percent}%</span>
        <span className="text-[11px] font-bold mq-muted mt-1 uppercase tracking-wider">Accuracy</span>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: `${(i % 7) * 0.18}s`,
        dx: `${((i * 53) % 120) - 60}px`,
        color: ['#2563eb', '#7c3aed', '#db2777', '#f59e0b', '#16a34a', '#06b6d4'][i % 6],
        dur: `${2.6 + (i % 5) * 0.28}s`
      })),
    []
  );
  return (
    <div className="mq-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          style={{ left: p.left, background: p.color, animationDelay: p.delay, animationDuration: p.dur, ['--dx' as string]: p.dx }}
        />
      ))}
    </div>
  );
}

interface PaletteProps {
  questions: ChapterMcqItem[];
  answers: Record<string, number>;
  bookmarks: Record<string, boolean>;
  currentId?: string;
  onPick: (idx: number) => void;
}

function PaletteGrid({ questions, answers, bookmarks, currentId, onPick }: PaletteProps) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-5 gap-2 p-1">
      {questions.map((q, idx) => {
        const a = answers[q.id];
        const cls =
          a === undefined ? '' : a === correctOf(q) ? 'mq-pal-good' : 'mq-pal-bad';
        return (
          <button
            key={q.id}
            onClick={() => onPick(idx)}
            className={`mq-pal ${cls} ${q.id === currentId ? 'mq-pal-cur' : ''} ${bookmarks[q.id] ? 'mq-pal-mark' : ''}`}
            aria-label={`Question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

export function ChapterMcqPractice() {
  const { moduleId = 'm1-r5', chapterNumber = '1' } = useParams<{ moduleId: string; chapterNumber: string }>();
  const navigate = useNavigate();
  const chapterNum = parseInt(chapterNumber, 10) || 1;
  const storageKey = `skilldotpy_mcq_progress_${moduleId}_${chapterNum}`;

  const [paper, setPaper] = useState<PaperMeta | undefined>(undefined);
  const [chapterMeta, setChapterMeta] = useState<ChapterMeta | undefined>(undefined);
  const [questions, setQuestions] = useState<ChapterMcqItem[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState(0);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('skilldotpy_mcq_bookmarks') || '{}') || {};
    } catch {
      return {};
    }
  });
  const [reviewMode, setReviewMode] = useState(false);
  const [finished, setFinished] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);

  // Preferences (persisted)
  const [langMode, setLangMode] = useState<LangMode>(() => readStored<LangMode>('skilldotpy_mcq_lang', ['both', 'en', 'hi'], 'both'));
  const [theme, setTheme] = useState<Theme>(() => readStored<Theme>('skilldotpy_mcq_theme', ['light', 'dark'], 'light'));
  const [fontScale, setFontScale] = useState<FontScale>(() => readStored<FontScale>('skilldotpy_mcq_fs', ['sm', 'md', 'lg'], 'md'));
  const [autoNext, setAutoNext] = useState<boolean>(() => {
    try {
      return localStorage.getItem('skilldotpy_mcq_autonext') === '1';
    } catch {
      return false;
    }
  });

  const mainRef = useRef<HTMLDivElement>(null);
  const explRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef<Dir>('jump');
  const autoTimerRef = useRef<number | null>(null);
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => { try { localStorage.setItem('skilldotpy_mcq_lang', langMode); } catch { /* ignore */ } }, [langMode]);
  useEffect(() => { try { localStorage.setItem('skilldotpy_mcq_theme', theme); } catch { /* ignore */ } }, [theme]);
  useEffect(() => { try { localStorage.setItem('skilldotpy_mcq_fs', fontScale); } catch { /* ignore */ } }, [fontScale]);
  useEffect(() => { try { localStorage.setItem('skilldotpy_mcq_autonext', autoNext ? '1' : '0'); } catch { /* ignore */ } }, [autoNext]);

  // Fonts (shared with the notes reader)
  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);

  const clearAutoTimer = () => {
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  // Load questions (restoring the student's saved order + answers if any)
  useLayoutEffect(() => {
    const pMeta = chapterMcqService.getPaperMeta(moduleId);
    setPaper(pMeta);
    setChapterMeta(chapterMcqService.getChapterMeta(moduleId, chapterNum));

    const mcqs = chapterMcqService.getByChapter(moduleId, chapterNum);
    let saved: SavedProgress | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    } catch {
      saved = null;
    }

    let ordered: ChapterMcqItem[];
    let restoredAnswers: Record<string, number> = {};
    let restoredIndex = 0;
    if (saved && Array.isArray(saved.order) && saved.order.length > 0) {
      const byId = new Map(mcqs.map(q => [q.id, q]));
      ordered = saved.order.map(id => byId.get(id)).filter((q): q is ChapterMcqItem => !!q);
      const inOrder = new Set(ordered.map(q => q.id));
      ordered = [...ordered, ...mcqs.filter(q => !inOrder.has(q.id))];
      restoredAnswers = Object.fromEntries(Object.entries(saved.answers || {}).filter(([id]) => byId.has(id)));
      restoredIndex = Math.min(Math.max(0, saved.index || 0), Math.max(0, ordered.length - 1));
    } else {
      ordered = shuffleArray(mcqs);
    }

    setQuestions(ordered);
    setAnswers(restoredAnswers);
    setIndex(restoredIndex);
    setStreak(0);
    setFinished(false);
    setReviewMode(false);
    setSheet(null);
    dirRef.current = 'jump';

    // Live updates from Firestore: keep order, update text, append new, drop deleted
    const unsub = chapterMcqService.subscribe(() => {
      const updated = chapterMcqService.getByChapter(moduleId, chapterNum);
      setQuestions(prev => {
        const prevIds = new Set(prev.map(q => q.id));
        const fresh = updated.filter(q => !prevIds.has(q.id));
        const kept = prev
          .map(p => updated.find(q => q.id === p.id) || null)
          .filter((q): q is ChapterMcqItem => !!q);
        return [...kept, ...fresh];
      });
      setChapterMeta(chapterMcqService.getChapterMeta(moduleId, chapterNum));
      setPaper(chapterMcqService.getPaperMeta(moduleId));
    });
    return () => {
      unsub();
      clearAutoTimer();
    };
  }, [moduleId, chapterNum, storageKey]);

  // Save progress so a refresh or a dropped connection never loses it
  useEffect(() => {
    if (questions.length === 0) return;
    try {
      const data: SavedProgress = { order: questions.map(q => q.id), answers, index };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch { /* ignore */ }
  }, [questions, answers, index, storageKey]);

  useEffect(() => {
    try { localStorage.setItem('skilldotpy_mcq_bookmarks', JSON.stringify(bookmarks)); } catch { /* ignore */ }
  }, [bookmarks]);

  /* ---------------------------- derived data ---------------------------- */
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (a === undefined) continue;
      if (a === correctOf(q)) correct++;
      else wrong++;
    }
    const answered = correct + wrong;
    return {
      correct,
      wrong,
      answered,
      skipped: questions.length - answered,
      accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0
    };
  }, [questions, answers]);

  const wrongList = useMemo(
    () => questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== correctOf(q)),
    [questions, answers]
  );

  const deck = reviewMode ? wrongList : questions;
  const total = deck.length;
  const currentQ = deck[Math.min(index, Math.max(0, total - 1))];
  const selected = currentQ ? answers[currentQ.id] : undefined;
  const isAnswered = selected !== undefined;
  const isCorrect = isAnswered && currentQ && selected === correctOf(currentQ);
  const isLast = index >= total - 1;

  /* ------------------------------ actions ------------------------------- */
  const goTo = useCallback((i: number, dir: Dir) => {
    clearAutoTimer();
    dirRef.current = dir;
    setIndex(i);
  }, []);

  const goNext = useCallback(() => {
    if (index < total - 1) goTo(index + 1, 'next');
    else setFinished(true);
  }, [index, total, goTo]);

  const goPrev = useCallback(() => {
    if (index > 0) goTo(index - 1, 'prev');
  }, [index, goTo]);

  const choose = useCallback(
    (optIdx: number) => {
      if (!currentQ || answers[currentQ.id] !== undefined) return;
      const ok = optIdx === correctOf(currentQ);
      setAnswers(prev => ({ ...prev, [currentQ.id]: optIdx }));
      setStreak(s => (ok ? s + 1 : 0));
      vibrate(ok ? 14 : [24, 50, 24]);

      // bring the explanation into view on small screens
      window.setTimeout(() => {
        explRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);

      if (autoNext && ok) {
        clearAutoTimer();
        autoTimerRef.current = window.setTimeout(() => {
          autoTimerRef.current = null;
          goNext();
        }, 1300);
      }
    },
    [currentQ, answers, autoNext, goNext]
  );

  const toggleBookmark = (id: string) => setBookmarks(prev => ({ ...prev, [id]: !prev[id] }));

  const resetAll = () => {
    clearAutoTimer();
    const fresh = shuffleArray(chapterMcqService.getByChapter(moduleId, chapterNum));
    setQuestions(fresh);
    setAnswers({});
    setStreak(0);
    setReviewMode(false);
    setFinished(false);
    setSheet(null);
    dirRef.current = 'jump';
    setIndex(0);
    try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
  };

  const startReview = () => {
    if (wrongList.length === 0) return;
    clearAutoTimer();
    setReviewMode(true);
    setFinished(false);
    dirRef.current = 'jump';
    setIndex(0);
  };

  const exitReview = () => {
    clearAutoTimer();
    setReviewMode(false);
    dirRef.current = 'jump';
    setIndex(0);
  };

  const finishSkipped = () => {
    const firstSkipped = questions.findIndex(q => answers[q.id] === undefined);
    setFinished(false);
    setReviewMode(false);
    if (firstSkipped >= 0) goTo(firstSkipped, 'jump');
  };

  const pickFromPalette = (idx: number) => {
    // palette always shows every question, so leave review mode first
    if (reviewMode) setReviewMode(false);
    goTo(idx, 'jump');
    setSheet(null);
  };

  // Scroll to the top of the question on every change
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentQ?.id]);

  /* --------------------------- keyboard + swipe -------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;

      if (e.key === 'Escape') {
        if (sheet) setSheet(null);
        else if (finished) setFinished(false);
        return;
      }
      if (sheet || finished) return;

      const key = e.key.toLowerCase();
      if (key === 'arrowright') { goNext(); return; }
      if (key === 'arrowleft') { goPrev(); return; }
      if ((key === 'enter' || key === ' ') && isAnswered) { e.preventDefault(); goNext(); return; }
      if (key === 'p') { setSheet('palette'); return; }
      if (key === 's' && currentQ) { toggleBookmark(currentQ.id); return; }
      const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      if (key in map && currentQ && map[key] < currentQ.options.length) choose(map[key]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheet, finished, isAnswered, currentQ, goNext, goPrev, choose]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) { touchRef.current = null; return; }
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchRef.current;
    touchRef.current = null;
    if (!s || sheet || finished) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Date.now() - s.t > 600 || Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  /* ------------------------------- helpers ------------------------------ */
  const showEn = langMode === 'both' || langMode === 'en';
  const hasHiQ = !!currentQ?.hindiQuestion;
  const questionHi = (langMode === 'both' || langMode === 'hi') && hasHiQ;
  // Hindi-only mode falls back to English when a question has no Hindi text
  const questionEn = showEn || (langMode === 'hi' && !hasHiQ);

  const rootClass = `mq-root mq-${theme} mq-fs-${fontScale} fixed inset-0 z-50 flex flex-col overflow-hidden`;
  const nextChapterExists = chapterNum < (paper?.chaptersCount || 9);
  const title = chapterMeta?.title || currentQ?.chapterTitle || 'Chapter Practice';

  /* ------------------------------ empty state --------------------------- */
  if (!currentQ || questions.length === 0) {
    return (
      <div className={`${rootClass} items-center justify-center p-5`}>
        <div className="mq-card rounded-3xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl mq-grad flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold mq-heading mb-2">No MCQs found for this chapter</h2>
          <p className="text-sm mq-muted mb-6">
            Questions for {paper?.title || 'this paper'} (Chapter {chapterNum}) are not available yet.
          </p>
          <div className="space-y-2.5">
            <button
              onClick={() => {
                chapterMcqService.resetToSeed();
                window.location.reload();
              }}
              className="mq-btn-primary w-full h-12 rounded-xl text-sm"
            >
              Restore standard MCQs
            </button>
            <Link to={`/chapter-wise-mcq/${moduleId}`} className="mq-btn w-full h-12 rounded-xl text-sm">
              Back to chapter list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = total > 0 ? (index + 1) / total : 0;

  return (
    <div className={rootClass}>
      <SEO
        title={`Chapter ${chapterNum}: ${chapterMeta?.title || 'MCQs'} - Practice | Skilldotpy`}
        description={`Interactive instant chapter-wise MCQ practice for ${paper?.title} Chapter ${chapterNum}. Get immediate feedback on each question with full Hindi and English explanations.`}
        canonicalUrl={`/chapter-wise-mcq/${moduleId}/${chapterNum}`}
      />

      {/* ===================================================================== */}
      {/* HEADER                                                                 */}
      {/* ===================================================================== */}
      <header className="mq-surface border-b mq-border shrink-0 relative z-20">
        <div className="max-w-6xl mx-auto px-2.5 sm:px-5 h-14 sm:h-16 flex items-center gap-2">
          <Link
            to={`/chapter-wise-mcq/${moduleId}`}
            className="mq-btn h-10 w-10 rounded-xl shrink-0"
            aria-label="Back to all chapters"
            title="Back to all chapters"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="mq-grad text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0">
                {paper?.code || moduleId.toUpperCase()}
              </span>
              <span className="text-[11px] sm:text-xs font-bold mq-muted truncate">
                Chapter {chapterNum}
                {reviewMode ? ' · Reviewing mistakes' : ''}
              </span>
            </div>
            <h1 className="text-[13px] sm:text-[15px] font-extrabold mq-heading truncate mt-0.5">{title}</h1>
          </div>

          <button
            onClick={() => setSheet('palette')}
            className="mq-btn lg:hidden h-10 px-3 rounded-xl text-xs"
            aria-label="Open question list"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden min-[400px]:inline">{stats.answered}/{questions.length}</span>
          </button>
          <button
            onClick={() => setSheet('settings')}
            className="mq-btn h-10 w-10 rounded-xl"
            aria-label="Practice settings"
            title="Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
        <div className="h-[3px] mq-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progressPct})` }} />
        </div>
      </header>

      {/* ===================================================================== */}
      {/* SUB-BAR: live score + language                                         */}
      {/* ===================================================================== */}
      <div className="mq-surface-2 border-b mq-border shrink-0 relative z-10">
        <div className="max-w-6xl mx-auto px-2.5 sm:px-5 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="mq-chip mq-chip-good"><CheckCircle2 className="w-3.5 h-3.5" />{stats.correct}</span>
            <span className="mq-chip mq-chip-bad"><XCircle className="w-3.5 h-3.5" />{stats.wrong}</span>
            {streak >= 3 && (
              <span className="mq-chip mq-chip-warn"><span className="mq-flame">🔥</span>{streak} streak</span>
            )}
          </div>

          <div className="mq-seg flex items-center rounded-xl p-0.5 text-[11px] font-bold shrink-0" role="group" aria-label="Language">
            {([['both', 'Both'], ['hi', 'हिन्दी'], ['en', 'Eng']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLangMode(key)}
                className={`px-2.5 h-8 rounded-[10px] cursor-pointer ${langMode === key ? 'mq-seg-on' : 'mq-muted'}`}
                aria-pressed={langMode === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN                                                                   */}
      {/* ===================================================================== */}
      <main
        ref={mainRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden mq-scroll overscroll-contain"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-5 py-4 sm:py-6 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-6 lg:items-start">

          {/* ------------------------- Question column ------------------------- */}
          <div className="min-w-0 max-w-3xl w-full mx-auto lg:mx-0 pb-4">
            <article
              key={currentQ.id}
              className={`mq-card rounded-3xl p-4 sm:p-7 ${dirRef.current === 'next' ? 'mq-slide-next' : dirRef.current === 'prev' ? 'mq-slide-prev' : 'mq-slide-jump'}`}
            >
              {/* top row */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="mq-grad text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">
                    Q {index + 1} <span className="opacity-70 font-bold">/ {total}</span>
                  </span>
                  {currentQ.difficulty && (
                    <span
                      className={`mq-chip ${currentQ.difficulty === 'easy' ? 'mq-chip-good' : currentQ.difficulty === 'hard' ? 'mq-chip-bad' : 'mq-chip-warn'}`}
                    >
                      {currentQ.difficulty}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleBookmark(currentQ.id)}
                  className={`mq-btn h-11 w-11 rounded-xl ${bookmarks[currentQ.id] ? 'mq-btn-on' : ''}`}
                  aria-label={bookmarks[currentQ.id] ? 'Remove bookmark' : 'Bookmark question'}
                  aria-pressed={!!bookmarks[currentQ.id]}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarks[currentQ.id] ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* question text */}
              <div className="space-y-2.5 mb-5">
                {questionEn && <h2 className="mq-q-en">{currentQ.question}</h2>}
                {questionHi && (
                  <h3 className={`mq-q-hi ${!questionEn ? 'mq-q-only-hi' : ''}`}>{currentQ.hindiQuestion}</h3>
                )}
              </div>

              {/* options */}
              <div className="space-y-2.5 sm:space-y-3" role="radiogroup" aria-label="Answer options">
                {currentQ.options.map((option, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSel = selected === optIdx;
                  const isRight = optIdx === correctOf(currentQ);
                  const hiOpt = currentQ.hindiOptions?.[optIdx];
                  const optShowEn = showEn || (langMode === 'hi' && !hiOpt);
                  const optShowHi = (langMode === 'both' || langMode === 'hi') && !!hiOpt;

                  let state = '';
                  if (isAnswered) {
                    if (isRight) state = `mq-option-correct ${isSel ? 'mq-pulse' : ''}`;
                    else if (isSel) state = 'mq-option-wrong mq-shake';
                    else state = 'mq-option-dim';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      role="radio"
                      aria-checked={isSel}
                      disabled={isAnswered}
                      onClick={() => choose(optIdx)}
                      className={`mq-option ${state}`}
                    >
                      <span className="mq-letter">{letter}</span>
                      <span className="min-w-0 flex-1 space-y-0.5">
                        {optShowEn && <span className="mq-opt-en block">{option}</span>}
                        {optShowHi && <span className={`mq-opt-hi block ${!optShowEn ? 'mq-opt-hi-main' : ''}`}>{hiOpt}</span>}
                      </span>
                      {isAnswered && isRight && <CheckCircle2 className="w-6 h-6 shrink-0 mq-check-pop" style={{ color: 'var(--mq-good)' }} />}
                      {isAnswered && isSel && !isRight && <XCircle className="w-6 h-6 shrink-0 mq-check-pop" style={{ color: 'var(--mq-bad)' }} />}
                      {!isAnswered && <span className="mq-key hidden md:inline">{letter}</span>}
                    </button>
                  );
                })}
              </div>

              {/* explanation */}
              {isAnswered && (
                <div ref={explRef} className={`mq-expl mq-expl-anim mt-5 ${isCorrect ? 'mq-expl-good' : 'mq-expl-bad'}`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="flex items-center gap-2 text-sm font-extrabold" style={{ color: isCorrect ? 'var(--mq-good)' : 'var(--mq-bad)' }}>
                      {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      {isCorrect ? 'Correct! सही उत्तर' : 'Incorrect · गलत उत्तर'}
                    </span>
                    <span className="mq-chip mq-chip-neutral">
                      <Check className="w-3.5 h-3.5" /> Answer: {String.fromCharCode(65 + correctOf(currentQ))}
                    </span>
                  </div>

                  {(currentQ.explanation || currentQ.hindiExplanation) && (
                    <div className="mt-3 space-y-2 text-[0.92rem] leading-relaxed mq-text">
                      {(langMode !== 'hi' || !currentQ.hindiExplanation) && currentQ.explanation && (
                        <p className="flex gap-2">
                          <Lightbulb className="w-4 h-4 mt-1 shrink-0" style={{ color: 'var(--mq-warn)' }} />
                          <span><strong className="mq-heading">Explanation: </strong>{currentQ.explanation}</span>
                        </p>
                      )}
                      {(langMode === 'both' || langMode === 'hi') && currentQ.hindiExplanation && (
                        <p className="flex gap-2" style={{ fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
                          <Lightbulb className="w-4 h-4 mt-1.5 shrink-0" style={{ color: 'var(--mq-accent)' }} />
                          <span><strong className="mq-heading">व्याख्या: </strong>{currentQ.hindiExplanation}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </article>

            {/* quick hint under the card (desktop) */}
            <p className="hidden md:block text-center text-[11px] mq-muted mt-3">
              Keys: <span className="mq-key">A</span> – <span className="mq-key">D</span> answer · <span className="mq-key">←</span> <span className="mq-key">→</span> navigate · <span className="mq-key">Enter</span> next · <span className="mq-key">S</span> save · <span className="mq-key">P</span> question list
            </p>
            <p className="md:hidden text-center text-[11px] mq-muted mt-3">Swipe left or right to change question</p>
          </div>

          {/* ------------------------ Desktop side panel ----------------------- */}
          <aside className="hidden lg:block sticky top-0" aria-label="Question list">
            <div className="mq-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider mq-muted">Questions</span>
                <span className="text-xs font-bold mq-heading">{stats.answered}/{questions.length} done</span>
              </div>
              <div className="max-h-[17rem] overflow-y-auto mq-scroll">
                <PaletteGrid
                  questions={questions}
                  answers={answers}
                  bookmarks={bookmarks}
                  currentId={reviewMode ? undefined : currentQ.id}
                  onPick={pickFromPalette}
                />
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[11px] font-semibold mq-muted">
                <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--mq-good)' }} />Correct</span>
                <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--mq-bad)' }} />Wrong</span>
                <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-sm inline-block mq-surface-2 border mq-border" />Pending</span>
                <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full inline-block bg-amber-400" />Saved</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="mq-surface-2 rounded-xl py-2.5"><div className="text-lg font-black" style={{ color: 'var(--mq-good)' }}>{stats.correct}</div><div className="text-[10px] font-bold mq-muted uppercase">Right</div></div>
                <div className="mq-surface-2 rounded-xl py-2.5"><div className="text-lg font-black" style={{ color: 'var(--mq-bad)' }}>{stats.wrong}</div><div className="text-[10px] font-bold mq-muted uppercase">Wrong</div></div>
                <div className="mq-surface-2 rounded-xl py-2.5"><div className="text-lg font-black mq-heading">{stats.accuracy}%</div><div className="text-[10px] font-bold mq-muted uppercase">Accuracy</div></div>
              </div>

              <div className="flex gap-2 mt-4">
                {reviewMode ? (
                  <button onClick={exitReview} className="mq-btn flex-1 h-10 rounded-xl text-xs">Exit review</button>
                ) : (
                  <button onClick={() => setSheet('reset')} className="mq-btn flex-1 h-10 rounded-xl text-xs">
                    <RotateCcw className="w-3.5 h-3.5" /> Restart
                  </button>
                )}
                <button onClick={() => setFinished(true)} className="mq-btn flex-1 h-10 rounded-xl text-xs">
                  <Target className="w-3.5 h-3.5" /> Result
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ===================================================================== */}
      {/* BOTTOM ACTION BAR                                                      */}
      {/* ===================================================================== */}
      <footer
        className="mq-surface border-t mq-border shrink-0 relative z-20"
        style={{ paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-3xl lg:max-w-6xl mx-auto px-3 sm:px-5 pt-2.5 flex items-center gap-2.5">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="mq-btn h-12 sm:h-12 w-12 sm:w-auto sm:px-5 rounded-2xl text-sm"
            aria-label="Previous question"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="hidden md:block flex-1 text-center text-xs font-bold mq-muted">
            Question {index + 1} of {total}
            {stats.skipped > 0 && !reviewMode ? ` · ${stats.skipped} unanswered` : ''}
          </span>

          {!isLast ? (
            <button
              onClick={goNext}
              className={`flex-1 md:flex-none md:min-w-[13rem] h-12 rounded-2xl text-[15px] ${
                isAnswered ? 'mq-btn-primary' : 'mq-btn'
              }`}
            >
              {isAnswered ? (
                <>Next question <ChevronRight className="w-5 h-5" /></>
              ) : (
                <>Skip <SkipForward className="w-4 h-4" /></>
              )}
            </button>
          ) : (
            <button
              onClick={() => setFinished(true)}
              className="mq-btn-primary mq-btn-good flex-1 md:flex-none md:min-w-[13rem] h-12 rounded-2xl text-[15px]"
            >
              <Award className="w-5 h-5" /> {reviewMode ? 'Finish review' : 'Finish & see result'}
            </button>
          )}
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* SHEETS                                                                 */}
      {/* ===================================================================== */}
      {sheet === 'palette' && (
        <div className="mq-backdrop" onClick={() => setSheet(null)}>
          <div className="mq-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Question list">
            <div className="mq-grab" />
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-extrabold mq-heading">All questions</h3>
                <p className="text-xs mq-muted">{stats.answered} of {questions.length} answered</p>
              </div>
              <button onClick={() => setSheet(null)} className="mq-btn h-10 w-10 rounded-xl" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>

            <PaletteGrid
              questions={questions}
              answers={answers}
              bookmarks={bookmarks}
              currentId={reviewMode ? undefined : currentQ.id}
              onPick={pickFromPalette}
            />

            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[11px] font-semibold mq-muted">
              <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--mq-good)' }} />Correct</span>
              <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'var(--mq-bad)' }} />Wrong</span>
              <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-sm inline-block mq-surface-2 border mq-border" />Pending</span>
              <span className="flex items-center gap-1"><i className="w-2.5 h-2.5 rounded-full inline-block bg-amber-400" />Saved</span>
            </div>

            <div className="flex gap-2 mt-4">
              {reviewMode ? (
                <button onClick={() => { exitReview(); setSheet(null); }} className="mq-btn flex-1 h-11 rounded-xl text-sm">Exit review</button>
              ) : (
                <button onClick={() => setSheet('reset')} className="mq-btn flex-1 h-11 rounded-xl text-sm">
                  <RotateCcw className="w-4 h-4" /> Restart
                </button>
              )}
              <button onClick={() => { setSheet(null); setFinished(true); }} className="mq-btn-primary flex-1 h-11 rounded-xl text-sm">
                See result
              </button>
            </div>
          </div>
        </div>
      )}

      {sheet === 'settings' && (
        <div className="mq-backdrop" onClick={() => setSheet(null)}>
          <div className="mq-sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Practice settings">
            <div className="mq-grab" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold mq-heading">Practice settings</h3>
              <button onClick={() => setSheet(null)} className="mq-btn h-10 w-10 rounded-xl" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider mq-muted mb-2">Theme</div>
                <div className="mq-seg grid grid-cols-2 gap-1 p-1 rounded-xl">
                  {([['light', 'Light', Sun], ['dark', 'Dark', Moon]] as const).map(([key, label, Icon]) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`h-10 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer ${theme === key ? 'mq-seg-on' : 'mq-muted font-semibold'}`}
                      aria-pressed={theme === key}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider mq-muted mb-2">Text size</div>
                <div className="mq-seg grid grid-cols-3 gap-1 p-1 rounded-xl items-end">
                  {(['sm', 'md', 'lg'] as const).map((sz, i) => (
                    <button
                      key={sz}
                      onClick={() => setFontScale(sz)}
                      className={`h-10 rounded-lg cursor-pointer flex items-center justify-center ${fontScale === sz ? 'mq-seg-on' : 'mq-muted'}`}
                      style={{ fontSize: `${13 + i * 4}px`, fontWeight: 800 }}
                      aria-pressed={fontScale === sz}
                      aria-label={`Text size ${sz}`}
                    >
                      A
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider mq-muted mb-2">Language</div>
                <div className="mq-seg grid grid-cols-3 gap-1 p-1 rounded-xl">
                  {([['both', 'Both'], ['hi', 'हिन्दी'], ['en', 'English']] as const).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setLangMode(key)}
                      className={`h-10 rounded-lg text-sm cursor-pointer ${langMode === key ? 'mq-seg-on' : 'mq-muted font-semibold'}`}
                      aria-pressed={langMode === key}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setAutoNext(v => !v)}
                className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl mq-surface-2 border mq-border text-left cursor-pointer"
                role="switch"
                aria-checked={autoNext}
              >
                <span>
                  <span className="block text-sm font-bold mq-heading">Auto-next on correct answer</span>
                  <span className="block text-xs mq-muted mt-0.5">Moves ahead by itself after a right answer</span>
                </span>
                <span
                  className="relative w-12 h-7 rounded-full shrink-0 transition-colors"
                  style={{ background: autoNext ? 'var(--mq-good)' : 'var(--mq-border)' }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform"
                    style={{ transform: autoNext ? 'translateX(20px)' : 'translateX(0)' }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {sheet === 'reset' && (
        <div className="mq-backdrop" onClick={() => setSheet(null)}>
          <div className="mq-sheet" onClick={e => e.stopPropagation()} role="alertdialog" aria-label="Restart practice">
            <div className="mq-grab" />
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'color-mix(in srgb, var(--mq-bad) 14%, transparent)', color: 'var(--mq-bad)' }}>
                <RotateCcw className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold mq-heading">Restart this chapter?</h3>
              <p className="text-sm mq-muted mt-1.5">All your answers will be cleared and the questions will be shuffled again.</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <button onClick={() => setSheet(null)} className="mq-btn h-12 rounded-xl text-sm">Cancel</button>
              <button onClick={resetAll} className="mq-btn-primary h-12 rounded-xl text-sm">Yes, restart</button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* RESULT                                                                 */}
      {/* ===================================================================== */}
      {finished && (
        <div className="mq-backdrop" onClick={() => setFinished(false)}>
          {stats.accuracy >= 70 && stats.answered > 0 && <Confetti />}
          <div className="mq-sheet text-center" onClick={e => e.stopPropagation()} role="dialog" aria-label="Practice result">
            <div className="mq-grab" />
            <span className="mq-chip mq-chip-good">
              <Award className="w-3.5 h-3.5" /> Chapter {chapterNum} {stats.skipped === 0 ? 'completed' : 'progress'}
            </span>
            <h3 className="text-2xl font-black mq-heading mt-2">
              {stats.answered === 0
                ? 'Let’s get started!'
                : stats.accuracy >= 80
                ? 'Excellent work! 🎉'
                : stats.accuracy >= 60
                ? 'Good job, keep going! 👍'
                : 'Keep practising, you’ll get there 💪'}
            </h3>
            <p className="text-xs mq-muted mt-1 truncate">{title}</p>

            <div className="my-5"><ScoreRing percent={stats.accuracy} /></div>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                ['Total', questions.length, 'var(--mq-heading)'],
                ['Right', stats.correct, 'var(--mq-good)'],
                ['Wrong', stats.wrong, 'var(--mq-bad)'],
                ['Skipped', stats.skipped, 'var(--mq-warn)']
              ].map(([label, value, color]) => (
                <div key={label as string} className="mq-surface-2 rounded-xl py-2.5 border mq-border">
                  <div className="text-xl font-black" style={{ color: color as string }}>{value}</div>
                  <div className="text-[10px] font-bold uppercase mq-muted">{label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              {stats.skipped > 0 && (
                <button onClick={finishSkipped} className="mq-btn-primary w-full h-12 rounded-xl text-sm">
                  <SkipForward className="w-4 h-4" /> Answer {stats.skipped} skipped question{stats.skipped > 1 ? 's' : ''}
                </button>
              )}
              {wrongList.length > 0 && !reviewMode && (
                <button onClick={startReview} className={`${stats.skipped > 0 ? 'mq-btn' : 'mq-btn-primary'} w-full h-12 rounded-xl text-sm`}>
                  <XCircle className="w-4 h-4" /> Review {wrongList.length} mistake{wrongList.length > 1 ? 's' : ''}
                </button>
              )}
              <button onClick={resetAll} className="mq-btn w-full h-12 rounded-xl text-sm">
                <RotateCcw className="w-4 h-4" /> Practise again
              </button>
              {nextChapterExists && (
                <button onClick={() => navigate(`/chapter-wise-mcq/${moduleId}/${chapterNum + 1}`)} className="mq-btn w-full h-12 rounded-xl text-sm">
                  Go to Chapter {chapterNum + 1} <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <Link to={`/chapter-wise-mcq/${moduleId}`} className="block text-center text-sm font-bold mq-muted py-2">
                Back to all chapters
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}