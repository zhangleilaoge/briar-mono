import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { safeJSON } from 'openai/core';

export const QueryToObject = createParamDecorator(
  (data = 'query', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const queryParam = request.query[data as string] || '{}';

    // 解析查询参数为对象
    return safeJSON(queryParam);
  },
);
