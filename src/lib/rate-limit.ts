// lib/rate-limit.ts
import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redis = Redis.fromEnv();

export type RateLimitType = 'auth' | 'api' | 'email';

const LIMITS = {
  auth: { points: 5, duration: 60, blockDuration: 300 },     // 5 requests per minute
  api: { points: 100, duration: 60, blockDuration: 0 },      // 100 requests per minute
  email: { points: 2, duration: 300, blockDuration: 1800 },  // 2 emails per 5 minutes
};

export async function rateLimit(
  req: NextRequest,
  type: RateLimitType = 'auth'
) {
  const ip = req.ip || 
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
    'anonymous';
    
  const key = `rate_limit:${type}:${ip}`;

  const limiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: `rl_${type}`,
    points: LIMITS[type].points,
    duration: LIMITS[type].duration,
    blockDuration: LIMITS[type].blockDuration,
  });

  try {
    await limiter.consume(key);
    return { success: true };
  } catch (e) {
    const retryAfter = Math.ceil(e.msBeforeNext / 1000);
    
    return {
      success: false,
      error: `Too many requests. Please try again ${
        retryAfter ? `in ${retryAfter} seconds` : 'later'
      }`,
      retryAfter
    };
  }
}
export async function isIPBlocked(ip: string): Promise<boolean> {
  const blockKey = `blocked:${ip}`;
  return await redis.exists(blockKey) === 1;
}

export async function blockIP(ip: string, duration: number = 24 * 60 * 60) {
  const blockKey = `blocked:${ip}`;
  await redis.set(blockKey, '1', { ex: duration });
}