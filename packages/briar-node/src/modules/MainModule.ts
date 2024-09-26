import 'dotenv/config';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthGuard } from '@/guards/auth';
import { LogMiddleware } from '@/middleware/log';

import { AiModule } from './AiModule';
import { CommonModule } from './common/CommonModule';
import { TemplateModule } from './common/templateModule';
import { UserModule } from './UserModule';
@Module({
  imports: [
    AiModule,
    UserModule,
    TemplateModule,
    JwtModule.register({
      global: true,
      secret: process.env.BRIAR_JWT_SECRET,
      signOptions: { expiresIn: '30 days' },
    }),
    ScheduleModule.forRoot(),
    CommonModule, // 添加这里
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class MainModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
