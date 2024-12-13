import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LogModuleEnum } from 'briar-shared';

import { LogDalService } from '@/services/dal/LogDalService';

import { ShortUrlDalService } from '../dal/ShortUrlDalService';
import { VerifyDalService } from '../dal/VerifyDalService';
import { SystemLogService } from '../LogService';

/** 定时任务服务，此 service 不能包含任何请求级别生命周期的依赖 */
@Injectable()
export class ScheduleService {
  constructor(
    private readonly shortUrlDalService: ShortUrlDalService,
    private readonly verifyDalService: VerifyDalService,
    private readonly logDalService: LogDalService,
    private systemLogService: SystemLogService,
  ) {}

  // 暂不需要定时生成
  // @Cron(CronExpression.EVERY_DAY_AT_4AM)
  // async createEmptyShortCode() {
  //   await this.shortUrlDalService.createEmptyShortCode();
  // }

  /** @description 定时清除过期验证码 */
  @Cron(CronExpression.EVERY_WEEK)
  async clearExpiredVerifyCode() {
    this.systemLogService.log({
      content: '清除过期验证码',
      module: LogModuleEnum.ScheduleTask,
    });
    await this.verifyDalService.clearExpiredVerifyCode();
  }

  /** @description 定时清除历史日志 */
  @Cron(CronExpression.EVERY_WEEK)
  async clearLog() {
    this.systemLogService.log({
      content: '清除历史日志',
      module: LogModuleEnum.ScheduleTask,
    });

    await this.logDalService.clear();
  }
}
