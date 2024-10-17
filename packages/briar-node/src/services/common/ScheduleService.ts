import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { difference } from 'lodash';

import { generateRandomStr } from '@/utils/hash';

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
    // 生成 100 个随机字符
    const randomStrs = new Array(100).fill(0).map(() => generateRandomStr(6));
    const repeatCodes =
      await this.shortUrlDalService.findRepeatCodes(randomStrs);

    // 过滤掉数据库中重复的随机字符串，然后批量插入
    const newRandomStrs = difference(randomStrs, repeatCodes);
    await this.shortUrlDalService.batchCreate(newRandomStrs);
  }
}
