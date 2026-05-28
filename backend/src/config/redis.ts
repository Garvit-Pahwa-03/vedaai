import { Redis } from 'ioredis';

// General purpose Redis client
export const redis = new Redis(
  process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
  {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...(process.env.REDIS_URL ? { tls: { rejectUnauthorized: false } } : {}),
  }
);

redis.on('connect', () => console.log('Redis Connected'));
redis.on('error', (err) => console.error('Redis Error:', err));