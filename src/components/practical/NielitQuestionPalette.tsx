import React from 'react';
import { ChevronLeft, ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { PracticalQuestion } from '../../types/practical';

interface NielitQuestionPaletteProps {
  questions: PracticalQuestion[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  isAttempted: (qId: string) => boolean;
  isReviewed: (qId: string) => boolean;
}

export const NielitQuestionPalette: React.FC<NielitQuestionPaletteProps> = ({
  questions,
  currentIndex,
  onSelectQuestion,
  isOpen,
  onToggle,
  isAttempted,
  isReviewed
}) => {
  const attemptedCount = questions.filter((q) => isAttempted(q.id)).length;
  const reviewCount = questions.filter((q) => isReviewed(q.id)).length;
  const unattemptedCount = questions.length - attemptedCount;
  const skipCount = 0;

  return (
    <div className="relative flex items-stretch z-30 select-none">
      {/* Edge Handle Tab for expanding or collapsing */}
      {!isOpen ? (
        <button
          onClick={onToggle}
          className="self-center bg-white border border-slate-300 border-r-0 rounded-l-md shadow-md py-3 px-1.5 flex flex-col items-center gap-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-all cursor-pointer z-40 group"
          title="Show Question Palette"
          aria-label="Show Question Palette"
        >
          <ChevronLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[10px] font-bold writing-mode-vertical [writing-mode:vertical-rl] tracking-wider text-slate-700 uppercase">
            Palette
          </span>
        </button>
      ) : (
        <button
          onClick={onToggle}
          className="self-center -ml-3 bg-white border border-slate-300 rounded-full shadow-md w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-transform cursor-pointer z-40"
          title="Hide Question Palette"
          aria-label="Hide Question Palette"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="w-64 bg-white border-l border-slate-300 flex flex-col justify-between p-4 shadow-lg shrink-0 animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Question Palette
                </span>
              </div>
              <button
                onClick={onToggle}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                title="Hide Question Palette"
              >
                <PanelRightClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Question Numbers Grid: [1] [2] [3] */}
            <div className="flex items-center gap-3">
              {questions.map((q, idx) => {
                const isCur = currentIndex === idx;
                const att = isAttempted(q.id);
                const rev = isReviewed(q.id);

                let badgeColor = 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50';
                if (rev) {
                  badgeColor = 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs';
                } else if (att) {
                  badgeColor = 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => onSelectQuestion(idx)}
                    className={`w-10 h-10 rounded border flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${badgeColor} ${
                      isCur ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-600' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-2 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500">
              Select question number to view or edit. Changes can be saved before switching.
            </div>
          </div>

          {/* Official Legend at Bottom matching Screenshot 8 */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-[11px] text-slate-700">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#2563EB] shrink-0" />
                <span>Attempted ({attemptedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs border border-slate-400 bg-white shrink-0" />
                <span>Unattempted ({unattemptedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#7C3AED] shrink-0" />
                <span>Review ({reviewCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#9CA3AF] shrink-0" />
                <span>Skip ({skipCount})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
