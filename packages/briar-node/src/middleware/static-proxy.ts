import 'dotenv';

import { Injectable, NestMiddleware } from '@nestjs/common';
import axios from 'axios';
import * as ejs from 'ejs';

// 处理页面请求的转发
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
      const filePath = `${process.env.BRIAR_TX_BUCKET_DOMAIN}/static/${firstLevelPath}/index.html `;

      try {
        // 使用 axios 获取远程 HTML 文件内容
        const response = await axios.get(filePath);
        const htmlContent = response.data;

        // 渲染 EJS 模板
        const data = { htmlContent };

        // 渲染并返回响应
        ejs.renderFile('./src/views/briar.ejs', data, {}, (err, str) => {
          if (err) {
            console.error(err);
            return next();
          }
          // 手动写入响应并结束
          res.write(str);
          res.end();
        });
      } catch (error) {
        console.error(`Error fetching remote HTML file: ${error.message}`);
        return next(); // 如果出现错误，继续下一个中间件
      }
    } else {
      next();
    }
  }
}
