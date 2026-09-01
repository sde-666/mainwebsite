import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Table as TableIcon, 
  Code, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Minus, 
  Undo, 
  Redo, 
  Eye, 
  Code2, 
  Sparkles, 
  FileText, 
  Save, 
  X, 
  FolderPlus,
  Languages,
  Highlighter,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Sliders,
  BookOpen,
  Layers,
  Clock,
  Tag,
  Hash
} from 'lucide-react';
import { NoteTopic, NoteCourse, NoteChapter } from '../../types/notes';

interface RichNoteEditorProps {
  topic: Partial<NoteTopic> | null;
  courses: NoteCourse[];
  chapters: NoteChapter[];
  onSave: (topic: NoteTopic) => Promise<void>;
  onClose: () => void;
}

export function RichNoteEditor({
  topic,
  courses,
  chapters,
  onSave,
  onClose
}: RichNoteEditorProps) {
  const initialCourse = topic?.courseId || courses[0]?.id || 'm1-r5';
  const initialChapter = topic?.chapterId || chapters.find(c => c.courseId === initialCourse)?.id || '';

  const [courseId, setCourseId] = useState<string>(initialCourse);
  const [chapterId, setChapterId] = useState<string>(initialChapter);
  const [parentFolder, setParentFolder] = useState<string>(topic?.parentFolder || '');
  const [title, setTitle] = useState<string>(topic?.title || '');
  const [hindiTitle, setHindiTitle] = useState<string>(topic?.hindiTitle || '');
  const [readTime, setReadTime] = useState<string>(topic?.readTime || '2 min read');
  const [tagsInput, setTagsInput] = useState<string>(topic?.tags?.join(', ') || '');
  const [order, setOrder] = useState<number>(topic?.order || 1);
  const [contentHtml, setContentHtml] = useState<string>(topic?.content || '');
  
  // Workspace UI states - Opens Fullscreen by default for spacious editing experience
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showMetadataDrawer, setShowMetadataDrawer] = useState(false);
  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'source' | 'preview'>('wysiwyg');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ContentEditable ref
  const editableRef = useRef<HTMLDivElement>(null);

  // Sync state whenever topic prop changes (when clicking Edit on different topics)
  useEffect(() => {
    if (topic) {
      const cId = topic.courseId || courses[0]?.id || 'm1-r5';
      const chId = topic.chapterId || chapters.find(c => c.courseId === cId)?.id || '';
      setCourseId(cId);
      setChapterId(chId);
      setParentFolder(topic.parentFolder || '');
      setTitle(topic.title || '');
      setHindiTitle(topic.hindiTitle || '');
      setReadTime(topic.readTime || '2 min read');
      setTagsInput(topic.tags?.join(', ') || 'NIELIT, Notes');
      setOrder(topic.order || 1);
      setContentHtml(topic.content || '');
      if (editableRef.current) {
        editableRef.current.innerHTML = topic.content || '<p>Start writing your chapter notes here...</p>';
      }
    } else {
      const cId = courses[0]?.id || 'm1-r5';
      const chId = chapters.find(c => c.courseId === cId)?.id || '';
      setCourseId(cId);
      setChapterId(chId);
      setParentFolder('');
      setTitle('');
      setHindiTitle('');
      setReadTime('2 min read');
      setTagsInput('NIELIT, Notes');
      setOrder(1);
      setContentHtml('');
      if (editableRef.current) {
        editableRef.current.innerHTML = '<p>Start writing your chapter notes here...</p>';
      }
    }
  }, [topic, courses, chapters]);

  // Sync content into editable div when in WYSIWYG mode or on mode change
  useEffect(() => {
    if (editorMode === 'wysiwyg' && editableRef.current) {
      if (editableRef.current.innerHTML !== contentHtml) {
        editableRef.current.innerHTML = contentHtml || '<p>Start writing your chapter notes here...</p>';
      }
    }
  }, [editorMode, contentHtml]);

  // Keep contentHtml updated on input
  const handleEditableInput = () => {
    if (editableRef.current) {
      setContentHtml(editableRef.current.innerHTML);
    }
  };

  // Filter chapters by selected course
  const filteredChapters = chapters.filter(c => c.courseId === courseId);

  // Auto-update chapter if course changes
  const handleCourseChange = (newCourseId: string) => {
    setCourseId(newCourseId);
    const firstChapter = chapters.find(c => c.courseId === newCourseId);
    setChapterId(firstChapter ? firstChapter.id : '');
  };

  // Document Exec Command Helper for WYSIWYG Toolbar
  const formatDoc = (cmd: string, value: string | undefined = undefined) => {
    if (editorMode !== 'wysiwyg') {
      setEditorMode('wysiwyg');
      setTimeout(() => {
        editableRef.current?.focus();
        document.execCommand(cmd, false, value);
        handleEditableInput();
      }, 50);
      return;
    }
    editableRef.current?.focus();
    document.execCommand(cmd, false, value);
    handleEditableInput();
  };

  // Insert Rich Elements
  const insertHtmlAtCursor = (html: string) => {
    if (editorMode !== 'wysiwyg') {
      setContentHtml(prev => prev + '\n' + html);
      return;
    }
    editableRef.current?.focus();
    document.execCommand('insertHTML', false, html);
    handleEditableInput();
  };

  // 1. Insert Callout Box
  const handleInsertCallout = (type: 'info' | 'tip' | 'warning' | 'trap') => {
    const titles = {
      info: '📌 Key Information / मुख्य जानकारी',
      tip: '💡 Exam Pro-Tip / परीक्षा महत्वपूर्ण तथ्य',
      warning: '⚠️ Important Definition / आवश्यक परिभाषा',
      trap: '🎯 NIELIT Question Trap & Analysis'
    };
    const html = `
<div class="note-box note-${type === 'trap' ? 'warning' : type}">
  <h4>${titles[type]}</h4>
  <p>Write your important revision tip, definition, or key formula here...</p>
</div>
`;
    insertHtmlAtCursor(html);
  };

  // 2. Insert Formatted Table
  const handleInsertTable = () => {
    const html = `
<table class="notes-table">
  <thead>
    <tr>
      <th>Topic / Property</th>
      <th>Key Concept (विशेषता)</th>
      <th>Example / Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Item 1</strong></td>
      <td>Primary characteristic description</td>
      <td>Example 1</td>
    </tr>
    <tr>
      <td><strong>Item 2</strong></td>
      <td>Secondary characteristic description</td>
      <td>Example 2</td>
    </tr>
  </tbody>
</table>
`;
    insertHtmlAtCursor(html);
  };

  // 3. Insert Code Block
  const handleInsertCodeBlock = () => {
    const html = `
<pre><code># Python / Algorithm Example
def solve_problem():
    print("Welcome to Skilldotpy NIELIT Portal")
    return True
</code></pre>
`;
    insertHtmlAtCursor(html);
  };

  // 4. Insert Bilingual Template
  const handleInsertBilingualTemplate = () => {
    const html = `
<h2>Topic Name (विषय का नाम) :-</h2>

<p>विषय की हिंदी व्याख्या यहाँ लिखें। यह छात्रों को संकल्पना को आसानी से समझने में मदद करता है।</p>

<h3>English Explanation:</h3>
<p>Write the formal English technical definition here for clear understanding of terms.</p>

<hr />

<div class="note-box note-info">
  <h4>📌 Key Points to Remember:</h4>
  <ul>
    <li>Point 1: Important concept detail</li>
    <li>Point 2: Exam oriented point</li>
  </ul>
</div>
`;
    insertHtmlAtCursor(html);
  };

  // 5. Insert Image Modal Prompt
  const handleInsertImage = () => {
    const url = prompt('Enter Image URL (e.g. /skilldotpy-logo.svg or web link):', 'https://');
    if (url) {
      const caption = prompt('Enter Image Caption (optional):', 'Figure: Architecture Diagram');
      const html = `
<div class="text-center my-6">
  <img src="${url}" alt="${caption || 'Notes Diagram'}" class="max-h-80 mx-auto rounded-xl border border-slate-200 shadow-sm" />
  ${caption ? `<p class="text-xs text-slate-600 mt-2 font-medium italic">${caption}</p>` : ''}
</div>
`;
      insertHtmlAtCursor(html);
    }
  };

  // 6. Insert Link Prompt
  const handleInsertLink = () => {
    const url = prompt('Enter Web Link / URL:', 'https://');
    if (url) {
      formatDoc('createLink', url);
    }
  };

  // Handle Save
  const executeSave = useCallback(async () => {
    if (!title.trim()) {
      setErrorMsg('Topic title is required. Please enter an English topic title.');
      setShowMetadataDrawer(true);
      return;
    }
    if (!courseId) {
      setErrorMsg('Please select a course/paper.');
      setShowMetadataDrawer(true);
      return;
    }
    if (!chapterId) {
      setErrorMsg('Please select a chapter.');
      setShowMetadataDrawer(true);
      return;
    }

    setSaving(true);
    setErrorMsg('');

    // Capture latest content from active visual editor DOM or state
    let finalHtml = contentHtml;
    if (editorMode === 'wysiwyg' && editableRef.current) {
      finalHtml = editableRef.current.innerHTML;
    }

    // Generate clean slug ID if new
    const topicId = topic?.id || `${courseId}-${chapterId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newTopic: NoteTopic = {
      id: topicId,
      courseId,
      chapterId,
      ...(parentFolder.trim() ? { parentFolder: parentFolder.trim() } : {}),
      title: title.trim(),
      ...(hindiTitle.trim() ? { hindiTitle: hindiTitle.trim() } : {}),
      content: finalHtml,
      readTime: readTime.trim() || '2 min read',
      views: topic?.views || 1,
      tags: tags.length > 0 ? tags : ['NIELIT', 'Notes'],
      order: Number(order) || 1,
      updatedAt: Date.now()
    };

    try {
      await onSave(newTopic);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save note.');
    } finally {
      setSaving(false);
    }
  }, [title, courseId, chapterId, contentHtml, editorMode, topic, parentFolder, hindiTitle, readTime, tagsInput, order, onSave, onClose]);

  // Keyboard shortcut: Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        executeSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeSave]);

  const selectedCourseBadge = courses.find(c => c.id === courseId)?.badge || 'M1-R5.1';
  const selectedChapterObj = chapters.find(ch => ch.id === chapterId);
  const wordCount = contentHtml.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all ${
      isFullscreen 
        ? 'w-screen h-screen bg-slate-900/40 p-0' 
        : 'bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4'
    }`}>
      <div className={`bg-white border border-slate-200 flex flex-col overflow-hidden transition-all duration-150 ${
        isFullscreen 
          ? 'w-full h-full rounded-none shadow-none' 
          : 'w-full max-w-7xl h-[96vh] rounded-2xl shadow-2xl'
      }`}>
        
        {/* ================= 1. WORKSPACE TOP CONTROL BAR ================= */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0 select-none">
          
          {/* Left: App Branding & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                  {selectedCourseBadge}
                </span>
                <span className="text-xs font-semibold text-slate-700 truncate hidden md:inline">
                  {selectedChapterObj ? `Ch ${selectedChapterObj.chapterNumber}: ${selectedChapterObj.title}` : 'No Chapter'}
                </span>
                {parentFolder && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 hidden lg:inline">
                    📁 {parentFolder}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                {title ? title : 'Untitled Note Article (Word/Writer Workspace)'}
              </p>
            </div>
          </div>

          {/* Center: Mode Switcher (Visual Writer / HTML Code / Live Preview) */}
          <div className="flex items-center bg-slate-200/90 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setEditorMode('wysiwyg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                editorMode === 'wysiwyg'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full Visual Word/Writer Document Editor"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Visual Writer</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('source')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                editorMode === 'source'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Direct HTML Code & Tags Editor"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">HTML Code</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                editorMode === 'preview'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Student App Live Preview"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student View</span>
            </button>
          </div>

          {/* Right: Metadata Settings Toggle, Screen Size Toggle, Save & Close */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Metadata Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowMetadataDrawer(!showMetadataDrawer)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                showMetadataDrawer
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="Edit Note Metadata (Course, Chapter, Hindi Title, Tags, Order)"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Document Settings</span>
              {showMetadataDrawer ? (
                <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* Fullscreen / Window Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 bg-white cursor-pointer"
              title={isFullscreen ? 'Restore to Large Window' : 'Full Screen Workspace'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Quick Save Button */}
            <button
              type="button"
              onClick={executeSave}
              disabled={saving}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              title="Save Note (Ctrl+S / Cmd+S)"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              title="Close Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= 2. COLLAPSIBLE METADATA DRAWER ================= */}
        {showMetadataDrawer && (
          <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 animate-in slide-in-from-top-2 duration-150 shrink-0">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Course Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Course / Paper Module *</span>
                </label>
                <select
                  value={courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.badge} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Chapter *</span>
                </label>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                >
                  {filteredChapters.length === 0 ? (
                    <option value="">No chapters created yet for this course</option>
                  ) : (
                    filteredChapters.map(ch => (
                      <option key={ch.id} value={ch.id}>
                        Ch {ch.chapterNumber}: {ch.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Parent Subfolder */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sub-Folder / Group</span>
                  </span>
                  <span className="text-[10px] text-slate-500">(e.g. Memory Systems)</span>
                </label>
                <input
                  type="text"
                  placeholder="Optional folder name..."
                  value={parentFolder}
                  onChange={(e) => setParentFolder(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                />
              </div>

              {/* Read Time & Order */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Read Time</span>
                  </label>
                  <input
                    type="text"
                    placeholder="2 min read"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-slate-600" />
                    <span>Order #</span>
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                    min="1"
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  <span>Topic Search Tags (comma separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. RAM, ROM, Memory Hierarchy, Cache, Primary Storage, NIELIT M1-R5"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                />
              </div>

            </div>
          </div>
        )}

        {/* ================= 3. INLINE TOPIC & HINDI TITLE HEADER ================= */}
        <div className="px-4 sm:px-8 py-3 bg-white border-b border-slate-200/80 shrink-0">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* English Title Input */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                Note Article Title (English) *
              </label>
              <input
                type="text"
                placeholder="e.g. Types of RAM (SRAM vs DRAM), Cache Memory..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm font-bold px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-slate-900 transition-colors"
                required
              />
            </div>

            {/* Hindi Title Input */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                Hindi Subtitle (हिंदी शीर्षक)
              </label>
              <input
                type="text"
                placeholder="e.g. रैम के प्रकार (एसरैम बनाम डीरैम) और कैश मेमोरी"
                value={hindiTitle}
                onChange={(e) => setHindiTitle(e.target.value)}
                className="w-full text-sm font-semibold px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-slate-900 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ================= 4. RICH WORD / WRITER TOOLBAR (WYSIWYG Mode) ================= */}
        {editorMode === 'wysiwyg' && (
          <div className="bg-slate-100/95 border-b border-slate-200 px-4 sm:px-8 py-2 flex flex-wrap items-center gap-1 text-slate-700 shadow-2xs select-none sticky top-0 z-20 shrink-0">
            
            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
              <button
                type="button"
                onClick={() => formatDoc('undo')}
                title="Undo (Ctrl+Z)"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('redo')}
                title="Redo (Ctrl+Y)"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Heading Block Styles */}
            <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'p') formatDoc('formatBlock', '<p>');
                  else if (val === 'h2') formatDoc('formatBlock', '<h2>');
                  else if (val === 'h3') formatDoc('formatBlock', '<h3>');
                  else if (val === 'h4') formatDoc('formatBlock', '<h4>');
                  else if (val === 'blockquote') formatDoc('formatBlock', '<blockquote>');
                  e.target.value = '';
                }}
                defaultValue=""
                className="text-xs font-semibold px-2 py-1 rounded-lg bg-white border border-slate-300 focus:outline-none cursor-pointer text-slate-800"
              >
                <option value="" disabled>Typography / Heading</option>
                <option value="p">Normal Paragraph</option>
                <option value="h2">Section Title (H2)</option>
                <option value="h3">Sub-heading (H3)</option>
                <option value="h4">Small Header (H4)</option>
                <option value="blockquote">Quote Block</option>
              </select>
            </div>

            {/* Bold / Italic / Underline / Strike */}
            <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
              <button
                type="button"
                onClick={() => formatDoc('bold')}
                title="Bold (Ctrl+B)"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors font-bold cursor-pointer"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('italic')}
                title="Italic (Ctrl+I)"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('underline')}
                title="Underline (Ctrl+U)"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('strikeThrough')}
                title="Strikethrough"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            {/* Text Color & Highlighter */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-1.5">
              <div className="relative flex items-center">
                <input
                  type="color"
                  title="Text Color"
                  onChange={(e) => formatDoc('foreColor', e.target.value)}
                  className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => formatDoc('hiliteColor', '#fef08a')}
                title="Yellow Highlight"
                className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
              >
                <Highlighter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('removeFormat')}
                title="Clear Text Formatting"
                className="text-[10px] px-1.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer font-semibold"
              >
                Clear
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
              <button
                type="button"
                onClick={() => formatDoc('justifyLeft')}
                title="Align Left"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('justifyCenter')}
                title="Align Center"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('justifyRight')}
                title="Align Right"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('justifyFull')}
                title="Justify"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* Lists & Dividers */}
            <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
              <button
                type="button"
                onClick={() => formatDoc('insertUnorderedList')}
                title="Bullet List"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('insertOrderedList')}
                title="Numbered List"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => formatDoc('insertHorizontalRule')}
                title="Horizontal Divider Line"
                className="p-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Preset Callout Boxes (Info, Exam Tip, Warning, NIELIT Trap) */}
            <div className="flex items-center gap-1 border-r border-slate-300 pr-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1">Callouts:</span>
              <button
                type="button"
                onClick={() => handleInsertCallout('info')}
                title="Key Information Box"
                className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 border border-blue-200 transition-colors cursor-pointer"
              >
                <span>📌 Key Info</span>
              </button>
              <button
                type="button"
                onClick={() => handleInsertCallout('tip')}
                title="Exam Pro-Tip Box"
                className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-200 transition-colors cursor-pointer"
              >
                <span>💡 Exam Tip</span>
              </button>
              <button
                type="button"
                onClick={() => handleInsertCallout('trap')}
                title="NIELIT Exam Question Trap Box"
                className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1 border border-purple-200 transition-colors cursor-pointer"
              >
                <span>🎯 Question Trap</span>
              </button>
            </div>

            {/* Rich Embeds: Tables, Code Blocks, Images, Links, Bilingual Template */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleInsertTable}
                title="Insert Formatted Comparison Table"
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 border border-slate-300 transition-colors cursor-pointer"
              >
                <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Table</span>
              </button>

              <button
                type="button"
                onClick={handleInsertCodeBlock}
                title="Insert Code Snippet"
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 border border-slate-300 transition-colors cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-emerald-600" />
                <span>Code</span>
              </button>

              <button
                type="button"
                onClick={handleInsertImage}
                title="Insert Image with Caption"
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 bg-white border border-slate-300 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-purple-600" />
              </button>

              <button
                type="button"
                onClick={handleInsertLink}
                title="Insert Hyperlink"
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 bg-white border border-slate-300 transition-colors cursor-pointer"
              >
                <LinkIcon className="w-4 h-4 text-blue-600" />
              </button>

              <button
                type="button"
                onClick={handleInsertBilingualTemplate}
                title="Insert Hindi & English Note Layout"
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-300 transition-colors cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bilingual Template</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 5. EXPANSIVE WRITING WORKSPACE ================= */}
        <div className="flex-1 overflow-y-auto bg-slate-100/70 p-4 sm:p-8 flex flex-col">
          
          {/* WYSIWYG Document Page Mode (Google Docs / MS Word Style) */}
          {editorMode === 'wysiwyg' && (
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
              <div
                ref={editableRef}
                contentEditable
                onInput={handleEditableInput}
                className="bg-white min-h-[calc(100vh-280px)] p-8 sm:p-14 rounded-2xl border border-slate-200 shadow-sm focus:outline-none ring-0 prose prose-slate max-w-none notes-body text-slate-900 font-normal leading-relaxed"
                style={{
                  lineHeight: '1.75',
                  fontSize: '15px'
                }}
              />
            </div>
          )}

          {/* HTML Source Code Mode */}
          {editorMode === 'source' && (
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
              <div className="bg-slate-900 text-white rounded-2xl shadow-sm border border-slate-800 flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>HTML Document Source Code</span>
                  <span>{contentHtml.length} characters</span>
                </div>
                <textarea
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  className="w-full flex-1 min-h-[calc(100vh-320px)] font-mono text-xs p-6 bg-slate-900 text-emerald-400 focus:outline-none resize-none leading-relaxed"
                  placeholder="<h2>Enter HTML Content here...</h2>"
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Live Student Preview Mode */}
          {editorMode === 'preview' && (
            <div className="w-full max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {selectedCourseBadge}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {selectedChapterObj?.title}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                {title || 'Untitled Note Topic'}
              </h1>
              
              {hindiTitle && (
                <p className="text-base font-semibold text-blue-700 mb-6">
                  {hindiTitle}
                </p>
              )}

              <div 
                className="pt-2 notes-body text-slate-900 leading-relaxed" 
                dangerouslySetInnerHTML={{ 
                  __html: contentHtml || '<p class="text-slate-500 italic">No note content written yet. Switch to Visual Writer to start writing!</p>' 
                }} 
              />
            </div>
          )}
        </div>

        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="px-6 py-2.5 bg-red-50 text-red-800 text-xs font-bold border-t border-red-200 flex items-center justify-between shrink-0">
            <span>⚠️ {errorMsg}</span>
            <button 
              type="button" 
              onClick={() => setErrorMsg('')}
              className="text-red-600 hover:text-red-800 text-xs font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ================= 6. STATUS BAR & SAVE CONTROLS ================= */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Document Workspace
            </span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 bg-slate-200 border border-slate-300 rounded text-[10px] font-mono">Ctrl+S</kbd> to save anytime</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={executeSave}
              disabled={saving}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Article...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Note Article</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
