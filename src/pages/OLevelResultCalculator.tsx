import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Share2, 
  Printer, 
  ArrowRight, 
  Award, 
  BookOpen, 
  Percent, 
  Check, 
  Copy,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';

interface ModuleScore {
  theory: number | '';
  practical: number | '';
}

interface ModuleResult {
  theoryScore: number;
  practicalScore: number;
  theoryWeight: number;
  practicalWeight: number;
  totalWeightedScore: number;
  theoryPassed: boolean;
  practicalPassed: boolean;
  isPassed: boolean;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  gradeDescription: string;
  statusMessage: string;
  failureReason?: string;
}

export function OLevelResultCalculator() {
  // Mode: 'single' (1 paper quick check) or 'full' (all 4 papers + diploma)
  const [calcMode, setCalcMode] = useState<'single' | 'full'>('single');

  // Single paper state
  const [selectedModule, setSelectedModule] = useState<'M1-R5' | 'M2-R5' | 'M3-R5' | 'M4-R5'>('M1-R5');
  const [singleTheory, setSingleTheory] = useState<number | ''>(65);
  const [singlePractical, setSinglePractical] = useState<number | ''>(75);

  // Full 4 modules state
  const [modulesData, setModulesData] = useState<{
    'M1-R5': ModuleScore;
    'M2-R5': ModuleScore;
    'M3-R5': ModuleScore;
    'M4-R5': ModuleScore;
  }>({
    'M1-R5': { theory: 60, practical: 70 },
    'M2-R5': { theory: 65, practical: 80 },
    'M3-R5': { theory: 55, practical: 65 },
    'M4-R5': { theory: 70, practical: 75 },
  });

  const [projectSubmitted, setProjectSubmitted] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Helper to compute a single paper's result according to NIELIT R5.1 official rules
  const calculatePaperResult = (theoryInput: number | '', practicalInput: number | ''): ModuleResult => {
    const theory = typeof theoryInput === 'number' ? Math.min(100, Math.max(0, theoryInput)) : 0;
    const practical = typeof practicalInput === 'number' ? Math.min(100, Math.max(0, practicalInput)) : 0;

    const theoryPassed = theory >= 33;
    const practicalPassed = practical >= 33;

    // Rule 1: Both theory and practical MUST be at least 33
    if (!theoryPassed || !practicalPassed) {
      let failureReason = '';
      if (!theoryPassed && !practicalPassed) {
        failureReason = 'Failed: Both Theory & Practical marks are below minimum qualifying threshold (33 marks).';
      } else if (!theoryPassed) {
        failureReason = `Failed: Theory score (${theory}/100) is below minimum qualifying mark of 33.`;
      } else {
        failureReason = `Failed: Practical score (${practical}/100) is below minimum qualifying mark of 33.`;
      }

      return {
        theoryScore: theory,
        practicalScore: practical,
        theoryWeight: Number((theory * 0.6).toFixed(2)),
        practicalWeight: Number((practical * 0.4).toFixed(2)),
        totalWeightedScore: Number(((theory * 0.6) + (practical * 0.4)).toFixed(2)),
        theoryPassed,
        practicalPassed,
        isPassed: false,
        grade: 'F',
        gradeDescription: 'Fail (Below Qualifying Cutoff)',
        statusMessage: 'FAIL (Min 33 Marks Not Met in Each Component)',
        failureReason
      };
    }

    // Rule 2: 60% Theory + 40% Practical
    const theoryWeight = Number((theory * 0.6).toFixed(2));
    const practicalWeight = Number((practical * 0.4).toFixed(2));
    const totalWeightedScore = Number((theoryWeight + practicalWeight).toFixed(2));

    // Rule 3: Overall aggregate must be at least 50%
    if (totalWeightedScore < 50) {
      return {
        theoryScore: theory,
        practicalScore: practical,
        theoryWeight,
        practicalWeight,
        totalWeightedScore,
        theoryPassed: true,
        practicalPassed: true,
        isPassed: false,
        grade: 'F',
        gradeDescription: 'Fail (Aggregate < 50%)',
        statusMessage: 'FAIL (Total Weighted Score is below 50.0%)',
        failureReason: `Failed: Total weighted score (${totalWeightedScore}%) is less than the required 50% aggregate passing mark.`
      };
    }

    // Rule 4: NIELIT Grading Scale
    let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'D';
    let gradeDescription = 'Pass';

    if (totalWeightedScore >= 85) {
      grade = 'S';
      gradeDescription = 'Super / Outstanding (85% to 100%)';
    } else if (totalWeightedScore >= 75) {
      grade = 'A';
      gradeDescription = 'Excellent (75% to 84%)';
    } else if (totalWeightedScore >= 65) {
      grade = 'B';
      gradeDescription = 'Good (65% to 74%)';
    } else if (totalWeightedScore >= 55) {
      grade = 'C';
      gradeDescription = 'Satisfactory (55% to 64%)';
    } else {
      grade = 'D';
      gradeDescription = 'Pass (50% to 54%)';
    }

    return {
      theoryScore: theory,
      practicalScore: practical,
      theoryWeight,
      practicalWeight,
      totalWeightedScore,
      theoryPassed: true,
      practicalPassed: true,
      isPassed: true,
      grade,
      gradeDescription,
      statusMessage: `PASS WITH GRADE ${grade}`
    };
  };

  const singleResult = calculatePaperResult(singleTheory, singlePractical);

  // Calculate full 4 papers summary
  const m1Res = calculatePaperResult(modulesData['M1-R5'].theory, modulesData['M1-R5'].practical);
  const m2Res = calculatePaperResult(modulesData['M2-R5'].theory, modulesData['M2-R5'].practical);
  const m3Res = calculatePaperResult(modulesData['M3-R5'].theory, modulesData['M3-R5'].practical);
  const m4Res = calculatePaperResult(modulesData['M4-R5'].theory, modulesData['M4-R5'].practical);

  const allPassed = m1Res.isPassed && m2Res.isPassed && m3Res.isPassed && m4Res.isPassed && projectSubmitted;
  const averageAggregate = Number(((m1Res.totalWeightedScore + m2Res.totalWeightedScore + m3Res.totalWeightedScore + m4Res.totalWeightedScore) / 4).toFixed(2));

  let finalDiplomaGrade = 'F';
  if (allPassed) {
    if (averageAggregate >= 85) finalDiplomaGrade = 'S';
    else if (averageAggregate >= 75) finalDiplomaGrade = 'A';
    else if (averageAggregate >= 65) finalDiplomaGrade = 'B';
    else if (averageAggregate >= 55) finalDiplomaGrade = 'C';
    else finalDiplomaGrade = 'D';
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetSingle = () => {
    setSingleTheory(50);
    setSinglePractical(50);
  };

  const handlePrint = () => {
    window.print();
  };

  const getGradeBadgeStyle = (grade: string) => {
    switch (grade) {
      case 'S':
        return 'bg-amber-500 text-slate-950 border-amber-400';
      case 'A':
        return 'bg-emerald-600 text-white border-emerald-500';
      case 'B':
        return 'bg-blue-600 text-white border-blue-500';
      case 'C':
        return 'bg-indigo-600 text-white border-indigo-500';
      case 'D':
        return 'bg-slate-700 text-white border-slate-600';
      default:
        return 'bg-red-600 text-white border-red-500';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SEO 
        title="NIELIT O Level Result & Marks Calculator 2026"
        description="Calculate your NIELIT O Level Theory (60%) & Practical (40%) weighted marks, qualifying criteria (min 33 marks each), overall pass/fail status, and final grade according to R5.1 rules."
        keywords={[
          'O Level result calculator',
          'NIELIT marks calculator',
          'O Level theory practical 60 40 weightage',
          'NIELIT O level passing criteria',
          'O level grade calculator online',
          'Skilldotpy result calculator'
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white py-10 sm:py-14 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>NIELIT R5.1 Official Formula</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            NIELIT O Level Result Calculator
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Accurate, real-time calculation based on the official <strong>60% Theory + 40% Practical</strong> weightage and <strong>minimum 33 marks</strong> qualifying criteria.
          </p>

          {/* Mode Switcher */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-lg">
            <button
              onClick={() => setCalcMode('single')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                calcMode === 'single'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Single Paper Calculator
            </button>
            <button
              onClick={() => setCalcMode('full')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                calcMode === 'full'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Full 4-Papers Diploma Calculator
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6">
        
        {/* =========================================================================
            CALCULATOR MODE 1: SINGLE PAPER QUICK CALCULATOR
           ========================================================================= */}
        {calcMode === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Input Controls Card */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Enter Your Marks</h2>
                  <p className="text-xs text-slate-500">Out of 100 marks for each exam</p>
                </div>
                <button
                  onClick={handleResetSingle}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Reset Inputs"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Module Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Select Paper / Module
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['M1-R5', 'M2-R5', 'M3-R5', 'M4-R5'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedModule(m)}
                      className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        selectedModule === m
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theory Marks Input */}
              <div className="space-y-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Theory Exam Marks (CBT)</span>
                    <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-black">60% Weight</span>
                  </label>
                  <span className="text-xs font-bold text-slate-500">Max 100</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={singleTheory}
                    onChange={(e) => setSingleTheory(e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))))}
                    placeholder="e.g. 65"
                    className="w-24 text-center font-black text-lg bg-white border-2 border-slate-300 focus:border-blue-600 focus:ring-0 rounded-xl py-2 text-slate-900 shadow-inner"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={singleTheory === '' ? 0 : singleTheory}
                    onChange={(e) => setSingleTheory(Number(e.target.value))}
                    className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 font-semibold">
                  <span className={Number(singleTheory) >= 33 ? 'text-emerald-700' : 'text-red-600'}>
                    {Number(singleTheory) >= 33 ? '✓ Minimum 33 marks passed' : '⚠ Must score minimum 33'}
                  </span>
                  <span className="text-slate-600 font-bold">
                    60% = {((Number(singleTheory) || 0) * 0.6).toFixed(1)} marks
                  </span>
                </div>
              </div>

              {/* Practical Marks Input */}
              <div className="space-y-2 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Practical Lab Exam Marks</span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full font-black">40% Weight</span>
                  </label>
                  <span className="text-xs font-bold text-slate-500">Max 100</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={singlePractical}
                    onChange={(e) => setSinglePractical(e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))))}
                    placeholder="e.g. 75"
                    className="w-24 text-center font-black text-lg bg-white border-2 border-slate-300 focus:border-indigo-600 focus:ring-0 rounded-xl py-2 text-slate-900 shadow-inner"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={singlePractical === '' ? 0 : singlePractical}
                    onChange={(e) => setSinglePractical(Number(e.target.value))}
                    className="flex-1 accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 font-semibold">
                  <span className={Number(singlePractical) >= 33 ? 'text-emerald-700' : 'text-red-600'}>
                    {Number(singlePractical) >= 33 ? '✓ Minimum 33 marks passed' : '⚠ Must score minimum 33'}
                  </span>
                  <span className="text-slate-600 font-bold">
                    40% = {((Number(singlePractical) || 0) * 0.4).toFixed(1)} marks
                  </span>
                </div>
              </div>

              {/* Summary of NIELIT Rules */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Passing Rules Checklist:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                  <li>Theory Score $\ge$ 33/100 (Pass individual threshold)</li>
                  <li>Practical Score $\ge$ 33/100 (Pass individual threshold)</li>
                  <li>Weighted Aggregate (Theory 60% + Practical 40%) $\ge$ 50%</li>
                </ul>
              </div>

            </div>

            {/* Output Result Card */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className={`rounded-3xl border-2 shadow-xl p-6 sm:p-8 transition-all overflow-hidden ${
                singleResult.isPassed 
                  ? 'bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/30 border-emerald-400' 
                  : 'bg-gradient-to-br from-white via-red-50/40 to-red-100/30 border-red-400'
              }`}>
                
                {/* Result Status Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                  <div>
                    <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                      Paper {selectedModule} Result
                    </span>
                    <h3 className={`text-2xl font-black tracking-tight ${
                      singleResult.isPassed ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      {singleResult.isPassed ? 'CONGRATULATIONS - PASSED' : 'RESULT: FAILED'}
                    </h3>
                  </div>

                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black shadow-md border ${getGradeBadgeStyle(singleResult.grade)}`}>
                    <span className="text-2xl leading-none">{singleResult.grade}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold">Grade</span>
                  </div>
                </div>

                {/* Score Breakdown Metrics */}
                <div className="grid grid-cols-3 gap-3 my-6 text-center">
                  <div className="p-3 bg-white/80 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Theory (60%)</span>
                    <span className="text-lg font-black text-slate-900">
                      {singleResult.theoryWeight}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">from {singleResult.theoryScore}</span>
                  </div>

                  <div className="p-3 bg-white/80 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Practical (40%)</span>
                    <span className="text-lg font-black text-slate-900">
                      {singleResult.practicalWeight}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">from {singleResult.practicalScore}</span>
                  </div>

                  <div className={`p-3 rounded-2xl border ${
                    singleResult.isPassed ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-red-600 text-white border-red-500'
                  }`}>
                    <span className="text-[10px] uppercase font-bold text-white/80 block">Final Total</span>
                    <span className="text-xl font-black text-white">
                      {singleResult.totalWeightedScore}%
                    </span>
                    <span className="text-[10px] text-white/80 block font-medium">Min 50%</span>
                  </div>
                </div>

                {/* Formula Visualizer Box */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-700 block uppercase tracking-wider">
                    Official Calculation Formula:
                  </span>
                  
                  <div className="font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 space-y-1 text-[11px] sm:text-xs">
                    <p>Theory Weight = {singleResult.theoryScore} × 0.60 = <strong>{singleResult.theoryWeight}</strong></p>
                    <p>Practical Weight = {singleResult.practicalScore} × 0.40 = <strong>{singleResult.practicalWeight}</strong></p>
                    <p className="pt-1 border-t border-slate-300 font-bold text-blue-700">
                      Final Score = {singleResult.theoryWeight} + {singleResult.practicalWeight} = {singleResult.totalWeightedScore}%
                    </p>
                  </div>

                  {singleResult.failureReason ? (
                    <div className="p-3 rounded-xl bg-red-100 text-red-900 border border-red-200 text-xs font-semibold flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{singleResult.failureReason}</span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>All qualifying conditions met! Grade awarded: <strong>{singleResult.gradeDescription}</strong></span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                    <span>{copied ? 'Link Copied!' : 'Share Calculator'}</span>
                  </button>

                  <Link
                    to={`/o-level/${selectedModule.toLowerCase()}`}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>Read {selectedModule} Notes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

              {/* NIELIT Official Grade System Scale */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-extrabold text-slate-900">NIELIT Official Grading Scale</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-extrabold">
                        <th className="py-2 px-2">Grade</th>
                        <th className="py-2 px-2">Marks Range</th>
                        <th className="py-2 px-2">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr className={singleResult.grade === 'S' ? 'bg-amber-50 font-bold text-amber-900' : ''}>
                        <td className="py-2 px-2"><span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[11px]">S</span></td>
                        <td className="py-2 px-2">85% and above</td>
                        <td className="py-2 px-2">Outstanding</td>
                      </tr>
                      <tr className={singleResult.grade === 'A' ? 'bg-emerald-50 font-bold text-emerald-900' : ''}>
                        <td className="py-2 px-2"><span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[11px]">A</span></td>
                        <td className="py-2 px-2">75% to 84%</td>
                        <td className="py-2 px-2">Excellent</td>
                      </tr>
                      <tr className={singleResult.grade === 'B' ? 'bg-blue-50 font-bold text-blue-900' : ''}>
                        <td className="py-2 px-2"><span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[11px]">B</span></td>
                        <td className="py-2 px-2">65% to 74%</td>
                        <td className="py-2 px-2">Good</td>
                      </tr>
                      <tr className={singleResult.grade === 'C' ? 'bg-indigo-50 font-bold text-indigo-900' : ''}>
                        <td className="py-2 px-2"><span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-black text-[11px]">C</span></td>
                        <td className="py-2 px-2">55% to 64%</td>
                        <td className="py-2 px-2">Satisfactory</td>
                      </tr>
                      <tr className={singleResult.grade === 'D' ? 'bg-slate-100 font-bold text-slate-900' : ''}>
                        <td className="py-2 px-2"><span className="px-2 py-0.5 rounded bg-slate-700 text-white font-black text-[11px]">D</span></td>
                        <td className="py-2 px-2">50% to 54%</td>
                        <td className="py-2 px-2">Pass</td>
                      </tr>
                      <tr className={singleResult.grade === 'F' ? 'bg-red-50 font-bold text-red-900' : ''}>
                        <td className="py-2 px-2"><span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[11px]">F</span></td>
                        <td className="py-2 px-2">Below 50%</td>
                        <td className="py-2 px-2 text-red-600">Fail</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* PRIME AD PLACEMENT: Below Single Paper Calculator */}
            <div className="lg:col-span-12 no-print">
              <AdBanner slotId="calculator-single-result" format="horizontal" fallbackType="app" />
            </div>

          </div>
        )}

        {/* =========================================================================
            CALCULATOR MODE 2: ALL 4 PAPERS DIPLOMA CALCULATOR
           ========================================================================= */}
        {calcMode === 'full' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Full 4-Papers Diploma Calculator</h2>
                  <p className="text-xs text-slate-500">Calculate your complete NIELIT O Level certificate grade</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    allPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {allPassed ? 'Diploma Eligible' : 'Incomplete / Pending'}
                  </span>
                </div>
              </div>

              {/* 4 Papers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Paper 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Paper 1
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 mt-1">M1-R5: IT Tools & Basics</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${getGradeBadgeStyle(m1Res.grade)}`}>
                      {m1Res.grade} ({m1Res.totalWeightedScore}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Theory (60%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={modulesData['M1-R5'].theory}
                        onChange={(e) => setModulesData(prev => ({
                          ...prev,
                          'M1-R5': { ...prev['M1-R5'], theory: e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))) }
                        }))}
                        className="w-full text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Practical (40%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={modulesData['M1-R5'].practical}
                        onChange={(e) => setModulesData(prev => ({
                          ...prev,
                          'M1-R5': { ...prev['M1-R5'], practical: e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))) }
                        }))}
                        className="w-full text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Paper 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Paper 2
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 mt-1">M2-R5: Web Design & Publishing</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${getGradeBadgeStyle(m2Res.grade)}`}>
                      {m2Res.grade} ({m2Res.totalWeightedScore}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Theory (60%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={modulesData['M2-R5'].theory}
                        onChange={(e) => setModulesData(prev => ({
                          ...prev,
                          'M2-R5': { ...prev['M2-R5'], theory: e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))) }
                        }))}
                        className="w-full text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Practical (40%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={modulesData['M2-R5'].practical}
                        onChange={(e) => setModulesData(prev => ({
                          ...prev,
                          'M2-R5': { ...prev['M2-R5'], practical: e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))) }
                        }))}
                        className="w-full text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Paper 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Paper 3
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 mt-1">M3-R5: Python Programming</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${getGradeBadgeStyle(m3Res.grade)}`}>
                      {m3Res.grade} ({m3Res.totalWeightedScore}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Theory (60%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={modulesData['M3-R5'].theory}
                        onChange={(e) => setModulesData(prev => ({
                          ...prev,
                          'M3-R5': { ...prev['M3-R5'], theory: e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))) }
                        }))}
                        className="w-full text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Practical (40%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={modulesData['M3-R5'].practical}
                        onChange={(e) => setModulesData(prev => ({
                          ...prev,
                          'M3-R5': { ...prev['M3-R5'], practical: e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))) }
                        }))}
                        className="w-full text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Paper 4 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Paper 4
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 mt-1">M4-R5: Internet of Things (IoT)</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-black text-xs ${getGradeBadgeStyle(m4Res.grade)}`}>
                      {m4Res.grade} ({m4Res.totalWeightedScore}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Theory (60%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={modulesData['M4-R5'].theory}
                        onChange={(e) => setModulesData(prev => ({
                          ...prev,
                          'M4-R5': { ...prev['M4-R5'], theory: e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))) }
                        }))}
                        className="w-full text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Practical (40%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={modulesData['M4-R5'].practical}
                        onChange={(e) => setModulesData(prev => ({
                          ...prev,
                          'M4-R5': { ...prev['M4-R5'], practical: e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value))) }
                        }))}
                        className="w-full text-center font-bold bg-white border border-slate-300 rounded-lg py-1.5"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Project Status Toggle */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">NIELIT PJ1-R5 Project Status</h4>
                  <p className="text-[11px] text-slate-600">Mandatory project submission with ₹100 fee to NIELIT</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={projectSubmitted}
                    onChange={(e) => setProjectSubmitted(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Project Cleared / Submitted</span>
                </label>
              </div>

              {/* Final Diploma Summary Card */}
              <div className={`p-6 rounded-3xl border-2 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 ${
                allPassed ? 'bg-gradient-to-r from-emerald-500 to-teal-700 text-white border-emerald-400' : 'bg-slate-900 text-white border-slate-700'
              }`}>
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-white/80 block">
                    Overall NIELIT O Level Diploma Result
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-1">
                    {allPassed ? 'PASSED - O LEVEL CERTIFICATE GRANTED' : 'PENDING / RETAKE REQUIRED'}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 max-w-xl">
                    {allPassed 
                      ? `Average aggregate score across 4 modules is ${averageAggregate}%. You have earned Grade ${finalDiplomaGrade} for your NIELIT O Level certification.`
                      : 'Ensure all 4 modules satisfy min 33 in Theory, min 33 in Practical, 50% aggregate, and project submission.'
                    }
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20">
                    <span className="text-[10px] uppercase font-bold text-white/80 block">Aggregate</span>
                    <span className="text-2xl font-black text-white">{averageAggregate}%</span>
                  </div>

                  <div className="text-center bg-white text-slate-950 p-3.5 rounded-2xl shadow-xl">
                    <span className="text-[10px] uppercase font-black text-slate-500 block">Final Grade</span>
                    <span className="text-2xl font-black text-slate-950">{finalDiplomaGrade}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* PRIME AD PLACEMENT: Below Full Diploma Calculator */}
            <div className="no-print">
              <AdBanner slotId="calculator-full-diploma-result" format="horizontal" fallbackType="youtube" />
            </div>

          </div>
        )}

        {/* FAQs & Official Passing Criteria Explanations */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-black text-slate-900">NIELIT O Level Exam & Marking Scheme FAQs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm">What is the 60:40 formula in NIELIT O Level?</h4>
              <p>
                As per the revised R5.1 examination scheme, each module has two components: Online CBT Theory (100 marks) and Practical Lab (100 marks). NIELIT calculates 60% weightage from Theory marks and 40% weightage from Practical marks to determine the module total.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm">What is the minimum passing cutoff?</h4>
              <p>
                Candidates must score a minimum of <strong>33 marks out of 100 in Theory</strong> AND a minimum of <strong>33 marks out of 100 in Practical</strong> individually. Additionally, the combined weighted average must be at least <strong>50%</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm">What happens if I score 30 in Theory and 80 in Practical?</h4>
              <p className="text-red-700 font-semibold">
                You will be marked <strong>FAIL</strong> because Theory score (30) is below the mandatory minimum qualifying cutoff of 33, even though your combined total would have been mathematically over 50%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-sm">Is the NIELIT project graded?</h4>
              <p>
                The Project (PJ1-R5) has no marks or grades, but project submission and approval by NIELIT is strictly mandatory to obtain the final O Level Diploma certificate.
              </p>
            </div>
          </div>

          {/* Prime Monetization Banner */}
          <div className="pt-4 no-print">
            <AdBanner slotId="calculator-faq-bottom" format="horizontal" fallbackType="mock-test" />
          </div>
        </div>

      </div>
    </div>
  );
}
