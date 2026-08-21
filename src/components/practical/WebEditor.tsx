import React, { useState, useEffect } from 'react';
import { Eye, Code2, RefreshCw, Terminal, Monitor, Tablet, Smartphone, Trash2, Copy, CheckCircle2 } from 'lucide-react';

interface WebEditorProps {
  files: { [filename: string]: string };
  onChange: (files: { [filename: string]: string }) => void;
  onRunComplete?: (output: string) => void;
}

export const WebEditor: React.FC<WebEditorProps> = ({ files, onChange, onRunComplete }) => {
  const [activeTab, setActiveTab] = useState<'index.html' | 'styles.css' | 'script.js'>('index.html');
  const [previewKey, setPreviewKey] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['Ready. Browser console active.']);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  const html = files['index.html'] ?? '';
  const css = files['styles.css'] ?? '';
  const js = files['script.js'] ?? '';

  const handleFileChange = (newContent: string) => {
    onChange({
      ...files,
      [activeTab]: newContent
    });
  };

  const handleRefresh = () => {
    setPreviewKey((k) => k + 1);
    if (onRunComplete) {
      onRunComplete(`Rendered Web Page with ${html.length} chars HTML, ${css.length} chars CSS, ${js.length} chars JS.`);
    }
  };

  const handleCopy = () => {
    const text = activeTab === 'index.html' ? html : activeTab === 'styles.css' ? css : js;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Construct safe sandboxed srcDoc with console logger bridge
  const generatedSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          (function(){
            var oldLog = console.log;
            var oldError = console.error;
            var oldWarn = console.warn;
            
            function sendLog(type, args) {
              var str = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
              window.parent.postMessage({ type: 'WEB_CONSOLE_LOG', level: type, message: str }, '*');
            }

            console.log = function() { sendLog('log', arguments); oldLog.apply(console, arguments); };
            console.error = function() { sendLog('error', arguments); oldError.apply(console, arguments); };
            console.warn = function() { sendLog('warn', arguments); oldWarn.apply(console, arguments); };
          })();

          try {
            ${js}
          } catch(e) {
            console.error('Runtime Error:', e.message);
          }
        </script>
      </body>
    </html>
  `;

  // Listen for iframe console logs
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'WEB_CONSOLE_LOG') {
        const time = new Date().toLocaleTimeString();
        setConsoleLogs((prev) => [...prev.slice(-40), `[${time}] ${e.data.message}`]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const currentFileContent = activeTab === 'index.html' ? html : activeTab === 'styles.css' ? css : js;
  const lineCount = currentFileContent.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 16) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs text-slate-800">
      {/* Top File Tabs & Actions Bar */}
      <div className="bg-slate-50 px-3 py-2 flex items-center justify-between border-b border-slate-200 flex-wrap gap-2">
        {/* Editor Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('index.html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'index.html'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-orange-400" /> index.html
          </button>

          <button
            onClick={() => setActiveTab('styles.css')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'styles.css'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <span className="text-sky-400 font-bold text-xs">#</span> styles.css
          </button>

          <button
            onClick={() => setActiveTab('script.js')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'script.js'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <span className="text-amber-400 font-bold text-xs">&lt;/&gt;</span> script.js
          </button>
        </div>

        {/* Viewport Controls & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded cursor-pointer ${viewportMode === 'desktop' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded cursor-pointer ${viewportMode === 'tablet' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded cursor-pointer ${viewportMode === 'mobile' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
            title="Refresh Live Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Update Preview</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 min-h-[420px] overflow-hidden">
        {/* Left Side: Code Text Editor */}
        <div className="flex bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 font-mono text-xs overflow-hidden">
          {/* Line Numbers */}
          <div className="py-3 pl-3 pr-2 text-right text-slate-500 bg-slate-950/70 select-none border-r border-slate-800 shrink-0 font-mono text-[11px]">
            {lineNumbers.map((num) => (
              <div key={num} className="leading-6">
                {num}
              </div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            value={currentFileContent}
            onChange={(e) => handleFileChange(e.target.value)}
            spellCheck={false}
            className="w-full h-full p-3 bg-slate-900 text-slate-100 focus:outline-none resize-none leading-6 font-mono selection:bg-blue-800"
            placeholder={`Type ${activeTab} code here...`}
          />
        </div>

        {/* Right Side: Live HTML Sandbox & Console Split */}
        <div className="flex flex-col bg-slate-100 overflow-hidden">
          {/* Top Preview Title */}
          <div className="px-3 py-1.5 bg-slate-200/80 border-b border-slate-300 flex items-center justify-between text-slate-700 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Browser Sandbox ({viewportMode})</span>
            </div>
            <span className="text-[10px] text-slate-500">Auto-Refreshed</span>
          </div>

          {/* Sandbox Frame Canvas */}
          <div className="flex-1 p-2 bg-slate-100 flex items-center justify-center overflow-hidden">
            <div
              className={`h-full bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden transition-all duration-300 ${
                viewportMode === 'mobile'
                  ? 'w-[320px] max-w-full'
                  : viewportMode === 'tablet'
                  ? 'w-[520px] max-w-full'
                  : 'w-full'
              }`}
            >
              <iframe
                key={previewKey}
                title="Web Design Live Preview"
                srcDoc={generatedSrcDoc}
                sandbox="allow-scripts allow-modals"
                className="w-full h-full border-0 bg-white"
              />
            </div>
          </div>

          {/* Bottom Console Drawer */}
          <div className="h-28 bg-slate-900 border-t border-slate-800 flex flex-col font-mono text-[10px]">
            <div className="px-3 py-1 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-blue-400" />
                <span>Console Log Interceptor</span>
              </div>
              <button
                onClick={() => setConsoleLogs([])}
                className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-0.5 text-slate-300">
              {consoleLogs.map((log, i) => (
                <div key={i} className="leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
