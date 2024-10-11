import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as fs from 'fs';
import { join } from 'path';
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
    // 当 url 为前端的路由时，显然匹配不到静态资源。这种情况手动转发
    consumer
      .apply((req, res, next) => {
        const url = req.originalUrl;

        const firstLevelPath = url.split('/')?.[1];
        if (
          !url.startsWith('/api') &&
          !url.startsWith('/static') &&
          firstLevelPath
        ) {
          fs.createReadStream(
            join(
              __dirname,
              `../../../../briar-frontend/dist/${firstLevelPath}/index.html`,
            ),
          ).pipe(res);
        } else {
          next();
        }
      })
      .forRoutes('*');
  }
}
