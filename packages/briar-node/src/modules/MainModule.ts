import 'dotenv/config';

import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthGuard } from '@/guards/auth';

// import { LogMiddleware } from '@/middleware/log';
import { LogInterceptor } from '../interceptor/log';
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
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
})
export class MainModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LogMiddleware).forRoutes('*');
  // }
}
