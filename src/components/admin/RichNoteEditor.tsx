import React, { useState, useRef, useEffect } from 'react';
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
  Heading1, 
  Heading2, 
  Heading3, 
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
  Check, 
  HelpCircle,
  FolderPlus,
  Languages,
  Highlighter,
  Palette
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
  
  // Editor view modes
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

  // 4. Insert Bilingual Template (Matching Screenshot style!)
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
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Topic title is required.');
      return;
    }
    if (!courseId) {
      setErrorMsg('Please select a course/paper.');
      return;
    }
    if (!chapterId) {
      setErrorMsg('Please select a chapter.');
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
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {topic?.id ? 'Edit Chapter Note Article' : 'Create New Note (Word/Writer Style)'}
              </h2>
              <p className="text-xs text-slate-600">
                Write rich formatted study notes with Hindi/English support, diagrams, and formulas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setEditorMode('wysiwyg')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  editorMode === 'wysiwyg'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Visual Writer</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('source')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  editorMode === 'source'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  editorMode === 'preview'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-600 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form & Editor Area */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
          
          {/* Metadata Bar (Course, Chapter, Titles) */}
          <div className="p-4 bg-white border-b border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* 1. Course Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Course / Paper Module *
              </label>
              <select
                value={courseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.badge} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Chapter Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Chapter *
              </label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              {filteredChapters.length === 0 && (
                <span className="text-[10px] text-amber-600 font-semibold mt-1 block">
                  Please add a chapter for this course in Admin first.
                </span>
              )}
            </div>

            {/* 3. Parent Folder (Optional Subgrouping like Memory Systems) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Sub-Folder / Group</span>
                <span className="text-[10px] text-slate-600 font-normal">(e.g. Memory Systems)</span>
              </label>
              <input
                type="text"
                placeholder="Optional folder name..."
                value={parentFolder}
                onChange={(e) => setParentFolder(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* 4. Read Time & Order */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Read Time
                </label>
                <input
                  type="text"
                  placeholder="2 min read"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Sort Order #
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  min="1"
                />
              </div>
            </div>

            {/* Title (English) */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Topic Title (English) *
              </label>
              <input
                type="text"
                placeholder="e.g. Memory Systems, Types of RAM, CPU Registers..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Title (Hindi) */}
            <div className="md:col-span-1">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Hindi Subtitle (हिंदी शीर्षक)
              </label>
              <input
                type="text"
                placeholder="e.g. कंप्यूटर मेमोरी सिस्टम"
                value={hindiTitle}
                onChange={(e) => setHindiTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-1">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="RAM, ROM, Storage, M1-R5"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Word/Writer Formatting Toolbar (Only in WYSIWYG mode) */}
          {editorMode === 'wysiwyg' && (
            <div className="bg-slate-100/90 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700 shadow-2xs select-none">
              
              {/* Undo / Redo */}
              <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
                <button
                  type="button"
                  onClick={() => formatDoc('undo')}
                  title="Undo (Ctrl+Z)"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('redo')}
                  title="Redo (Ctrl+Y)"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>

              {/* Text Style / Headings */}
              <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
                <select
                  onChange={(e) => {
                    const tag = e.target.value;
                    if (tag === 'p') formatDoc('formatBlock', '<p>');
                    else if (tag === 'h2') formatDoc('formatBlock', '<h2>');
                    else if (tag === 'h3') formatDoc('formatBlock', '<h3>');
                    else if (tag === 'h4') formatDoc('formatBlock', '<h4>');
                    else if (tag === 'blockquote') formatDoc('formatBlock', '<blockquote>');
                  }}
                  className="text-xs font-semibold px-2 py-1 rounded bg-white border border-slate-300 focus:outline-none"
                  defaultValue="p"
                >
                  <option value="p">Normal Paragraph</option>
                  <option value="h2">Heading 2 (Major Section)</option>
                  <option value="h3">Heading 3 (Sub-section)</option>
                  <option value="h4">Heading 4 (Minor Title)</option>
                  <option value="blockquote">Quote Block</option>
                </select>
              </div>

              {/* Bold, Italic, Underline, Strike */}
              <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
                <button
                  type="button"
                  onClick={() => formatDoc('bold')}
                  title="Bold (Ctrl+B)"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('italic')}
                  title="Italic (Ctrl+I)"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('underline')}
                  title="Underline (Ctrl+U)"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('strikeThrough')}
                  title="Strikethrough"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>

              {/* Text Color / Highlight */}
              <div className="flex items-center gap-1 border-r border-slate-300 pr-1.5">
                <button
                  type="button"
                  onClick={() => formatDoc('hiliteColor', '#fef08a')}
                  title="Yellow Highlight Marker"
                  className="p-1.5 rounded hover:bg-slate-200 flex items-center gap-1 text-amber-600 font-bold text-xs"
                >
                  <Highlighter className="w-4 h-4" />
                  <span className="hidden sm:inline text-[10px]">Highlight</span>
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('foreColor', '#1d4ed8')}
                  title="Blue Text"
                  className="w-4 h-4 rounded-full bg-blue-600 border border-white shadow-2xs hover:scale-110"
                />
                <button
                  type="button"
                  onClick={() => formatDoc('foreColor', '#b91c1c')}
                  title="Red Text"
                  className="w-4 h-4 rounded-full bg-red-600 border border-white shadow-2xs hover:scale-110"
                />
                <button
                  type="button"
                  onClick={() => formatDoc('foreColor', '#047857')}
                  title="Emerald Text"
                  className="w-4 h-4 rounded-full bg-emerald-600 border border-white shadow-2xs hover:scale-110"
                />
                <button
                  type="button"
                  onClick={() => formatDoc('removeFormat')}
                  title="Clear Text Formatting"
                  className="text-[10px] px-1.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
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
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('justifyCenter')}
                  title="Align Center"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('justifyRight')}
                  title="Align Right"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              {/* Lists */}
              <div className="flex items-center gap-0.5 border-r border-slate-300 pr-1.5">
                <button
                  type="button"
                  onClick={() => formatDoc('insertUnorderedList')}
                  title="Bullet List"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('insertOrderedList')}
                  title="Numbered List"
                  className="p-1.5 rounded hover:bg-slate-200 hover:text-slate-900"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>

              {/* Insert Rich Elements */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleInsertTable}
                  title="Insert Formatted Table"
                  className="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1"
                >
                  <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInsertCallout('info')}
                  title="Insert Note Box"
                  className="px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold flex items-center gap-1"
                >
                  <span>+ Note Box</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInsertCallout('warning')}
                  title="Insert Exam Warning Box"
                  className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1"
                >
                  <span>+ Warning</span>
                </button>

                <button
                  type="button"
                  onClick={handleInsertCodeBlock}
                  title="Insert Code Snippet"
                  className="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Code className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Code</span>
                </button>

                <button
                  type="button"
                  onClick={handleInsertImage}
                  title="Insert Image"
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                >
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                </button>

                <button
                  type="button"
                  onClick={handleInsertLink}
                  title="Insert Hyperlink"
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                >
                  <LinkIcon className="w-4 h-4 text-blue-600" />
                </button>

                <button
                  type="button"
                  onClick={handleInsertBilingualTemplate}
                  title="Insert Hindi & English Note Layout"
                  className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-1"
                >
                  <Languages className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Bilingual Template</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Editing View Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
            {editorMode === 'wysiwyg' && (
              <div
                ref={editableRef}
                contentEditable
                onInput={handleEditableInput}
                className="bg-white min-h-[420px] p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 prose prose-slate max-w-none notes-body"
                style={{
                  lineHeight: '1.7',
                  fontSize: '15px'
                }}
              />
            )}

            {editorMode === 'source' && (
              <div className="h-full flex flex-col">
                <p className="text-xs text-slate-600 mb-2">
                  Direct HTML code editor for advanced structure, custom tags, and inline formatting:
                </p>
                <textarea
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  className="w-full flex-1 min-h-[420px] font-mono text-xs p-4 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  placeholder="<h2>Enter HTML Content here...</h2>"
                />
              </div>
            )}

            {editorMode === 'preview' && (
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {courses.find(c => c.id === courseId)?.badge || 'M1-R5.1'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {chapters.find(ch => ch.id === chapterId)?.title}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                  {title || 'Untitled Note Topic'}
                </h1>
                {hindiTitle && (
                  <p className="text-sm font-semibold text-blue-600 mb-4">
                    {hindiTitle}
                  </p>
                )}
                <div className="border-t border-slate-100 pt-4 notes-body" dangerouslySetInnerHTML={{ __html: contentHtml || '<p class="text-slate-600 italic">No content written yet.</p>' }} />
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="px-6 py-2 bg-red-50 text-red-700 text-xs font-semibold border-t border-red-200">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>Status: Ready to publish</span>
              <span>•</span>
              <span>{contentHtml.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length} words</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Note...</span>
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

        </form>
      </div>
    </div>
  );
}
