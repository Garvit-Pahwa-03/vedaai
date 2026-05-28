'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Download } from 'lucide-react';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useWebSocket } from '@/lib/useWebSocket';
import { Question } from '@/types';

const difficultyStyle = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-600',
};

export default function AssignmentOutputPage() {
  const { id } = useParams<{ id: string }>();
  const { currentPaper, fetchPaper, assignments, fetchAssignments } = useAssignmentStore();
  const [isLoading, setIsLoading] = useState(true);
  useWebSocket(id);

  const assignment = assignments.find((a) => a._id === id);

  useEffect(() => {
    fetchAssignments();
    fetchPaper(id).finally(() => setIsLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
        <p className="text-xs md:text-sm text-gray-500 text-center px-4">
          {assignment?.status === 'processing'
            ? 'AI is generating your question paper...'
            : 'Loading...'}
        </p>
      </div>
    );
  }

  if (!currentPaper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <p className="text-sm text-gray-500 text-center">
          {assignment?.status === 'failed'
            ? 'Generation failed. Please try again.'
            : 'Paper not generated yet. Please wait...'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 md:m-2 md:ml-4 min-h-[calc(100vh-110px)] md:bg-[#474747] md:rounded-2xl md:p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto">

        {/* Action bar */}
        <div className="bg-[#1e1e1e] text-white rounded-xl p-3 md:p-4 mb-4 md:mb-6 shadow-md">
          <p className="text-xs md:text-sm text-gray-300 mb-3 leading-relaxed">
            Certainly, Lakshya! Here are customized Question Paper for your{' '}
            <span className="text-white font-medium">
              {currentPaper.schoolName} — {currentPaper.subject} Class {currentPaper.className}
            </span>
          </p>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white text-gray-900 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm"
          >
            <Download size={13} />
            Download as PDF
          </button>
        </div>

        {/* Question Paper */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-4 md:p-10 shadow-lg print:shadow-none print:border-none"
          id="paper"
        >
          {/* School header */}
          <div className="text-center border-b border-gray-200 pb-4 md:pb-6 mb-4 md:mb-6">
            <h1 className="text-lg md:text-2xl font-bold text-gray-950 tracking-tight">
              {currentPaper.schoolName}
            </h1>
            <p className="text-sm md:text-base font-semibold text-gray-800 mt-1">
              Subject: {currentPaper.subject}
            </p>
            <p className="text-sm md:text-base font-semibold text-gray-800">
              Class: {currentPaper.className}
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between text-xs md:text-sm font-medium text-gray-800 mb-4 md:mb-6 gap-1">
            <span>Time Allowed: {currentPaper.timeAllowed}</span>
            <span>Maximum Marks: {currentPaper.maximumMarks}</span>
          </div>

          <p className="text-xs md:text-sm italic mb-4 md:mb-6 text-gray-600">
            All questions are compulsory unless stated otherwise.
          </p>

          {/* Student info */}
          <div className="mb-6 md:mb-8 space-y-2 md:space-y-3">
            {['Name', 'Roll Number'].map((label) => (
              <div key={label} className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-800">
                <span className="whitespace-nowrap">{label}:</span>
                <div className="flex-1 border-b border-gray-400 max-w-[160px] md:max-w-xs" />
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-800">
              <span className="whitespace-nowrap">Class: {currentPaper.className} Section:</span>
              <div className="flex-1 border-b border-gray-400 max-w-[120px] md:max-w-xs" />
            </div>
          </div>

          {/* Sections */}
          {currentPaper.sections.map((section, sIndex) => (
            <div key={sIndex} className="mb-6 md:mb-8">
              <h2 className="text-base md:text-lg font-bold text-gray-900 text-center mb-3 md:mb-4">
                {section.title}
              </h2>
              <p className="text-xs md:text-sm font-bold text-gray-800 mb-1">
                {section.title.replace('Section', '')} Questions
              </p>
              <p className="text-[10px] md:text-xs text-gray-500 italic mb-3 md:mb-4">
                {section.instruction}
              </p>

              <ol className="space-y-3 md:space-y-4">
                {section.questions.map((q: Question, qIndex: number) => (
                  <li key={qIndex} className="flex gap-2 md:gap-3">
                    <span className="text-xs md:text-sm font-semibold text-gray-900 flex-shrink-0 w-5 md:w-6">
                      {qIndex + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-800 leading-relaxed mb-1">
                        {q.text}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${difficultyStyle[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] md:text-xs font-medium text-gray-500">
                          [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}

          {/* Answer Key */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
            <h2 className="text-sm md:text-base font-bold text-gray-900 mb-3 md:mb-4">
              Answer Key:
            </h2>
            {currentPaper.sections.map((section, sIndex) =>
              section.questions.map((q: Question, qIndex: number) => (
                <div key={`${sIndex}-${qIndex}`} className="mb-2 md:mb-3">
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">{qIndex + 1}.</span> {q.answer}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #paper, #paper * { visibility: visible; }
          #paper { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
        }
      `}</style>
    </div>
  );
}