import { RateLimitConfig } from '@/services/guard/RateLimiterGuardService';
import { SetMetadata } from '@nestjs/common';

export const RATE_LIMITED_KEY = 'rate_limited';
export const RateLimited = (config: RateLimitConfig) =>
  SetMetadata(RATE_LIMITED_KEY, config);
