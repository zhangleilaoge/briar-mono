import { Injectable, LoggerService } from '@nestjs/common';
import {
  ILogParams,
  LogFromEnum,
  LogModuleEnum,
  LogTypeEnum,
} from 'briar-shared';
import { format } from 'date-fns/format';

import { ContextService } from './common/ContextService';
import { LogDalService } from './dal/LogDalService';
import { IpLocationService } from './IpService';

const getTextContent = (
  mod: LogModuleEnum,
  type: LogTypeEnum,
  content: string,
) => {
  return `【${mod}${type}】${format(new Date(), '(yyyy-MM-dd HH:mm:ss)')} ${content}`;
};

/** @description 用户访问日志，依赖 ContextService */
@Injectable()
export class UserLogService implements LoggerService {
  constructor(
    private readonly logDalService: LogDalService,
    private contextService: ContextService,
    private readonly ipLocationService: IpLocationService,
  ) {}

  async log({ content, module, type = LogTypeEnum.Info }: ILogParams) {
    const { userId, ip, traceId } = this.contextService.get();
    const textContent = getTextContent(module, type, content);
    const location = await this.ipLocationService.getIpLocation(ip);

    console.log(textContent);

    await this.logDalService.create(
      {
        content: textContent,
        type,
        userId,
        ip,
        traceId,
        location,
      },
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
    const textContent = getTextContent(module, type, content);

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
