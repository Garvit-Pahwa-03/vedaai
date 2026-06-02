import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionType {
  type: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  questionTypes: IQuestionType[];
  additionalInstructions: string;
  filePath?: string;
  totalQuestions: number;
  totalMarks: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema<IQuestionType>({
  type: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true, min: 0 },
  marksPerQuestion: { type: Number, required: true, min: 0 },
});

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, default: 'Untitled Assignment' },
    dueDate: { type: Date, required: true },
    questionTypes: [QuestionTypeSchema],
    additionalInstructions: { type: String, default: '' },
    filePath: { type: String },
    totalQuestions: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    jobId: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);