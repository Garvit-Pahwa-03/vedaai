import { create } from 'zustand';
import { Assignment, GeneratedPaper, QuestionType } from '@/types';
import { assignmentApi } from '@/lib/api';

interface AssignmentStore {
  assignments: Assignment[];
  currentPaper: GeneratedPaper | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  questionTypes: QuestionType[];
  dueDate: string;
  additionalInstructions: string;
  file: File | null;
  fetchAssignments: () => Promise<void>;
  createAssignment: () => Promise<string>;
  deleteAssignment: (id: string) => Promise<void>;
  fetchPaper: (assignmentId: string) => Promise<void>;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void;
  setPaperFromWS: (paperId: string, assignmentId: string) => void;
  addQuestionType: () => void;
  removeQuestionType: (index: number) => void;
  updateQuestionType: (index: number, field: keyof QuestionType, value: string | number) => void;
  setDueDate: (date: string) => void;
  setAdditionalInstructions: (instructions: string) => void;
  setFile: (file: File | null) => void;
  resetForm: () => void;
}

const defaultQuestionTypes: QuestionType[] = [
  { type: 'Multiple Choice Questions', numberOfQuestions: 4, marksPerQuestion: 1 },
];

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: [],
  currentPaper: null,
  isLoading: false,
  isGenerating: false,
  error: null,
  questionTypes: defaultQuestionTypes,
  dueDate: '',
  additionalInstructions: '',
  file: null,

  fetchAssignments: async () => {
    set({ isLoading: true, error: null });
    try {
      const assignments = await assignmentApi.getAll();
      set({ assignments, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch assignments', isLoading: false });
    }
  },

  createAssignment: async () => {
    const { questionTypes, dueDate, additionalInstructions, file } = get();
    set({ isGenerating: true, error: null });
    const formData = new FormData();
    formData.append('dueDate', dueDate);
    formData.append('questionTypes', JSON.stringify(questionTypes));
    formData.append('additionalInstructions', additionalInstructions);
    if (file) formData.append('file', file);
    const result = await assignmentApi.create(formData);
    set({ isGenerating: false });
    return result.assignmentId;
  },

  deleteAssignment: async (id: string) => {
    await assignmentApi.delete(id);
    set((state) => ({
      assignments: state.assignments.filter((a) => a._id !== id),
    }));
  },

  fetchPaper: async (assignmentId: string) => {
    set({ isLoading: true });
    try {
      const paper = await assignmentApi.getPaper(assignmentId);
      set({ currentPaper: paper, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateAssignmentStatus: (id, status) => {
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a._id === id ? { ...a, status } : a
      ),
    }));
  },

  setPaperFromWS: (paperId, assignmentId) => {
    assignmentApi.getPaper(assignmentId).then((paper) => {
      set({ currentPaper: paper });
    });
  },

  addQuestionType: () => {
    set((state) => ({
      questionTypes: [
        ...state.questionTypes,
        { type: 'Short Questions', numberOfQuestions: 3, marksPerQuestion: 2 },
      ],
    }));
  },

  removeQuestionType: (index) => {
    set((state) => ({
      questionTypes: state.questionTypes.filter((_, i) => i !== index),
    }));
  },

  updateQuestionType: (index, field, value) => {
    set((state) => ({
      questionTypes: state.questionTypes.map((qt, i) =>
        i === index ? { ...qt, [field]: value } : qt
      ),
    }));
  },

  setDueDate: (date) => set({ dueDate: date }),
  setAdditionalInstructions: (instructions) => set({ additionalInstructions: instructions }),
  setFile: (file) => set({ file }),
  resetForm: () =>
    set({
      questionTypes: defaultQuestionTypes,
      dueDate: '',
      additionalInstructions: '',
      file: null,
    }),
}));

// ── Selector: count assignments with due date today or in the future ──
export const selectUpcomingCount = (state: AssignmentStore) =>
  state.assignments.filter((a) => {
    const due = new Date(a.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due >= today;
  }).length;