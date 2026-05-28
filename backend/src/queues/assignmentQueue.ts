import { Queue } from 'bullmq';

const getBullMQConnection = () => {
  if (process.env.REDIS_URL) {
    const url = new URL(process.env.REDIS_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port),
      password: url.password || undefined,
      tls: { rejectUnauthorized: false },
    };
  }
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  };
};

export const bullMQConnection = getBullMQConnection();

export const assignmentQueue = new Queue('assignment-generation', {
  connection: bullMQConnection,
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