import { Body, Controller, Post } from '@nestjs/common';
import { VerifyScene } from 'briar-shared';

import { VerifyService } from '@/services/VerifyService';

@Controller('api/verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @Post('createVerifyCode')
  async createVerifyCode(
    @Body('scene') scene: VerifyScene,
    @Body('email') email: string,
  ) {
    await this.verifyService.createVerifyCode(scene, email);
    return {
      res: true,
    };
  }

  @Post('checkVerifyCode')
  async checkVerifyCode(
    @Body('scene') scene: VerifyScene,
    @Body('code') code: string,
    @Body('email') email: string,
  ) {
    const result = await this.verifyService.checkVerifyCode(scene, code, email);
    return {
      result,
    };
  }
}
