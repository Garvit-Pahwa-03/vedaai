import 'dotenv/config';
import { Worker } from 'bullmq';
import { bullMQConnection } from '../queues/assignmentQueue';
import { connectDB } from '../config/database';
import Assignment from '../models/Assignment';
import GeneratedPaper from '../models/GeneratedPaper';
import { generateQuestionPaper } from '../services/aiService';
import { wsManager } from '../services/websocketManager';
import fs from 'fs';

connectDB();

const worker = new Worker(
  'assignment-generation',
  async (job) => {
    const { assignmentId } = job.data;

    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
    wsManager.notifyAssignment(assignmentId, { type: 'status', status: 'processing' });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    let fileContent: string | undefined;
    if (assignment.filePath && fs.existsSync(assignment.filePath)) {
      fileContent = fs.readFileSync(assignment.filePath, 'utf-8');
    }

    const { parsed, rawPrompt } = await generateQuestionPaper(
      assignment.questionTypes,
      assignment.additionalInstructions,
      fileContent
    );

    const paper = await GeneratedPaper.create({
      assignmentId,
      ...parsed,
      rawPrompt,
    });

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'completed',
      title: `${parsed.subject} - ${parsed.className}`,
    });

    wsManager.notifyAssignment(assignmentId, {
      type: 'completed',
      status: 'completed',
      paperId: paper._id,
    });

    return { paperId: paper._id };
  },
  { connection: bullMQConnection, concurrency: 2 }
);

worker.on('failed', async (job, err) => {
  if (job) {
    await Assignment.findByIdAndUpdate(job.data.assignmentId, { status: 'failed' });
    wsManager.notifyAssignment(job.data.assignmentId, {
      type: 'failed',
      status: 'failed',
      error: err.message,
    });
  }
  console.error('Job failed:', err);
});

console.log('Worker started');