import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // ServeStaticModule.forRoot(
    //   {
    //     rootPath: join(__dirname, '../../../../briar-frontend/dist'),
    //     renderPath: '/briar',
    //     exclude: ['/api*'],
    //   },
    //   {
    //     rootPath: join(__dirname, '../../../../briar-frontend/dist/static'),
    //     renderPath: '/static',
    //     exclude: ['/api*'],
    //   },
    // ),
    // ServeStaticModule.forRoot(
    //   // {
    //   //   rootPath: join(__dirname, '../../../../briar-frontend/dist/briar'),
    //   //   renderPath: '/briar',
    //   //   exclude: ['/api*'],
    //   // },
    //   {
    //     rootPath: join(__dirname, '../../../../briar-frontend/dist/static'),
    //     renderPath: '/static',
    //     exclude: ['/api*'],
    //     serveRoot: '/static',
    //   },
    // ),
  ],
  controllers: [],
  providers: [],
})
export class TemplateModule {}
