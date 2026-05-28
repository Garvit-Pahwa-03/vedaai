'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus, Minus, X, Mic, ArrowLeft } from 'lucide-react';
import { useAssignmentStore } from '@/store/assignmentStore';

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False Questions',
  'Fill in the Blanks',
];

export default function CreateAssignmentPage() {
  const router = useRouter();
  const {
    questionTypes, dueDate, additionalInstructions, file,
    addQuestionType, removeQuestionType, updateQuestionType,
    setDueDate, setAdditionalInstructions, setFile,
    createAssignment, resetForm,
  } = useAssignmentStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (questionTypes.length === 0) newErrors.questionTypes = 'Add at least one question type';
    questionTypes.forEach((qt, i) => {
      if (qt.numberOfQuestions <= 0) newErrors[`qt_${i}_num`] = 'Must be > 0';
      if (qt.marksPerQuestion <= 0) newErrors[`qt_${i}_marks`] = 'Must be > 0';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalQuestions = questionTypes.reduce((s, q) => s + q.numberOfQuestions, 0);
  const totalMarks = questionTypes.reduce((s, q) => s + q.numberOfQuestions * q.marksPerQuestion, 0);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSubmitting) return;
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const assignmentId = await createAssignment();
      resetForm();
      router.push(`/assignments/${assignmentId}`);
    } catch (err: any) {
      setErrors({ submit: err?.message || 'Failed to create assignment. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div className="p-3 md:p-6 mx-auto">
      
      {/* Desktop Top Header Bar Layout */}
      <div className="hidden md:flex mb-6 max-w-5xl mx-auto items-start gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] mt-1.5 shrink-0" />
        <div>
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">
            Create Assignment
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Set up a new assignment for your students
          </p>
        </div>
      </div>

      {/* Mobile Top Header Bar Layout (Figma Design Match) */}
      <div className="flex md:hidden relative items-center justify-center min-h-[44px] mb-4 max-w-5xl mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-0 p-2.5 bg-gray-200/60 hover:bg-gray-200 active:bg-gray-300 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft size={18} className="text-gray-800" />
        </button>
        <h1 className="text-sm font-bold text-gray-800 tracking-wide text-center">
          Create Assignment
        </h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="w-full h-1 bg-gray-100 rounded-full mb-6 md:mb-8">
          <div className="h-1 bg-gray-900 rounded-full w-1/2" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
          <h2 className="font-semibold text-sm md:text-base mb-0.5">Assignment Details</h2>
          <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6">
            Basic information about your assignment
          </p>

          <div
            className={`border-2 border-dashed rounded-xl p-5 md:p-8 text-center mb-4 md:mb-6 transition-colors ${
              dragOver ? 'border-gray-400 bg-gray-50' : 'border-gray-200'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
          >
            <Upload size={22} className="mx-auto mb-2 md:mb-3 text-gray-400" />
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs md:text-sm text-gray-600 truncate max-w-[200px]">
                  {file.name}
                </span>
                <button type="button" onClick={() => setFile(null)}>
                  <X size={14} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs md:text-sm text-gray-500 mb-1">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-[10px] md:text-xs text-gray-400 mb-3 md:mb-4">
                  JPEG, PNG, Upto 10MB
                </p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <span className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-200 rounded-lg text-xs md:text-sm hover:bg-gray-50 transition-colors">
                    Browse Files
                  </span>
                </label>
              </>
            )}
          </div>
          <p className="text-[10px] md:text-xs text-gray-400 text-center mb-4 md:mb-6">
            Upload images of your preferred document/image
          </p>

          <div className="mb-4 md:mb-6">
            <label className="block text-xs md:text-sm font-medium mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`w-full px-3 md:px-4 py-2.5 md:py-3 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                errors.dueDate ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.dueDate && (
              <p className="text-[10px] text-red-500 mt-1">{errors.dueDate}</p>
            )}
          </div>

          <div className="mb-4 md:mb-6">
            <p className="text-xs md:text-sm font-medium text-gray-700 mb-3">Question Type</p>

            {questionTypes.map((qt, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-3 md:p-4 mb-3 border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <select
                    value={qt.type}
                    onChange={(e) => updateQuestionType(index, 'type', e.target.value)}
                    className="flex-1 px-2 md:px-3 py-2 border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                  >
                    {QUESTION_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeQuestionType(index)}
                    className="text-gray-400 hover:text-gray-600 shrink-0 p-1"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 mb-2">No. of Questions</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuestionType(index, 'numberOfQuestions', Math.max(0, qt.numberOfQuestions - 1))}
                        className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {qt.numberOfQuestions}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuestionType(index, 'numberOfQuestions', qt.numberOfQuestions + 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 mb-2">Marks</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuestionType(index, 'marksPerQuestion', Math.max(0, qt.marksPerQuestion - 1))}
                        className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {qt.marksPerQuestion}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuestionType(index, 'marksPerQuestion', qt.marksPerQuestion + 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestionType}
              className="flex items-center gap-2 text-xs md:text-sm text-gray-500 hover:text-gray-900 mt-1"
            >
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                <Plus size={11} />
              </div>
              Add Question Type
            </button>
          </div>

          <div className="text-right text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            <p>Total Questions:{' '}
              <span className="font-medium text-gray-900">{totalQuestions}</span>
            </p>
            <p>Total Marks:{' '}
              <span className="font-medium text-gray-900">{totalMarks}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium mb-2">
              Additional Information (For better output)
            </label>
            <div className="relative">
              <textarea
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                rows={4}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
              />
              <button type="button" className="absolute bottom-3 right-3 text-gray-400 hover:text-gray-600">
                <Mic size={15} />
              </button>
            </div>
          </div>

          {errors.submit && (
            <p className="text-xs text-red-500 mt-4 text-center">{errors.submit}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 md:mt-6 pb-20 md:pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 border border-gray-200 rounded-full text-xs md:text-sm hover:bg-gray-50 transition-colors bg-white"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-white text-xs md:text-sm font-medium disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              'Next →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}