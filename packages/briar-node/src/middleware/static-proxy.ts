import { Injectable, NestMiddleware } from '@nestjs/common';
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
        fs.createReadStream(filePath).pipe(res);
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
