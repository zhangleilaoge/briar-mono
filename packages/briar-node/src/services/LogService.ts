import { Injectable, LoggerService } from '@nestjs/common';
import { LogTypeEnum } from 'briar-shared';

import { ContextService } from './common/ContextService';
import { LogDalService } from './dal/LogDalService';

@Injectable()
export class LogService implements LoggerService {
  constructor(
    private readonly logDalService: LogDalService,
    private contextService: ContextService,
  ) {}

  async log(content = '') {
    const userId = this.contextService.get().userId;
    const type = LogTypeEnum.Info;

    console.log(`${type}(userId=${userId}): ${content}`);

    await this.logDalService.create({ content, type, userId });
  }

  async error(error, content = '') {
    const userId = this.contextService.get().userId;
    const type = LogTypeEnum.Error;

    console.log(
      `${type}(userId=${userId}): ${content} ${(error as any)?.message || JSON.stringify(error)}`,
    );
    await this.logDalService.create({ content, type, userId });
  }

  async warn(content = '') {
    const type = LogTypeEnum.Warning;
    const userId = this.contextService.get().userId;

    console.log(`${type}(userId=${userId}): ${content}`);

    await this.logDalService.create({ content, type, userId });
  }
}
