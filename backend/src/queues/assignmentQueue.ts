import { Queue } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const assignmentQueue = new Queue('assignment-generation', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 1,
    backoff: { type: 'exponential', delay: 2000 },
  },
});

export const addAssignmentJob = async (assignmentId: string, data: object) => {
  const job = await assignmentQueue.add('generate', { assignmentId, ...data });
  return job.id;
};