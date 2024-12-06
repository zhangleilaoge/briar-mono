import { MiddlewareConsumer, Module } from '@nestjs/common';

import { StaticProxyMiddleware } from '@/middleware/static-proxy';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class TemplateModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StaticProxyMiddleware).forRoutes('*');
  }
}
