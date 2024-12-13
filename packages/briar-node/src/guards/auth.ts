import 'dotenv/config';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

import { IS_PUBLIC_KEY } from '@/decorators/Public';
import { ContextService } from '@/services/common/ContextService';
@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private contextService: ContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 设置 ip 地址
    this.contextService.setValue(
      'ip',
      request.headers['x-forwarded-for'] || '',
    );

    if (isPublic) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    const traceId = request.headers['x-trace-id'];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.BRIAR_JWT_SECRET,
      });

      // 设置 userId
      this.contextService.setValue('userId', payload.sub);

      // 设置 traceId
      this.contextService.setValue('traceId', traceId);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
