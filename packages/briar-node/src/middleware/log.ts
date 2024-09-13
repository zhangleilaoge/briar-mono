import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, query, body } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      let logMessage = `[${method}] ${url} - ${res.statusCode} - ${duration}ms`;
      if (method === 'GET' && Object.keys(query).length > 0) {
        logMessage += ` - Query: ${JSON.stringify(query)}`;
      }

      // 如果请求是 POST，打印请求体
      if (method === 'POST') {
        logMessage += ` - Body: ${body}`;
      }
      console.log(logMessage);
    });

    next();
  }
}
