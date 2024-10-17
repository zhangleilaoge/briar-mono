import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';

import { UrlEnum } from '@/constants/env';
import { Public } from '@/decorators/Public';
import { ShortUrlService } from '@/services/ShortUrlService';

@Controller('')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Public()
  @Get(':code')
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
    return {
      url: longUrl,
      statusCode: 302,
    };
  }

  @Post('/api/shortUrl/createShortUrl')
  async createShortUrl(@Body('url') url: string) {
    const code = await this.shortUrlService.createShortUrl(url);

    return {
      shortUrl: UrlEnum.Base + code,
    };
  }
}
