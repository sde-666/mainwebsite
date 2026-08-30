import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Terminal,
  Cpu,
  FileText,
  Download,
  ArrowRight
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getPracticalTests } from '../services/practicalService';
import { PracticalTestSet } from '../types/practical';

export const PracticalHub: React.FC = () => {
  const [tests, setTests] = useState<PracticalTestSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTests() {
      setLoading(true);
      const data = await getPracticalTests();
      setTests(data);
      setLoading(false);
    }
    loadTests();
  }, []);

  const papersConfig = [
    {
      id: 'M1-R5',
      title: 'IT Tools and Network Basics',
      shortCode: 'M1-R5.1',
      courseUrl: '/o-level/m1-r5',
      cardBg: 'bg-[#e9f2fa]',
      cardBorder: 'border-[#cde0f2]',
      icon: <FileText className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'M2-R5',
      title: 'Web Designing and Publishing',
      shortCode: 'M2-R5.1',
      courseUrl: '/o-level/m2-r5',
      cardBg: 'bg-[#e9f2fa]',
      cardBorder: 'border-[#cde0f2]',
      icon: <Code className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'M3-R5',
      title: 'Programming and Problem Solving through Python',
      shortCode: 'M3-R5.1',
      courseUrl: '/o-level/m3-r5',
      cardBg: 'bg-[#e9f2fa]',
      cardBorder: 'border-[#cde0f2]',
      icon: <Terminal className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'M4-R5',
      title: 'Internet of Things and its Applications',
      shortCode: 'M4-R5.1',
      courseUrl: '/o-level/m4-r5',
      cardBg: 'bg-[#e9f2fa]',
      cardBorder: 'border-[#cde0f2]',
      icon: <Cpu className="w-6 h-6 text-blue-600" />
    }
  ];

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <SEO
        title="O Level Practical Exam Simulator"
        description="Practice NIELIT O Level Practical exams (PR1 to PR4) with live code runner."
      />
      
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Practical Exam <span className="text-blue-600">Simulator</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Experience the authentic NIELIT Lab Examination environment with real-time in-browser code execution for <strong>Python (PR3)</strong>, <strong>Web Designing (PR2)</strong>, <strong>Arduino & IoT (PR4)</strong>, and <strong>IT Tools (PR1)</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {papersConfig.map((paper) => {
            const paperTests = tests.filter(t => t.module === paper.id);
            return (
              <div
                key={paper.id}
                className={`${paper.cardBg} ${paper.cardBorder} border rounded-2xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {paper.title}
                    </h2>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
                      {paper.shortCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                    {paperTests.length > 0 ? paperTests.map((test) => (
                      <Link
                        key={test.id}
                        to={`/practical-practice/${test.id}`}
                        className="bg-white hover:bg-blue-50/50 rounded-xl p-3 sm:p-4 border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                        title={`${test.title}`}
                      >
                        <div className="h-10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                          {paper.icon}
                        </div>
                        <span className="text-xs sm:text-[13px] font-semibold text-slate-800 group-hover:text-blue-600">
                          {test.paperCode}
                        </span>
                      </Link>
                    )) : (
                       <div className="col-span-2 sm:col-span-3 text-center p-4 bg-white/50 border border-slate-200 rounded-xl text-slate-500 text-sm">
                         New tests arriving soon
                       </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <Link
                    to={paper.courseUrl}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] active:bg-[#a16207] text-slate-950 font-bold text-xs sm:text-sm shadow-xs transition-colors text-center"
                  >
                    View Course
                  </Link>
                  <a
                    href={`/downloads/${paper.id.toLowerCase()}-practical-codes.pdf`}
                    download
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Solved PDFs
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
