import 'dotenv/config';

import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthGuard } from '@/guards/auth';

import { LogInterceptor } from '../interceptor/log';
import { AiModule } from './AiModule';
import { BlogModule } from './BlogModule';
import { CommonModule } from './common/CommonModule';
import { MaterialModule } from './MaterialModule';
import { ShortUrlModule } from './ShortUrlModule';
import { UserModule } from './UserModule';
import { VerifyModule } from './VerifyModule';
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
    MaterialModule,
    VerifyModule,
    BlogModule,
    /** 不要改变 ShortUrlModule 最末位的顺序 */
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
