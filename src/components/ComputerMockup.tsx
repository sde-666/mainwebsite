import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Terminal, 
  Globe, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  FileCode, 
  Cpu, 
  Check, 
  Award,
  Layers,
  GraduationCap,
  ExternalLink
} from 'lucide-react';

export function ComputerMockup() {
  const [activeTab, setActiveTab] = useState<'python' | 'web' | 'cbt' | 'notes'>('python');
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '>>> Python 3.12 (NIELIT M3-R5 Interpreter)',
    '>>> Loading NumPy arrays & algorithms...',
    '>>> System Ready. Click [▶ Run Code] to execute.'
  ]);
  const [cbtSelectedOption, setCbtSelectedOption] = useState<number | null>(null);
  const [cbtSubmitted, setCbtSubmitted] = useState(false);

  // Auto-switch tabs gently if untouched, or keep user-selected
  useEffect(() => {
    const timer = setInterval(() => {
      // Optional background pulsing or auto updates
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleRunPython = () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, '>>> Running main.py ...']);
    setTimeout(() => {
      setConsoleOutput([
        '>>> Executing: python3 main.py',
        '---------------------------------------',
        'Student: NIELIT O-Level Aspirant',
        'Module: M3-R5.1 Python Programming',
        'Fibonacci Matrix: [0, 1, 1, 2, 3, 5, 8, 13]',
        'Algorithm Efficiency: O(n) Optimal',
        'Status: Test Cases Passed (10/10) ✓',
        'Predicted Score: 94/100 (Grade S)',
        '---------------------------------------'
      ]);
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
      {/* Ambient Backlight Glow behind the screen */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-3xl opacity-35 blur-xl group-hover:opacity-60 transition duration-1000 -z-10 animate-pulse"></div>

      {/* COMPUTER MONITOR FRAME */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-slate-900 border-2 sm:border-[3px] border-slate-700/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Top Monitor Bezel with WebCam & Window Controls */}
        <div className="bg-slate-950/95 px-3 sm:px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-2 select-none">
          {/* macOS / Linux Window Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-red-500/90 inline-block shadow-xs"></span>
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-amber-500/90 inline-block shadow-xs"></span>
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-emerald-500/90 inline-block shadow-xs"></span>
          </div>

          {/* Browser Address Bar / Title */}
          <div className="flex-1 max-w-[200px] sm:max-w-xs mx-auto bg-slate-900/90 border border-slate-700/60 rounded-lg px-2.5 py-1 flex items-center justify-center gap-1.5 text-slate-300 text-[10px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="truncate font-mono font-medium text-slate-200">skilldotpy.com/learning-hub</span>
          </div>

          {/* Live Badge */}
          <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">R5.1 Portal</span>
          </div>
        </div>

        {/* Tab Switcher on the Computer Screen */}
        <div className="bg-slate-900 border-b border-slate-800 px-2.5 pt-2 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'python'
                ? 'bg-slate-950 text-blue-400 border-t-2 border-blue-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Python IDE (PR3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('web')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'web'
                ? 'bg-slate-950 text-emerald-400 border-t-2 border-emerald-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Web Lab (PR2)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cbt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cbt'
                ? 'bg-slate-950 text-amber-400 border-t-2 border-amber-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>CBT Exam Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>All 4 Papers</span>
          </button>
        </div>

        {/* INNER SCREEN WORKBENCH CONTENT */}
        <div className="bg-slate-950 p-3 sm:p-4 text-slate-200 min-h-[290px] sm:min-h-[320px] flex flex-col justify-between">

          {/* TAB 1: PYTHON IDE & CONSOLE */}
          {activeTab === 'python' && (
            <div className="space-y-3 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
              {/* Code Snippet Editor */}
              <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3 font-mono text-[11px] sm:text-xs text-slate-300 leading-relaxed shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 mb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                    <FileCode className="w-3.5 h-3.5" /> solution_m3_r5.py
                  </span>
                  <span className="text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                    Python 3.12
                  </span>
                </div>
                <div>
                  <span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np<br />
                  <span className="text-slate-500"># NIELIT O Level M3-R5 High-Yield Algorithm</span><br />
                  <span className="text-blue-400">def</span> <span className="text-yellow-300">calculate_score</span>(marks):<br />
                  &nbsp;&nbsp;grades = [m * <span className="text-amber-300">1.0</span> <span className="text-purple-400">for</span> m <span className="text-purple-400">in</span> marks]<br />
                  &nbsp;&nbsp;<span className="text-purple-400">return</span> np.mean(grades)<br />
                  result = <span className="text-yellow-300">calculate_score</span>([<span className="text-amber-300">92, 95, 98, 91</span>])<br />
                  <span className="text-cyan-400">print</span>(<span className="text-emerald-300">f"Grade S Achieved: </span>{'{'}result{'}'}<span className="text-emerald-300">%"</span>)
                </div>
              </div>

              {/* Console Output Box & Run Button */}
              <div className="bg-slate-900 rounded-xl border border-slate-800/80 p-2.5 font-mono text-[10px] sm:text-[11px] space-y-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                    <Terminal className="w-3 h-3 text-cyan-400" /> Interactive Terminal
                  </span>
                  <button
                    type="button"
                    onClick={handleRunPython}
                    disabled={isRunning}
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[10px] px-3 py-1 rounded-md transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                  </button>
                </div>
                <div className="text-emerald-400 pt-1 space-y-0.5 max-h-24 overflow-y-auto font-mono">
                  {consoleOutput.map((line, idx) => (
                    <p key={idx} className={line.includes('Grade S') ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEB DESIGN LAB (PR2 / M2-R5) */}
          {activeTab === 'web' && (
            <div className="space-y-3 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 h-full">
                {/* HTML Source Preview */}
                <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-2.5 font-mono text-[10px] sm:text-[11px] text-slate-300">
                  <div className="text-[10px] text-emerald-400 font-bold border-b border-slate-800 pb-1 mb-1.5 flex items-center gap-1">
                    <FileCode className="w-3 h-3" /> index.html (HTML5 + CSS3)
                  </div>
                  <div className="text-slate-400 leading-relaxed">
                    &lt;<span className="text-red-400">div</span> <span className="text-amber-300">class</span>=<span className="text-emerald-300">"card"</span>&gt;<br />
                    &nbsp;&nbsp;&lt;<span className="text-red-400">h2</span>&gt;M2-R5 Web Design&lt;/<span className="text-red-400">h2</span>&gt;<br />
                    &nbsp;&nbsp;&lt;<span className="text-red-400">p</span>&gt;Responsive Flexbox Layout&lt;/<span className="text-red-400">p</span>&gt;<br />
                    &nbsp;&nbsp;&lt;<span className="text-red-400">button</span>&gt;Submit Form&lt;/<span className="text-red-400">button</span>&gt;<br />
                    &lt;/<span className="text-red-400">div</span>&gt;
                  </div>
                </div>

                {/* Live Rendered Canvas */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl border border-indigo-800/40 p-3 flex flex-col justify-center items-center text-center shadow-inner">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center mb-2">
                    <Globe className="w-5 h-5 text-blue-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Live Web Browser Output</h4>
                  <p className="text-[10px] text-slate-300 mt-1">HTML5 Semantic DOM, CSS3 Box Model & JS DOM event validation passing.</p>
                  <span className="mt-2.5 inline-block text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    ✓ 100% W3C Validated
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Practice M2-R5 Web practicals with live browser output</span>
                <Link to="/practical-practice" className="text-blue-400 hover:underline font-bold flex items-center gap-1">
                  Open Practical IDE →
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: CBT EXAM SIMULATOR */}
          {activeTab === 'cbt' && (
            <div className="space-y-3 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
                  <span className="font-bold text-amber-400">NIELIT R5.1 CBT Mock Simulator</span>
                  <span className="text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">Time: 89:45 Mins</span>
                </div>

                <p className="text-xs font-semibold text-white mb-3">
                  Q1. In LibreOffice Writer, what is the default keyboard shortcut for Mail Merge Wizard?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 0, label: 'A. Tools → Mail Merge Wizard', correct: true },
                    { id: 1, label: 'B. Ctrl + Shift + M', correct: false },
                    { id: 2, label: 'C. Alt + F12', correct: false },
                    { id: 3, label: 'D. File → Export Mail', correct: false }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setCbtSelectedOption(opt.id);
                        setCbtSubmitted(true);
                      }}
                      className={`p-2 rounded-lg text-left text-[11px] font-medium border transition-all cursor-pointer ${
                        cbtSelectedOption === opt.id
                          ? opt.correct
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                            : 'bg-red-950/80 border-red-500 text-red-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt.label} {cbtSubmitted && opt.correct && ' ✓ (Correct)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 1000+ Online Mock MCQs Available
                </span>
                <Link to="/mock-test" className="text-amber-400 hover:underline font-bold">
                  Start 100 MCQ Test →
                </Link>
              </div>
            </div>
          )}

          {/* TAB 4: ALL 4 PAPERS SYLLABUS & NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-2.5 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-blue-900/40">
                  <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                    <span className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center text-[10px]">M1</span>
                    IT Tools & Network
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">LibreOffice Writer, Calc & OS notes</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-900/40">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <span className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">M2</span>
                    Web Designing
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">HTML5, CSS3, JS & Photoshop</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-900/40">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <span className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center text-[10px]">M3</span>
                    Python Flagship
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Logic, Flowcharts, Loops & NumPy</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-indigo-900/40">
                  <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold">
                    <span className="w-5 h-5 rounded bg-indigo-500/20 flex items-center justify-center text-[10px]">M4</span>
                    IoT & Arduino
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Sensors, MQTT & C Embedded</p>
                </div>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Free PDF notes for all chapters</span>
                <Link to="/resources" className="text-blue-400 hover:underline font-bold">
                  Download All PDFs →
                </Link>
              </div>
            </div>
          )}

          {/* COMPUTER FOOTER STATUS BAR */}
          <div className="pt-2.5 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-slate-300 font-medium">Skilldotpy Learning OS v2.5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-semibold">★ Grade S Ready</span>
              <Link to="/o-level" className="text-blue-400 hover:underline font-bold">
                Explore Hub →
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* COMPUTER MONITOR STAND BASE (Real Desktop Graphic Hardware) */}
      <div className="relative flex flex-col items-center">
        {/* Neck */}
        <div className="w-20 sm:w-24 h-4 sm:h-5 bg-gradient-to-b from-slate-700 to-slate-800 border-x border-slate-600 shadow-md"></div>
        {/* Base Plate */}
        <div className="w-40 sm:w-52 h-2.5 sm:h-3 rounded-t-lg bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border border-slate-600 shadow-[0_10px_20px_rgba(0,0,0,0.6)]"></div>
      </div>
    </div>
  );
}
