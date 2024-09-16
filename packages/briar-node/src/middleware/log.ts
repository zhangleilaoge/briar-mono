import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply['raw'], next: () => void) {
    const start = Date.now();

    const log = () => {
      const { method, originalUrl, query, body } = req;
      const duration = Date.now() - start;
      let logMessage = `[${method}] ${originalUrl} - ${res.statusCode} - ${duration}ms`;
      if (method === 'GET' && Object.keys(query).length > 0) {
        logMessage += ` - Query: ${JSON.stringify(query)}`;
      }

      // 如果请求是 POST，打印请求体
      if (method === 'POST') {
        logMessage += ` - Body: ${JSON.stringify(body)}`;
      }
      console.log(logMessage);
    };

    res.on('finish', () => {
      log();
    });

    res.on('error', (err) => {
      log();
      console.error('Response error:', err);
    });

    next();
  }
}
