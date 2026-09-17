import React from 'react';
import { X, CheckCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface NielitInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperCode: string;
  durationMinutes: number;
}

export const NielitInstructionModal: React.FC<NielitInstructionModalProps> = ({
  isOpen,
  onClose,
  paperCode,
  durationMinutes
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2B56C6]" />
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              Official Examination Instructions ({paperCode})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg flex items-start gap-3">
            <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-900">Total Duration: {durationMinutes} Minutes</p>
              <p className="text-blue-800 text-[11px] mt-0.5">
                The countdown timer on the top right shows your exact remaining time. Upon timer expiration, your test will be auto-submitted.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
              General Instructions:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>
                <strong>Total Marks: 100 Marks</strong> (Part A: Practical Problem Solving - 80 Marks + Part B: Viva Voce - 20 Marks).
              </li>
              <li>
                <strong>Attempt Requirement:</strong> Candidates are required to solve and submit <strong>ANY TWO (2)</strong> out of the three practical questions.
              </li>
              <li>
                <strong>Evaluation Criteria:</strong> Each attempted question carries 40 marks. Evaluation considers logic correctness, syntax compliance, output verification, and code structure.
              </li>
              <li>
                <strong>Media Assets:</strong> If the question requires images or media, click on the <strong>Gallery</strong> button in the top header to copy image URLs or HTML tags.
              </li>
              <li>
                <strong>Saving Work:</strong> Your answers and code are automatically preserved as you edit and run. You can switch between questions at any time using the Question Palette on the right.
              </li>
              <li>
                <strong>Review Option:</strong> Check the "Review" box at the bottom if you want to flag a question to revisit before final submission.
              </li>
              <li>
                <strong>Submitting:</strong> Once satisfied with your practical solution, click <strong>"Submit Test"</strong> to proceed to Viva Voce and generate your official AI evaluation scorecard.
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px]">
              Do not refresh your browser or close the exam tab during the session. Fullscreen mode is recommended for the best exam experience.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-[#2B56C6] hover:bg-[#1E3A8A] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
          >
            I Understand & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
