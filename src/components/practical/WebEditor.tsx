import React, { useState, useEffect } from 'react';
import { Eye, Code2, RefreshCw, Terminal, Monitor, Tablet, Smartphone, Copy, CheckCircle2, Play } from 'lucide-react';

interface WebEditorProps {
  files: { [filename: string]: string };
  onChange: (files: { [filename: string]: string }) => void;
  onRunComplete?: (output: string) => void;
  theme?: 'light' | 'dark';
  runTrigger?: number;
}

export const WebEditor: React.FC<WebEditorProps> = ({
  files,
  onChange,
  onRunComplete,
  theme = 'light',
  runTrigger = 0
}) => {
  const [activeTab, setActiveTab] = useState<'index.html' | 'styles.css' | 'script.js'>('index.html');
  const [previewKey, setPreviewKey] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['Ready. Browser runtime active.']);
  const [copied, setCopied] = useState(false);

  // Check if starterCode has index.html or single HTML file
  const htmlKey = Object.keys(files).find((k) => k.endsWith('.html')) || 'index.html';
  const html = files[htmlKey] ?? files['index.html'] ?? '';
  const css = files['styles.css'] ?? '';
  const js = files['script.js'] ?? '';

  const handleFileChange = (newContent: string) => {
    onChange({
      ...files,
      [activeTab === 'index.html' ? htmlKey : activeTab]: newContent
    });
  };

  const handleRefresh = () => {
    setPreviewKey((k) => k + 1);
    if (onRunComplete) {
      onRunComplete(`Rendered Web Page with ${html.length} chars HTML, ${css.length} chars CSS, ${js.length} chars JS.`);
    }
  };

  // Run automatically when parent fires runTrigger
  useEffect(() => {
    if (runTrigger > 0) {
      handleRefresh();
    }
  }, [runTrigger]);

  const handleCopy = () => {
    const text = activeTab === 'index.html' ? html : activeTab === 'styles.css' ? css : js;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If the HTML already has complete tags (<html, <head, <body), inject css/js safely into it
  const buildFullDocument = () => {
    let full = html;
    if (css.trim()) {
      if (full.includes('</head>')) {
        full = full.replace('</head>', `<style>${css}</style></head>`);
      } else {
        full = `<style>${css}</style>\n` + full;
      }
    }
    if (js.trim()) {
      if (full.includes('</body>')) {
        full = full.replace('</body>', `<script>${js}</script></body>`);
      } else {
        full = full + `\n<script>${js}</script>`;
      }
    }

    // Embed parent console interceptor
    const consoleBridge = `
      <script>
        (function(){
          var oldLog = console.log;
          var oldError = console.error;
          function sendLog(type, args) {
            var str = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
            window.parent.postMessage({ type: 'WEB_CONSOLE_LOG', level: type, message: str }, '*');
          }
          console.log = function() { sendLog('log', arguments); oldLog.apply(console, arguments); };
          console.error = function() { sendLog('error', arguments); oldError.apply(console, arguments); };
        })();
      </script>
    `;

    if (full.includes('<head>')) {
      full = full.replace('<head>', '<head>' + consoleBridge);
    } else {
      full = consoleBridge + full;
    }

    return full;
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'WEB_CONSOLE_LOG') {
        const time = new Date().toLocaleTimeString();
        setConsoleLogs((prev) => [...prev.slice(-30), `[${time}] ${e.data.message}`]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const currentFileContent = activeTab === 'index.html' ? html : activeTab === 'styles.css' ? css : js;
  const lineCount = currentFileContent.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 25) }, (_, i) => i + 1);

  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col h-full bg-white border border-slate-300 rounded-sm overflow-hidden select-none font-sans text-xs">
      {/* File Tab Selector Bar (if multi-file) */}
      {(files['styles.css'] !== undefined || files['script.js'] !== undefined) && (
        <div className="bg-slate-100 px-3 py-1 flex items-center justify-between border-b border-slate-300 select-none">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('index.html')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'index.html' ? 'bg-white text-blue-700 shadow-2xs border border-slate-300' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-orange-500" /> HTML
            </button>
            <button
              onClick={() => setActiveTab('styles.css')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'styles.css' ? 'bg-white text-blue-700 shadow-2xs border border-slate-300' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-bold text-sky-500">#</span> CSS
            </button>
            <button
              onClick={() => setActiveTab('script.js')}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'script.js' ? 'bg-white text-blue-700 shadow-2xs border border-slate-300' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-bold text-amber-500">&lt;/&gt;</span> JS
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-2 py-0.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] flex items-center gap-1 cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}

      {/* Split Grid: Editor (Left) ↔ Live Preview (Right) matching Screenshot 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 min-h-0 overflow-hidden">
        {/* Left Side: Code Editor with Line Numbers */}
        <div className={`flex flex-col border-r border-slate-300 overflow-hidden ${isDark ? 'bg-[#1E1E1E] text-slate-100' : 'bg-white text-slate-900'}`}>
          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers */}
            <div
              className={`py-3 pl-3 pr-2 text-right select-none border-r shrink-0 font-mono text-[11px] leading-6 ${
                isDark ? 'bg-[#252526] text-slate-500 border-slate-800' : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              value={currentFileContent}
              onChange={(e) => handleFileChange(e.target.value)}
              spellCheck={false}
              className={`w-full h-full p-3 font-mono text-xs focus:outline-none resize-none leading-6 selection:bg-blue-200 ${
                isDark ? 'bg-[#1E1E1E] text-slate-100 selection:bg-blue-900' : 'bg-white text-slate-900'
              }`}
              placeholder="Write your HTML, CSS, or JavaScript code here..."
            />
          </div>
        </div>

        {/* Right Side: Live HTML Output Preview matching Screenshot 3 */}
        <div className="flex flex-col bg-white overflow-hidden relative">
          <iframe
            key={previewKey}
            title="NIELIT Live Web Output"
            srcDoc={buildFullDocument()}
            sandbox="allow-scripts allow-modals"
            className="w-full h-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
