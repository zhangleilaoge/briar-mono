import { Injectable } from '@nestjs/common';

interface IContext {
  userId?: number;
}

@Injectable()
export class ContextService {
  private context: IContext = {};

  setValue(key: string, value: any) {
    this.context[key] = value;
  }

  get() {
    return this.context;
  }
}
