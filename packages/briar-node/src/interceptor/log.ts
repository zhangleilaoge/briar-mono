import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { LogModuleEnum } from 'briar-shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContextService } from '@/services/common/ContextService';
import { UserLogService } from '@/services/LogService';

const ssePaths = ['/api/ai/chatRequestStream'];

@Injectable({ scope: Scope.REQUEST })
export class LogInterceptor implements NestInterceptor {
  constructor(
    private readonly contextService: ContextService,
    private readonly userLogService: UserLogService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const start = Date.now();
    const method = request.method;
    const originalUrl = request.originalUrl;
    const isSSERequest = ssePaths.some((path) => originalUrl.includes(path));
    const logObj: any = {
      method,
      url: originalUrl,
      statusCode: response.statusCode,
      userId: this.contextService.get().userId,
    };
    let sseFirst = true;

    if (method === 'GET' && Object.keys(request.query).length > 0) {
      logObj.query = request.query;
    } else if (method === 'POST') {
      let body = JSON.stringify(request.body);
      if (body.length > 500) {
        body = body.slice(0, 500) + `...(省略超出的 ${body.length - 500} 字符)`;
      }
      logObj.body = body;
    }

    // const logMessage = '请求开始: ' + JSON.stringify(logObj);

    // this.userLogService.log({
    //   content: logMessage,
    //   module: LogModuleEnum.RequestMiddleware,
    // });

    return next.handle().pipe(
      map((data) => {
        const duration = Date.now() - start;

        // sse 请求只打印一次，避免刷屏
        if (!isSSERequest || sseFirst) {
          sseFirst = false;

          logObj.duration = duration;
          // logObj.response = JSON.stringify(data);
          // if (logObj.response.length > 500) {
          //   logObj.response =
          //     logObj.response.slice(0, 500) +
          //     `...(省略超出的 ${logObj.response.length - 500} 字符)`;
          // }

          const logMessage = '请求结束: ' + JSON.stringify(logObj);

          this.userLogService.log({
            content: logMessage,
            module: LogModuleEnum.RequestMiddleware,
          });
        }

        return data;
      }),
    );
  }
}
