import { Injectable, LoggerService } from '@nestjs/common';
import { ILogParams, LogFromEnum, LogTypeEnum } from 'briar-shared';
import { format } from 'date-fns/format';

import { ContextService } from './common/ContextService';
import { LogDalService } from './dal/LogDalService';

/** @description 用户访问日志，依赖 ContextService */
@Injectable()
export class UserLogService implements LoggerService {
  constructor(
    private readonly logDalService: LogDalService,
    private contextService: ContextService,
  ) {}

  async log({ content, module, type = LogTypeEnum.Info }: ILogParams) {
    const { userId, ip } = this.contextService.get();
    const textContent = `【${module}${type}】${format(new Date(), '(yyyy-MM-dd HH:mm:ss)')} ${content}`;

    console.log(textContent);

    await this.logDalService.create(
      { content: textContent, type, userId, ip },
      LogFromEnum.User,
    );
  }

  async error(
    error,
    { content, module, type = LogTypeEnum.Error }: ILogParams,
  ) {
    return this.log({
      content: `${content} ${(error as any)?.message || JSON.stringify(error)}`,
      module,
      type,
    });
  }

  async warn({ content, module, type = LogTypeEnum.Warning }: ILogParams) {
    return this.log({ content, module, type });
  }
}

/** @description 系统日志 */
@Injectable()
export class SystemLogService implements LoggerService {
  constructor(private readonly logDalService: LogDalService) {}

  async log({ content, module, type = LogTypeEnum.Info }: ILogParams) {
    const textContent = `【${module}${type}】${format(new Date(), '(yyyy-MM-dd HH:mm:ss)')} ${content}`;

    console.log(textContent);

    await this.logDalService.create(
      { content: textContent, type },
      LogFromEnum.System,
    );
  }

  async error(
    error,
    { content, module, type = LogTypeEnum.Error }: ILogParams,
  ) {
    return this.log({
      content: `${content} ${(error as any)?.message || JSON.stringify(error)}`,
      module,
      type,
    });
  }

  async warn({ content, module, type = LogTypeEnum.Warning }: ILogParams) {
    return this.log({ content, module, type });
  }
}
