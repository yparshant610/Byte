import { Global, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  RedisCartStore,
  RedisClientWrapper,
  RedisGeoStore,
  RedisRateLimiter,
} from '@repo/redis-cache';

export const REDIS_CLIENT_WRAPPER = 'REDIS_CLIENT_WRAPPER';
export const REDIS_CART_STORE = 'REDIS_CART_STORE';
export const REDIS_GEO_STORE = 'REDIS_GEO_STORE';
export const REDIS_RATE_LIMITER = 'REDIS_RATE_LIMITER';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT_WRAPPER,
      useFactory: async () => {
        const wrapper = new RedisClientWrapper({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : undefined,
          password: process.env.REDIS_PASSWORD,
          useMock: process.env.REDIS_USE_MOCK === 'true',
        });
        await wrapper.connect();
        return wrapper;
      },
    },
    {
      provide: REDIS_CART_STORE,
      useFactory: (wrapper: RedisClientWrapper) => new RedisCartStore(wrapper),
      inject: [REDIS_CLIENT_WRAPPER],
    },
    {
      provide: REDIS_GEO_STORE,
      useFactory: (wrapper: RedisClientWrapper) => new RedisGeoStore(wrapper),
      inject: [REDIS_CLIENT_WRAPPER],
    },
    {
      provide: REDIS_RATE_LIMITER,
      useFactory: (wrapper: RedisClientWrapper) => new RedisRateLimiter(wrapper),
      inject: [REDIS_CLIENT_WRAPPER],
    },
  ],
  exports: [REDIS_CLIENT_WRAPPER, REDIS_CART_STORE, REDIS_GEO_STORE, REDIS_RATE_LIMITER],
})
export class RedisProviderModule implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {}
  async onModuleDestroy() {}
}
