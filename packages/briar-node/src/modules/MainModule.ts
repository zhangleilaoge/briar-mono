import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AiModule } from './AiModule';
import { UserModule } from './UserModule';
import { TemplateModule } from './templateModule';
import { LogMiddleware } from '@/middleware/log';

@Module({
  imports: [AiModule, UserModule, TemplateModule],
})
export class MainModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
