import { Injectable, NestMiddleware } from '@nestjs/common';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class StaticProxyMiddleware implements NestMiddleware {
  constructor() {}

  async use(req, res, next) {
    const url = req.originalUrl;

    const firstLevelPath = url.split('/')?.[1];
    if (
      !url.startsWith('/api') &&
      !url.startsWith('/static') &&
      firstLevelPath
    ) {
      const filePath = join(
        __dirname,
        `../../../briar-frontend/dist/${firstLevelPath}/index.html`,
      );

      // 检查文件是否存在
      if (fs.existsSync(filePath)) {
        const htmlContent = fs.readFileSync(filePath, 'utf-8');

        // 渲染 EJS 模板
        const data = { htmlContent };

        // 暂时写死，如果有动态模版需求再作调整
        ejs.renderFile('./src/views/briar.ejs', data, {}, (err, str) => {
          if (err) {
            console.error(err);
            next();
          }
          // 手动写入响应并结束
          res.write(str);
          res.end();
        });
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
