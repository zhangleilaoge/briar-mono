import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { RateLimiterGuardService } from '@/services/guard/RateLimiterGuardService';
import { RATE_LIMITED_KEY } from '@/decorators/RateLimit';

// 需搭配 RateLimited 装饰器使用
@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(
    private readonly rateLimiterGuardService: RateLimiterGuardService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    // 获取路由元数据
    const handler = context.getHandler();
    const rateLimitConfig = Reflect.getMetadata(RATE_LIMITED_KEY, handler);

    if (!rateLimitConfig) {
      return true; // 如果没有提供限流配置，则不应用限流
    }

    const limiter = this.rateLimiterGuardService.getLimiter(rateLimitConfig);

    try {
      await limiter.consume(ip);
      return true; // 允许请求
    } catch {
      throw new ForbiddenException('Too Many Requests'); // 超过限制
    }
  }
}
