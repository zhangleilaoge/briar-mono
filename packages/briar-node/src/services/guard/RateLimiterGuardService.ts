import { Injectable } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

export interface RateLimitConfig {
  points: number; // 限制的请求次数
  duration: number; // 持续时间（秒）
  key: string;
}

@Injectable()
export class RateLimiterGuardService {
  private limiters: { [key: string]: RateLimiterMemory } = {};

  getLimiter(config: RateLimitConfig): RateLimiterMemory {
    const key = `${config.points}-${config.duration}-${config.key}`;
    if (!this.limiters[key]) {
      this.limiters[key] = new RateLimiterMemory(config);
    }
    return this.limiters[key];
  }
}
