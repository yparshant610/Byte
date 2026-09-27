export interface TokenBucketOptions {
  capacity: number;       // Maximum tokens in bucket (e.g., 5 OTP requests)
  refillRatePerSec: number; // Tokens added per second (e.g., 1 token every 60s -> 1/60)
}

export interface BucketState {
  tokens: number;
  lastRefillTimestamp: number;
}

export class TokenBucket {
  private state: BucketState;
  private readonly capacity: number;
  private readonly refillRatePerSec: number;

  constructor(options: TokenBucketOptions, initialState?: BucketState) {
    this.capacity = options.capacity;
    this.refillRatePerSec = options.refillRatePerSec;
    this.state = initialState || {
      tokens: options.capacity,
      lastRefillTimestamp: Date.now(),
    };
  }

  getState(): BucketState {
    this.refill();
    return { ...this.state };
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.state.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRatePerSec;

    this.state.tokens = Math.min(this.capacity, this.state.tokens + tokensToAdd);
    this.state.lastRefillTimestamp = now;
  }

  tryConsume(tokens = 1): { allowed: boolean; remainingTokens: number; retryAfterSeconds?: number } {
    this.refill();

    if (this.state.tokens >= tokens) {
      this.state.tokens -= tokens;
      return {
        allowed: true,
        remainingTokens: Math.floor(this.state.tokens),
      };
    }

    const deficit = tokens - this.state.tokens;
    const retryAfterSeconds = Math.ceil(deficit / this.refillRatePerSec);

    return {
      allowed: false,
      remainingTokens: Math.floor(this.state.tokens),
      retryAfterSeconds,
    };
  }
}
