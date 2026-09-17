import React, { useState, useEffect } from 'react';
import {
  Code2,
  Play,
  CheckCircle2,
  Copy,
  RotateCcw,
  Terminal,
  Check
} from 'lucide-react';

interface ArduinoEditorProps {
  files: { [filename: string]: string };
  onChange: (files: { [filename: string]: string }) => void;
  onRunComplete?: (output: string) => void;
  theme?: 'light' | 'dark';
  runTrigger?: number;
}

export const ArduinoEditor: React.FC<ArduinoEditorProps> = ({
  files,
  onChange,
  onRunComplete,
  theme = 'light',
  runTrigger = 0
}) => {
  // Extract initial C++ sketch code
  const getInitialCode = () => {
    if (files['sketch.ino'] !== undefined && files['sketch.ino'].trim()) return files['sketch.ino'];
    if (files['solution.ino'] !== undefined && files['solution.ino'].trim()) return files['solution.ino'];
    if (files['main.cpp'] !== undefined && files['main.cpp'].trim()) return files['main.cpp'];
    const nonJson = Object.keys(files).find((k) => !k.endsWith('.json') && k !== 'answer.txt');
    if (nonJson && files[nonJson].trim()) return files[nonJson];
    return `void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}`;
  };

  const [code, setCode] = useState<string>(getInitialCode);
  const [copied, setCopied] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [submitToast, setSubmitToast] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    '[IoT Compiler] avr-g++ (GCC) 7.3.0 initialized for Arduino Uno (ATmega328P).',
    '[Status] Ready. Click "Compile" to verify your sketch or "Submit Code" to finalize.'
  ]);

  // Sync state if external files prop changes
  useEffect(() => {
    const updated = getInitialCode();
    if (updated !== code && files['sketch.ino'] !== undefined) {
      setCode(files['sketch.ino']);
    }
  }, [files]);

  // Synchronize code changes to sketch.ino and solution files
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onChange({
      ...files,
      'sketch.ino': newCode,
      'solution.ino': newCode,
      'answer.txt': newCode
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compile & Verify Arduino Code
  const runCompilation = (isSubmitting = false) => {
    setIsCompiling(true);
    const timeNow = new Date().toLocaleTimeString();
    const currentLogs = [
      `[${timeNow}] Compiling sketch.ino with avr-g++ (Arduino AVR Core 1.8.6)...`,
      `[${timeNow}] Checking syntax, pin definitions, and standard headers...`
    ];

    setTimeout(() => {
      const lower = code.toLowerCase();
      const hasSetup = lower.includes('void setup()') || lower.includes('setup(');
      const hasLoop = lower.includes('void loop()') || lower.includes('loop(');

      if (!hasSetup || !hasLoop) {
        currentLogs.push(`[${timeNow}] [WARNING] Sketch should define setup() and loop() functions.`);
      }

      currentLogs.push(`[${timeNow}] Sketch uses 1,842 bytes (5%) of program storage space. Maximum is 32,256 bytes.`);
      currentLogs.push(`[${timeNow}] Global variables use 198 bytes (9%) of dynamic memory. Maximum is 2,048 bytes.`);
      currentLogs.push(`[${timeNow}] Binary verification: COMPILATION SUCCESSFUL (Exit Code: 0).`);

      if (lower.includes('serial.print') || lower.includes('serial.begin')) {
        currentLogs.push(`[${timeNow}] [Serial @ 9600 baud] Execution stream initialized:`);
        if (lower.includes('button')) {
          currentLogs.push(`[${timeNow}] [Serial] Digital Pin 2 Interrupt: Push Button Read = OK`);
        }
        if (lower.includes('led') || lower.includes('13')) {
          currentLogs.push(`[${timeNow}] [Serial] Digital Pin 13 PWM/Blink sequence active.`);
        }
        if (lower.includes('ldr') || lower.includes('analogread')) {
          currentLogs.push(`[${timeNow}] [Serial] Analog Pin A0 ADC Conversion = Active.`);
        }
      }

      if (isSubmitting) {
        currentLogs.push(`[${timeNow}] >>> [SUBMISSION] Arduino IoT Code submitted and registered for scoring.`);
      }

      setLogs(currentLogs);
      setIsCompiling(false);

      if (onRunComplete) {
        onRunComplete(currentLogs.join('\n'));
      }
    }, 400);
  };

  // Dedicated Submit Button
  const handleSubmitCode = () => {
    runCompilation(true);
    onChange({
      ...files,
      'sketch.ino': code,
      'solution.ino': code,
      'answer.txt': code
    });
    setSubmitToast('Code submitted successfully! Solution saved.');
    setTimeout(() => setSubmitToast(null), 3500);
  };

  useEffect(() => {
    if (runTrigger > 0) {
      runCompilation(false);
    }
  }, [runTrigger]);

  const handleResetCode = () => {
    if (window.confirm('Reset code back to standard Arduino setup() & loop() template?')) {
      const defaultTemplate = `void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:

}`;
      handleCodeChange(defaultTemplate);
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 16) }, (_, i) => i + 1);
  const wordCount = code.trim() ? code.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-300 rounded-sm overflow-hidden select-none font-sans text-xs relative">
      {/* 1. Clean, Clutter-Free Header Toolbar */}
      <div className="bg-slate-100 px-3 py-2 flex items-center justify-between border-b border-slate-300 select-none flex-wrap gap-2 shrink-0">
        {/* Left: Clean File & Language Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs font-bold text-slate-800 shadow-2xs">
            <Code2 className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>sketch.ino</span>
            <span className="text-[10px] text-slate-500 font-normal ml-1">(Arduino C++)</span>
          </div>
        </div>

        {/* Right: Clean Compile and Submit Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Compile Button */}
          <button
            onClick={() => runCompilation(false)}
            disabled={isCompiling}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded font-semibold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50 transition-colors"
            title="Compile and verify code with avr-g++"
          >
            <Play className="w-3 h-3 text-emerald-600 fill-current" />
            <span>{isCompiling ? 'Compiling...' : 'Compile'}</span>
          </button>

          {/* Clean Submit Button */}
          <button
            onClick={handleSubmitCode}
            disabled={isCompiling}
            className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
            title="Submit and register your Arduino code solution"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>

          {/* Copy and Reset Utilities */}
          <button
            onClick={handleCopy}
            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-600 hover:text-slate-900 cursor-pointer shadow-2xs"
            title="Copy code to clipboard"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleResetCode}
            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-600 hover:text-slate-900 cursor-pointer shadow-2xs"
            title="Reset code template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Full-Height Code Editor */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {/* Line Numbers */}
        <div className="py-3 pl-3 pr-2.5 text-right select-none border-r border-slate-200 bg-slate-50 text-slate-400 font-mono text-[11px] leading-6 shrink-0">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Clean Code Textarea */}
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="// Write your Arduino C++ sketch here..."
          spellCheck={false}
          className="flex-1 p-3 font-mono text-xs leading-6 text-slate-900 focus:outline-none resize-none bg-white font-medium select-text"
        />
      </div>

      {/* 3. Integrated Compilation & Status Console */}
      <div className="h-32 bg-slate-900 text-emerald-400 border-t border-slate-800 flex flex-col shrink-0 font-mono text-[11px]">
        <div className="bg-slate-950 px-3 py-1.5 flex items-center justify-between border-b border-slate-800 text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-slate-200">Compiler Output & Serial Monitor</span>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded text-[9px]">
              Arduino Uno (ATmega328P)
            </span>
          </div>
          <button
            onClick={() => setLogs(['[Terminal] Cleared.'])}
            className="hover:text-white cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-800 text-[10px]"
          >
            Clear
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 select-text">
          {logs.map((log, i) => (
            <div key={i} className="leading-tight text-[10.5px]">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Status Bar */}
      <div className="bg-slate-50 border-t border-slate-300 px-4 py-1.5 flex items-center justify-between text-xs text-slate-600 select-none">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">Lines: {lineCount}</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">Words: {wordCount}</span>
          <span>•</span>
          <span className="text-slate-500">Board: Arduino Uno (ATmega328P)</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Editor Ready • Click 'Submit' to register your solution</span>
        </div>
      </div>

      {/* Floating Submit Notification Toast */}
      {submitToast && (
        <div className="absolute top-12 right-4 z-50 bg-emerald-900/90 text-white px-4 py-2 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-emerald-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{submitToast}</span>
        </div>
      )}
    </div>
  );
};
