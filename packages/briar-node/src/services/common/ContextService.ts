import { Injectable, Scope } from '@nestjs/common';

interface IContext {
  userId?: number;
  ip?: string;
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
