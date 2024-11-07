import { Body, Controller, Post } from '@nestjs/common';
import { IUploadBase64Response } from 'briar-shared';

import { CosService } from '@/services/CosService';

@Controller('api/material')
export class MaterialController {
  constructor(private readonly cosService: CosService) {}

  @Post('/uploadBase64')
  async uploadBase64(
    @Body('filename') filename: string,
    @Body('base64') base64: string,
  ): Promise<IUploadBase64Response> {
    const url = (await this.cosService.uploadBase64ToCos(
      filename,
      base64,
    )) as string;
    return {
      url,
    };
  }
}
