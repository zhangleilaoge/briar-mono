import { Injectable, Scope } from '@nestjs/common';
import { RoleEnum } from 'briar-shared';

interface IContext {
  userId?: number;
  ip?: string;
  traceId?: string;
  roles?: RoleEnum[];
}

/** 请求级别的上下文，类似 express 中的 context */
@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  private context: IContext = {};

  setValue(key: string, value: any) {
    this.context[key] = value;
  }

  get() {
    return this.context;
  }
}
