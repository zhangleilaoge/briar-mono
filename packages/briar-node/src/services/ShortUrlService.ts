import { Injectable } from '@nestjs/common';
import { IPageInfo } from 'briar-shared';

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
    let uniqueCode = await this.shortUrlDalService.findOneEmptyCode();

    if (!uniqueCode) {
      await this.shortUrlDalService.createEmptyShortCode();
      uniqueCode = await this.shortUrlDalService.findOneEmptyCode();
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

  async getShortUrlList(pagination: IPageInfo, url: string) {
    return this.shortUrlDalService.getList(
      pagination,
      this.contextService.get().userId,
      url,
    );
  }
}
