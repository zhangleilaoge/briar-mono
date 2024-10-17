import 'dotenv/config';

import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthGuard } from '@/guards/auth';

import { LogInterceptor } from '../interceptor/log';
import { AiModule } from './AiModule';
import { CommonModule } from './common/CommonModule';
import { ShortUrlModule } from './ShortUrlModule';
import { UserModule } from './UserModule';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.BRIAR_JWT_SECRET,
      signOptions: { expiresIn: '30 days' },
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AiModule,
    UserModule,
    ShortUrlModule,
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
export class MainModule {}
