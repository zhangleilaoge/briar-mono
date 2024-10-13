import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

/** 定时任务服务，此 service 不能包含任何请求级别生命周期的依赖 */
@Injectable()
export class ScheduleService {
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  handleCron() {
    console.log('EVERY_DAY_AT_10AM 测试定时任务');
  }
}
