import 'dotenv/config';
import { Worker } from 'bullmq';
import { bullMQConnection } from '../queues/assignmentQueue';
import { connectDB } from '../config/database';
import Assignment from '../models/Assignment';
import GeneratedPaper from '../models/GeneratedPaper';
import { generateQuestionPaper } from '../services/aiService';
import { wsManager } from '../services/websocketManager';
import fs from 'fs';
import path from 'path';

connectDB();

const extractFileContent = (filePath: string): string => {
  try {
    if (!fs.existsSync(filePath)) return '';

    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf-8').slice(0, 3000);
    }

    if (ext === '.pdf') {
      const buffer = fs.readFileSync(filePath);
      const text = buffer
        .toString('utf-8')
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text.slice(0, 3000);
    }

    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      return `[Image uploaded: ${path.basename(filePath)}. Generate questions based on the additional instructions provided.]`;
    }

    return '';
  } catch {
    return '';
  }
};

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
      fileContent = extractFileContent(assignment.filePath);
      console.log(`File extracted: ${fileContent.length} chars from ${assignment.filePath}`);
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