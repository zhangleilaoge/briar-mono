import { Injectable } from '@nestjs/common';

import { ContextService } from './common/ContextService';
import { ShortUrlDalService } from './dal/ShortUrlDalService';

/** 定时任务服务，此 service 不能包含任何请求级别生命周期的依赖 */
@Injectable()
export class ShortUrlService {
  constructor(
    private readonly shortUrlDalService: ShortUrlDalService,
    private contextService: ContextService,
  ) {}

  async createShortUrl(url: string) {
    const uniqueCode = await this.shortUrlDalService.findOneEmptyCode();

    if (!uniqueCode) {
      // 个人项目应该没那么大流量，短链用尽的情况暂不考虑
    }

    this.shortUrlDalService.updateShortUrl(
      uniqueCode,
      url,
      this.contextService.get().userId,
    );

    return uniqueCode;
  }

  async getShortUrlByCode(code: string) {
    return this.shortUrlDalService.findOneByCode(code);
  }
}
