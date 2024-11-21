import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IMaterial, IPageInfo, IUploadBase64Response } from 'briar-shared';
import * as qs from 'qs';

import { ContextService } from '@/services/common/ContextService';
import { CosService } from '@/services/CosService';
import { MaterialService } from '@/services/materialService';

@Controller('api/material')
export class MaterialController {
  constructor(
    private readonly cosService: CosService,
    private readonly contextService: ContextService,
    private readonly materialService: MaterialService,
  ) {}

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

  @Post('/createImgMaterial')
  async createImgMaterial(
    @Body('files') files: Pick<IMaterial, 'name' | 'thumbUrl'>[],
  ) {
    if (files.length === 0)
      return {
        success: true,
      };

    await this.materialService.createImgMaterial(
      files.map((file) => ({
        ...file,
        userId: this.contextService.get().userId,
      })),
    );
    return {
      success: true,
    };
  }

  @Post('/deleteImgMaterials')
  async deleteImgMaterials(@Body('list') list: { id: number; name: string }[]) {
    await this.materialService.deleteImgMaterials(
      list,
      this.contextService.get().userId,
    );
    return {
      success: true,
    };
  }

  @Get('/getImgMaterials')
  async getImgMaterials(@Query() params: { pagination: IPageInfo }) {
    const { pagination } = qs.parse(params);
    return await this.materialService.getImgMaterials(
      pagination,
      this.contextService.get().userId,
    );
  }
}
