import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Copy, 
  Check, 
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAiAssistant } from '../context/AiAssistantContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  subject?: string;
  timestamp: number;
}

const DEFAULT_WELCOME_MSG: Message = {
  id: 'welcome',
  sender: 'ai',
  text: `👋 **Hello! I am your AI Doubt Solver.**\n\nAsk me any concept, programming problem, or technical doubt (for example: *'What is an IP address?'*, *'How do for loops work in Python?'*, *'Difference between RAM and ROM'*), and I will analyze it and provide a clear step-by-step answer!`,
  timestamp: Date.now()
};

export function AiDoubtSolverModal() {
  const { isOpen, closeAssistant, initialSubject, initialQuestion } = useAiAssistant();
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || 'All Subjects');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MSG]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial subject if opened from external buttons
  useEffect(() => {
    if (isOpen) {
      if (initialSubject) setSelectedSubject(initialSubject);
      if (initialQuestion) {
        setQuestion(initialQuestion);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialSubject, initialQuestion]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  const subjects = [
    'All Subjects',
    'M1-R5 IT Tools',
    'M2-R5 Web Design',
    'M3-R5 Python',
    'M4-R5 IoT',
    'CCC Exam'
  ];

  const handleSend = async () => {
    const query = question.trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      subject: selectedSubject !== 'All Subjects' ? selectedSubject : undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/ai-doubt-solver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          subject: selectedSubject !== 'All Subjects' ? selectedSubject : 'Computer Science / NIELIT',
          languagePreference: 'hinglish'
        })
      });

      if (!response.ok && !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Streaming not supported');
      const decoder = new TextDecoder('utf-8');
      
      const aiMsgId = `ai-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        subject: selectedSubject,
        timestamp: Date.now()
      }]);

      let aiText = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                aiText += (aiText ? `\n\n` : '') + `⚠️ **Error**: ${data.error}`;
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: aiText } : m));
                break;
              }
              if (data.answer && data.cached) {
                aiText = data.answer;
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: aiText } : m));
              } else if (data.text) {
                aiText += data.text;
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: aiText } : m));
              } else if (data.warning) {
                aiText = data.answer || data.warning;
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: aiText } : m));
              }
            } catch (e) {
              // Ignore parse errors from partial chunks
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **Connection Error**: Could not connect to AI Doubt Solver. Please check your network and try again.`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([DEFAULT_WELCOME_MSG]);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={closeAssistant}
    >
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col h-[92vh] sm:h-[82vh] max-h-[700px] overflow-hidden text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Light Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-white/95 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">AI Guru • Doubt Solver</h3>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.2 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> 24/7 Solver
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Ask any question or concept for step-by-step explanations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeAssistant}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimal Clean Subject Filter */}
        <div className="px-3 sm:px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[11px] font-medium text-slate-400 shrink-0 hidden sm:inline">Subject:</span>
          {subjects.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSubject(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedSubject === s
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.sender === 'user' ? (
                <div className="max-w-[88%] sm:max-w-[78%] rounded-2xl rounded-tr-xs px-3.5 py-2.5 text-xs sm:text-sm bg-blue-600 text-white shadow-xs">
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              ) : (
                <div className="max-w-[94%] sm:max-w-[88%] rounded-2xl rounded-tl-xs p-3.5 sm:p-4 text-xs sm:text-sm bg-white border border-slate-200/80 text-slate-800 shadow-xs relative group">
                  <div className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed text-slate-800">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(msg.text, msg.id)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 max-w-[220px] text-xs text-blue-600 shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing doubt & explaining...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Clean Input Bar */}
        <div className="p-2.5 sm:p-3.5 bg-white border-t border-slate-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask any question or doubt (e.g. 'What is IP address?')..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold p-2.5 sm:p-3 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Global Floating AI Doubt Solver Trigger Button
export function FloatingAiDoubtButton() {
  const { openAssistant } = useAiAssistant();

  return (
    <button
      type="button"
      onClick={() => openAssistant()}
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-xl border border-white/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
      aria-label="Open AI Doubt Solver"
    >
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="text-left">
        <div className="text-xs font-bold leading-none flex items-center gap-1.5">
          <span>AI Doubt Solver</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <span className="text-[10px] text-blue-100 hidden sm:block">Instant 24/7 Doubt Help</span>
      </div>
    </button>
  );
}
