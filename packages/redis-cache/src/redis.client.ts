import Redis from 'ioredis';
import { InMemoryRedisMock } from './in-memory-redis.mock';

export interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
  useMock?: boolean;
}

export class RedisClientWrapper {
  private client: Redis | InMemoryRedisMock;
  private isFallback = false;

  constructor(private readonly config: RedisConfig = {}) {}

  async connect(): Promise<void> {
    if (this.config.useMock) {
      this.client = new InMemoryRedisMock();
      this.isFallback = true;
      return;
    }

    const host = this.config.host || process.env.REDIS_HOST || '127.0.0.1';
    const port = Number(this.config.port || process.env.REDIS_PORT || 6379);
    const password = this.config.password || process.env.REDIS_PASSWORD;

    try {
      const liveClient = new Redis({
        host,
        port,
        password: password || undefined,
        connectTimeout: 1500,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null,
        lazyConnect: true,
      });

      await liveClient.connect();
      this.client = liveClient;
    } catch {
      this.client = new InMemoryRedisMock();
      this.isFallback = true;
    }
  }

  getClient(): Redis | InMemoryRedisMock {
    if (!this.client) {
      this.client = new InMemoryRedisMock();
      this.isFallback = true;
    }
    return this.client;
  }

  isUsingMock(): boolean {
    return this.isFallback;
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }
}
