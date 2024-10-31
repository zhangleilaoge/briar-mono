import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { StaticProxyMiddleware } from '@/middleware/static-proxy';

@Module({
  imports: [
    // 转发所有的静态资源
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../briar-frontend/dist'),
      renderPath: '',
      exclude: ['/api/*'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class TemplateModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StaticProxyMiddleware).forRoutes('*');
  }
}
