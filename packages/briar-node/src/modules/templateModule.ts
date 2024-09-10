import { Module } from '@nestjs/common';
import { AppController } from '../controllers/TemplateController';
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
export class TemplateModule {}
