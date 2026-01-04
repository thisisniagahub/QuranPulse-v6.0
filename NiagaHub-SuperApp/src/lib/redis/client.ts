import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error('REDIS_URL is not defined in .env.local');
}

// Singleton pattern untuk elakkan too many connections dalam Next.js (hot reload)
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(REDIS_URL, {
    // Retry strategy jika connection putus
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

console.log('⚡ Redis Client Initialized');
