export interface QuestionType {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface Question {
  text: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  marks: number;
  answer?: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  questionTypes: QuestionType[];
  additionalInstructions: string;
  totalQuestions: number;
  totalMarks: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  sections: Section[];
  createdAt: string;
}