import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AiModule } from './AiModule';
import { UserModule } from './UserModule';
import { TemplateModule } from './templateModule';
import { LogMiddleware } from '@/middleware/log';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import 'dotenv/config';
import { AuthGuard } from '@/guards/auth';
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
