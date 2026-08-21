import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  Wrench, 
  HelpCircle, 
  Code2, 
  ArrowRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiCodeAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
  questionTitle: string;
  questionDescription?: string;
  onApplyFix?: (fixedCode: string) => void;
}

export function AiCodeAssistantModal({
  isOpen,
  onClose,
  code,
  language,
  questionTitle,
  questionDescription,
  onApplyFix
}: AiCodeAssistantModalProps) {
  const [activeTab, setActiveTab] = useState<'explain' | 'fix' | 'viva_tips'>('explain');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const fetchAiAssistance = async (action: 'explain' | 'fix' | 'viva_tips') => {
    setActiveTab(action);
    setLoading(true);
    setResult(null);
    setApplied(false);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/ai-code-helper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemStatement: `${questionTitle}: ${questionDescription || ''}`,
          action
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({
        summary: 'Error contacting AI assistant',
        explanation: 'Could not connect to Gemini API. Please check your internet connection or configure GEMINI_API_KEY.'
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && code) {
      fetchAiAssistance('explain');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = (newCode: string) => {
    if (onApplyFix) {
      onApplyFix(newCode);
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">AI Practical Lab Assistant</h3>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  {language.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Task: {questionTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-4 pt-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fetchAiAssistance('explain')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'explain'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Explain Code Logic
          </button>

          <button
            type="button"
            onClick={() => fetchAiAssistance('fix')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'fix'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> Check Errors & Fix
          </button>

          <button
            type="button"
            onClick={() => fetchAiAssistance('viva_tips')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'viva_tips'
                ? 'border-amber-500 text-amber-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Expected Viva Questions
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Sparkles className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-sm font-medium text-blue-300">
                Gemini AI is analyzing your {language} code...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {result.summary && (
                <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-200">
                  <strong className="font-bold text-blue-300">Summary: </strong> {result.summary}
                </div>
              )}

              {result.explanation && (
                <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-200">
                  <ReactMarkdown>{result.explanation}</ReactMarkdown>
                </div>
              )}

              {result.correctedCode && activeTab === 'fix' && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      ✨ Corrected / Optimized Code:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyCode(result.correctedCode)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 flex items-center gap-1 border border-slate-700 cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>

                      {onApplyFix && (
                        <button
                          type="button"
                          onClick={() => handleApply(result.correctedCode)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold rounded-lg text-white flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          {applied ? <CheckCircle2 className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                          <span>{applied ? 'Applied to Editor!' : 'Apply to Editor'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-xs font-mono text-emerald-300 leading-relaxed">
                    {result.correctedCode}
                  </pre>
                </div>
              )}

              {result.vivaQuestions && result.vivaQuestions.length > 0 && (
                <div className="space-y-2 mt-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    🎯 Predicted Examiner Questions (20 Marks Viva):
                  </span>
                  <div className="space-y-2">
                    {result.vivaQuestions.map((vq: string, i: number) => (
                      <div key={i} className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-200">
                        <strong className="text-amber-300">Q{i + 1}: </strong> {vq}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              Click any tab above to analyze your code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
