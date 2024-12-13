import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import {
  getShortUrl,
  IGetShortUrlListParams,
  LogModuleEnum,
  UrlEnum,
} from 'briar-shared';

import { Public } from '@/decorators/Public';
import { QueryToObject } from '@/decorators/Query2Obj';
import { UserLogService } from '@/services/LogService';
import { ShortUrlService } from '@/services/ShortUrlService';

@Controller('')
export class ShortUrlController {
  constructor(
    private readonly shortUrlService: ShortUrlService,
    private readonly userLogService: UserLogService,
  ) {}

  @Public()
  @Get('/short/:code')
  @Redirect()
  async shortUrlJump(@Param('code') code) {
    const { url: longUrl } =
      (await this.shortUrlService.getShortUrlByCode(code)) || {};
    if (!longUrl) {
      return {
        url: UrlEnum.NotFound,
        statusCode: 302,
      };
    }

    this.userLogService.log({
      content: '短链跳转：' + longUrl,
      module: LogModuleEnum.ShortUrl,
    });

    return {
      url: longUrl,
      statusCode: 302,
    };
  }

  @Post('/api/shortUrl/createShortUrl')
  async createShortUrl(@Body('url') url: string) {
    const code = await this.shortUrlService.createShortUrl(url.trim());

    return {
      shortUrl: getShortUrl(code),
    };
  }

  @Get('/api/shortUrl/getShortUrlList')
  async getShortUrlList(@QueryToObject() params: IGetShortUrlListParams) {
    const { page, pageSize, url } = params;
    const data = await this.shortUrlService.getShortUrlList(
      {
        page,
        pageSize,
      },
      url.trim(),
    );

    return data;
  }
}
