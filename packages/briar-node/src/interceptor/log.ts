import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContextService } from '@/services/common/ContextService';

const ssePaths = ['/api/ai/chatRequestStream'];

@Injectable({ scope: Scope.REQUEST })
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly contextService: ContextService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const start = Date.now();
    const method = request.method;
    const originalUrl = request.originalUrl;
    const isSSERequest = ssePaths.some((path) => originalUrl.includes(path));
    let sseFirst = true;

    return next.handle().pipe(
      map((data) => {
        const duration = Date.now() - start;

        // sse 请求只打印一次，避免刷屏
        if (!isSSERequest || sseFirst) {
          sseFirst = false;

          let logMessage = `${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} 【method: ${method}】【url: ${originalUrl}】【statusCode: ${response.statusCode}】【duration: ${duration}ms】【userId: ${this.contextService.get().userId}】`;

          if (method === 'GET' && Object.keys(request.query).length > 0) {
            logMessage += `【query: ${JSON.stringify(request.query)}】`;
          } else if (method === 'POST') {
            let body = JSON.stringify(request.body);
            if (body.length > 500) {
              body =
                body.slice(0, 500) +
                `...(省略超出的 ${body.length - 500} 字符)`;
            }
            logMessage += `【body: ${body}】`;
          }

          console.log(logMessage);
        }

        return data;
      }),
    );
  }
}
