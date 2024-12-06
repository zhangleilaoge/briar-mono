import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { getShortUrl, UrlEnum } from 'briar-shared';

import { Public } from '@/decorators/Public';
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

    this.userLogService.log('短链跳转：' + longUrl);

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
  async getShortUrlList(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('url') url: string = '',
  ) {
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
