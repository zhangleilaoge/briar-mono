import { Injectable, LoggerService } from '@nestjs/common';
import { LogFromEnum, LogTypeEnum } from 'briar-shared';

import { ContextService } from './common/ContextService';
import { LogDalService } from './dal/LogDalService';

/** @description 用户访问日志，依赖 ContextService */
@Injectable()
export class UserLogService implements LoggerService {
  constructor(
    private readonly logDalService: LogDalService,
    private contextService: ContextService,
  ) {}

  async log(content = '') {
    const { userId, ip } = this.contextService.get();
    const type = LogTypeEnum.Info;

    console.log(`${type}(userId=${userId}): ${content}`);

    await this.logDalService.create(
      { content, type, userId, ip },
      LogFromEnum.User,
    );
  }

  async error(error, content = '') {
    const { userId, ip } = this.contextService.get();
    const type = LogTypeEnum.Error;

    console.log(
      `${type}(userId=${userId}): ${content} ${(error as any)?.message || JSON.stringify(error)}`,
    );
    await this.logDalService.create(
      { content, type, userId, ip },
      LogFromEnum.User,
    );
  }

  async warn(content = '') {
    const type = LogTypeEnum.Warning;
    const { userId, ip } = this.contextService.get();

    console.log(`${type}(userId=${userId}): ${content}`);

    await this.logDalService.create(
      { content, type, userId, ip },
      LogFromEnum.User,
    );
  }
}

/** @description 系统日志 */
@Injectable()
export class SystemLogService implements LoggerService {
  constructor(private readonly logDalService: LogDalService) {}

  async log(content = '') {
    const type = LogTypeEnum.Info;

    console.log(`${type}: ${content}`);

    await this.logDalService.create({ content, type }, LogFromEnum.System);
  }

  async error(error, content = '') {
    const type = LogTypeEnum.Error;

    console.log(
      `${type}: ${content} ${(error as any)?.message || JSON.stringify(error)}`,
    );
    await this.logDalService.create({ content, type }, LogFromEnum.System);
  }

  async warn(content = '') {
    const type = LogTypeEnum.Warning;

    console.log(`${type}: ${content}`);

    await this.logDalService.create({ content, type }, LogFromEnum.System);
  }
}
