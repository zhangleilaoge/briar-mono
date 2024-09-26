import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextService {
  private context: Record<string, any> = {};

  setValue(key: string, value: any) {
    this.context[key] = value;
  }

  get() {
    return this.context;
  }
}
