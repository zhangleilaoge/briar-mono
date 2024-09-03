import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AiModule } from './Ai';
import { TemplateModule } from './tempalte';
import { LogMiddleware } from 'src/middleware/log';

@Module({
  imports: [AiModule, TemplateModule],
})
export class MainModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
