import { Controller, Get, Render } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';

@Controller()
export class AppController {
  constructor() {}

  @Get('/*')
  @Render('briar.ejs')
  async renderTemplate() {
    // 读取HTML文件内容
    const htmlFilePath = join(
      __dirname,
      '../../../briar-frontend/dist/index.html',
    );
    const body = await fs.readFile(htmlFilePath, { encoding: 'utf-8' });

    return { body };
  }
}
