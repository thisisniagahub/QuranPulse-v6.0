// Simple Token Bucket Rate Limiter
// In a real serverless env, this would use Redis/KV. 
// For client-side, this limits the *current session* to prevent accidental loops.

interface RateLimitConfig {
  requests: number;
  window: number; // in milliseconds
  message: string;
}

export class RateLimiter {
  private cache = new Map<string, { count: number; resetAt: number }>();

  async checkLimit(
    userId: string, 
    endpoint: string, 
    config: RateLimitConfig
  ): Promise<boolean> {
    const key = `${userId}:${endpoint}`;
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && cached.resetAt > now) {
      if (cached.count >= config.requests) {
        throw new Error(config.message);
      }
      cached.count++;
    } else {
      this.cache.set(key, {
        count: 1,
        resetAt: now + config.window
      });
    }

    return true;
  }
}

export const rateLimiter = new RateLimiter();
