import { Body, Controller, Post } from '@nestjs/common';

import { WxService } from '@/services/WxService';

@Controller('api/wx')
export class WxController {
  constructor(private readonly wxService: WxService) {}

  @Post('/getMiniprogramCode')
  async getMiniprogramCode() {
    return await this.wxService.getMiniprogramCode();
  }

  @Post('/getMiniprogramCodeStatus')
  async getMiniprogramCodeStatus(@Body('url') imgCode: string) {
    return await this.wxService.getMiniprogramCodeStatus(imgCode);
  }
}
