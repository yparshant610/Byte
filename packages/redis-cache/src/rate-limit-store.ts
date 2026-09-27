import { RateLimitExceededException, TokenBucket, TokenBucketOptions } from '@repo/shared-utils';
import { REDIS_KEYS } from './redis.constants';
import { RedisClientWrapper } from './redis.client';

export class RedisRateLimiter {
  constructor(private readonly redisWrapper: RedisClientWrapper) {}

  async enforce(
    identifier: string,
    options: TokenBucketOptions = { capacity: 5, refillRatePerSec: 1 / 60 },
  ): Promise<void> {
    const client = this.redisWrapper.getClient();
    const key = `${REDIS_KEYS.RATE_LIMIT_PREFIX}${identifier}`;

    const raw = await client.get(key);
    let initialState: any = undefined;

    if (raw) {
      try {
        initialState = JSON.parse(raw);
      } catch {
        // ignore
      }
    }

    const bucket = new TokenBucket(options, initialState);
    const result = bucket.tryConsume(1);

    // Save updated bucket state in Redis with 10-minute sliding TTL
    await client.set(key, JSON.stringify(bucket.getState()), 'EX', 600);

    if (!result.allowed) {
      throw new RateLimitExceededException(result.retryAfterSeconds || 60);
    }
  }
}
