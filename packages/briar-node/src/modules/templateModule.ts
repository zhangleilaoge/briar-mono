import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from '../controllers/TemplateController';
import { LogMiddleware } from '../middleware/log';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../briar-frontend/dist'),
      serveRoot: '',
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class TemplateModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
