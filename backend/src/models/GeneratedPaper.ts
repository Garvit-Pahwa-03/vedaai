import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  text: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  marks: number;
  answer?: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IGeneratedPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  sections: ISection[];
  rawPrompt: string;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'moderate', 'hard'], required: true },
  marks: { type: Number, required: true },
  answer: { type: String },
});

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema],
});

const GeneratedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    schoolName: { type: String, default: 'Delhi Public School' },
    subject: { type: String, default: 'General' },
    className: { type: String, default: '8th' },
    timeAllowed: { type: String, default: '45 minutes' },
    maximumMarks: { type: Number, default: 0 },
    sections: [SectionSchema],
    rawPrompt: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);