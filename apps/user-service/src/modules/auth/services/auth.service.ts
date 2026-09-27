import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisClientWrapper, RedisRateLimiter } from '@repo/redis-cache';
import { REDIS_CLIENT_WRAPPER, REDIS_RATE_LIMITER } from '../../redis/redis-provider.module';
import {
  AuthPayload,
  LoginInput,
  OtpResponse,
  RequestOtpInput,
  VerifyOtpSignupInput,
} from '../models/auth.models';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AuthService {
  // In-memory OTP storage fallback
  private readonly pendingOtps = new Map<string, { otp: string; expiresAt: number }>();
  // In-memory user cache
  private readonly users = new Map<string, any>();

  constructor(
    @Inject(REDIS_RATE_LIMITER)
    private readonly rateLimiter: RedisRateLimiter,
    @Inject(REDIS_CLIENT_WRAPPER)
    private readonly redisWrapper: RedisClientWrapper,
    private readonly mailService: MailService,
  ) {
    // Seed default test consumer
    this.users.set('consumer@foodbytes.app', {
      id: '10000000-0000-0000-0000-000000000001',
      email: 'consumer@foodbytes.app',
      password: 'SecurePassword123!',
      fullName: 'Alex Johnson',
      role: 'CONSUMER',
    });
  }

  async requestOtp(input: RequestOtpInput): Promise<OtpResponse> {
    // 1. Enforce Token Bucket rate limiting in Docker Redis (max 5 requests per bucket, 1 refill/min)
    await this.rateLimiter.enforce(`otp:${input.email}`, {
      capacity: 5,
      refillRatePerSec: 1 / 60,
    });

    // 2. Generate 6-digit OTP (deterministic 123456 for tests, randomized for live)
    const otp = process.env.NODE_ENV === 'test' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in Docker Redis with 300s (5-min) sliding TTL
    try {
      const client = this.redisWrapper.getClient();
      await client.set(`otp:${input.email}`, otp, 'EX', 300);
    } catch (e) {
      console.warn('Redis OTP caching fallback to memory:', e);
    }

    this.pendingOtps.set(input.email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // 4. Dispatch live OTP email via Nodemailer Gmail SMTP
    await this.mailService.sendOtpEmail(input.email, otp);

    return {
      success: true,
      message: `Verification OTP dispatched to ${input.email}. Valid for 5 minutes.`,
    };
  }

  async verifyOtpAndSignup(input: VerifyOtpSignupInput): Promise<AuthPayload> {
    // 1. Verify OTP from Docker Redis first, then in-memory fallback
    let storedOtp: string | null = null;
    try {
      const client = this.redisWrapper.getClient();
      storedOtp = await client.get(`otp:${input.email}`);
    } catch (e) {
      console.warn('Redis read error:', e);
    }

    if (!storedOtp) {
      const memRecord = this.pendingOtps.get(input.email);
      if (memRecord && Date.now() <= memRecord.expiresAt) {
        storedOtp = memRecord.otp;
      }
    }

    if (!storedOtp || storedOtp !== input.otp) {
      throw new UnauthorizedException('Invalid or expired verification OTP.');
    }

    // 2. Remove used OTP from Redis and memory
    try {
      const client = this.redisWrapper.getClient();
      await client.del(`otp:${input.email}`);
    } catch {}
    this.pendingOtps.delete(input.email);

    // 3. Persist user into Supabase and local cache
    const user = {
      id: `u_${Date.now()}`,
      email: input.email,
      password: input.password,
      fullName: input.fullName || 'Food Bytes Consumer',
      role: 'CONSUMER',
    };
    this.users.set(input.email, user);

    const supabaseUrl = process.env.SUPABASE_URL || 'https://yrifetqxupbzrqpbivlg.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/users`, {
          method: 'POST',
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=representation',
          },
          body: JSON.stringify([
            {
              email: input.email,
              password_hash: input.password,
              full_name: input.fullName || 'Food Bytes Consumer',
              role: 'CONSUMER',
              is_active: true,
              is_verified: true,
            },
          ]),
        });
      } catch (err) {
        console.warn('Supabase user sync error:', err);
      }
    }

    return {
      accessToken: `jwt_token_${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    // Enforce Token Bucket on login attempts to prevent brute force
    await this.rateLimiter.enforce(`login:${input.email}`, {
      capacity: 10,
      refillRatePerSec: 1 / 30,
    });

    let user = this.users.get(input.email);

    // Lookup user in live Supabase if not in memory
    if (!user && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const res = await fetch(
          `${process.env.SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(input.email)}&select=*`,
          {
            headers: {
              apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
          },
        );
        if (res.ok) {
          const records = await res.json();
          if (records.length > 0) {
            user = {
              id: records[0].id,
              email: records[0].email,
              password: records[0].password_hash,
              fullName: records[0].full_name,
              role: records[0].role,
            };
            this.users.set(input.email, user);
          }
        }
      } catch (err) {
        console.warn('Supabase login lookup error:', err);
      }
    }

    if (!user || user.password !== input.password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      accessToken: `jwt_token_${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
