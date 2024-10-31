import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { StaticProxyMiddleware } from '@/middleware/static-proxy';
// import { ContextService } from '@/services/common/ContextService';
// import { UserAbilityDalService } from '@/services/dal/UserAbilityDalService';
// import { UserDalService } from '@/services/dal/UserDalService';
// import { UserAbilityService } from '@/services/UserAbilityService';
// import { UserService } from '@/services/UserService';

// import { DatabaseModule } from './DataBaseModule';
@Module({
  imports: [
    // DatabaseModule,
    // 转发所有的静态资源
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../briar-frontend/dist'),
      renderPath: '',
      exclude: ['/api/*'],
    }),
  ],
  controllers: [],
  providers: [
    // UserService,
    // UserDalService,
    // ContextService,
    // UserAbilityService,
    // UserAbilityDalService,
  ],
})
export class TemplateModule {
  configure(consumer: MiddlewareConsumer) {
    // 当 url 为前端的路由时，显然匹配不到静态资源。这种情况手动转发

    // consumer.apply(StaticProxyMiddleware).forRoutes('*');
    consumer
      // .apply((req, res, next) => {
      //   const url = req.originalUrl;

      //   const firstLevelPath = url.split('/')?.[1];
      //   if (
      //     !url.startsWith('/api') &&
      //     !url.startsWith('/static') &&
      //     firstLevelPath
      //   ) {
      //     const filePath = join(
      //       __dirname,
      //       `../../../../briar-frontend/dist/${firstLevelPath}/index.html`,
      //     );

      //     // 检查文件是否存在
      //     if (fs.existsSync(filePath)) {
      //       fs.createReadStream(filePath).pipe(res);
      //     } else {
      //       next();
      //     }
      //   } else {
      //     next();
      //   }
      // })
      .apply(StaticProxyMiddleware)
      .forRoutes('*');
  }
}
