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
  Table as TableIcon,
  Subscript,
  Superscript,
  Undo,
  Redo,
  RemoveFormatting,
  Minus,
  FileText,
  Copy,
  CheckCircle2,
  Download,
  Sparkles,
  Plus,
  Trash2,
  Palette
} from 'lucide-react';

interface GeneralEditorProps {
  files: { [filename: string]: string };
  onChange: (files: { [filename: string]: string }) => void;
  onRunComplete?: (output: string) => void;
}

export const GeneralEditor: React.FC<GeneralEditorProps> = ({
  files,
  onChange,
  onRunComplete
}) => {
  const filename = Object.keys(files)[0] || 'document.html';
  const initialContent = files[filename] || '<p><br/></p>';

  const editorRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState('3');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Initialize editor content once
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = initialContent;
      updateStats();
    }
  }, []);

  const updateStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setCharCount(text.length);
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChange({
      ...files,
      [filename]: html
    });
    updateStats();
    if (onRunComplete) {
      onRunComplete(`Document updated. Contains ${wordCount} words and ${charCount} characters.`);
    }
  };

  const format = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleInput();
  };

  const insertTable = (rows: number = 3, cols: number = 3) => {
    let tableHtml = `<br/><table border="1" style="border-collapse: collapse; width: 100%; text-align: left; border: 1px solid #94a3b8; margin: 12px 0;"><thead><tr style="background-color: #f1f5f9;">`;
    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th style="padding: 8px; border: 1px solid #94a3b8;">Header ${c}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;
    for (let r = 1; r <= rows; r++) {
      tableHtml += `<tr>`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td style="padding: 8px; border: 1px solid #94a3b8;">Data ${r},${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p></p><br/>`;
    format('insertHTML', tableHtml);
  };

  const handleCopy = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs text-slate-800">
      {/* Top WordPad Title & Actions Bar */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-slate-200 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-md text-xs font-bold border border-purple-200">
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>WordPad & LibreOffice Writer (PR1 / ITN)</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            • Rich Document & Table Processor
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied Text' : 'Copy Plain Text'}</span>
          </button>
        </div>
      </div>

      {/* Ribbon Toolbar */}
      <div className="bg-white px-3 py-2 border-b border-slate-200 flex items-center flex-wrap gap-1 text-xs select-none">
        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={(e) => {
            setFontFamily(e.target.value);
            format('fontName', e.target.value);
          }}
          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none"
        >
          <option value="Arial">Arial</option>
          <option value="Calibri">Calibri</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>

        {/* Font Size */}
        <select
          value={fontSize}
          onChange={(e) => {
            setFontSize(e.target.value);
            format('fontSize', e.target.value);
          }}
          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none"
        >
          <option value="2">10 pt (Small)</option>
          <option value="3">12 pt (Normal)</option>
          <option value="4">14 pt (Medium)</option>
          <option value="5">18 pt (Heading 2)</option>
          <option value="6">24 pt (Heading 1)</option>
          <option value="7">36 pt (Title)</option>
        </select>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Basic Styles */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-0.5">
          <button
            onClick={() => format('bold')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 font-bold transition-colors cursor-pointer"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('italic')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('underline')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('strikeThrough')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('subscript')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Subscript (X₂)"
          >
            <Subscript className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('superscript')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Superscript (X²)"
          >
            <Superscript className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Text Alignment */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-0.5">
          <button
            onClick={() => format('justifyLeft')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('justifyCenter')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('justifyRight')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('justifyFull')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Lists & Dividers */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-0.5">
          <button
            onClick={() => format('insertUnorderedList')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('insertOrderedList')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => format('insertHorizontalRule')}
            className="p-1.5 hover:bg-white hover:shadow-xs rounded text-slate-700 transition-colors cursor-pointer"
            title="Horizontal Line"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Insert Table Button */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => insertTable(3, 3)}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Insert 3x3 Table"
          >
            <TableIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Table</span>
          </button>

          <button
            onClick={() => format('removeFormat')}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Document Canvas Sheet */}
      <div className="flex-1 bg-slate-100 p-4 overflow-y-auto flex justify-center">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          spellCheck={true}
          className="bg-white text-slate-900 border border-slate-300 rounded-sm shadow-md p-8 sm:p-12 w-full max-w-3xl min-h-[620px] focus:outline-none focus:ring-1 focus:ring-blue-400 leading-relaxed font-sans"
          style={{ fontFamily }}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-white px-4 py-1.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium select-none">
        <div className="flex items-center gap-3">
          <span>Words: <strong>{wordCount}</strong></span>
          <span>•</span>
          <span>Characters: <strong>{charCount}</strong></span>
          <span>•</span>
          <span>Page 1 of 1</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Auto-Saved
          </span>
          <span>•</span>
          <span className="text-slate-400">LibreOffice R5.1 Compatible</span>
        </div>
      </div>
    </div>
  );
};
