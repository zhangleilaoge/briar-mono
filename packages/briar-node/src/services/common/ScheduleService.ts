import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ShortUrlDalService } from '../dal/ShortUrlDalService';

/** 定时任务服务，此 service 不能包含任何请求级别生命周期的依赖 */
@Injectable()
export class ScheduleService {
  constructor(private readonly shortUrlDalService: ShortUrlDalService) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  handleCron() {
    console.log('EVERY_DAY_AT_10AM 测试定时任务');
  }
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async createEmptyShortCode() {
    await this.shortUrlDalService.createEmptyShortCode();
  }

  // todo 增加页面权限的默认级别，以及根据级别自动刷角色权限的定时任务
}
