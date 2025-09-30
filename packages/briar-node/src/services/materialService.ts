import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { IMaterial, IPageInfo } from 'briar-shared';

import { CosService } from './CosService';
import { MaterialDalService } from './dal/materialDalService';

@Injectable()
export class MaterialService {
  constructor(
    private readonly materialDalService: MaterialDalService,

    private readonly cosService: CosService,
  ) {}

  async createImgMaterial(
    files: Pick<IMaterial, 'name' | 'thumbUrl' | 'userId'>[],
  ) {
    return this.materialDalService.createImgMaterial(files);
  }

  async deleteImgMaterials(
    list: { name: string; id: number }[],
    userId: number,
  ) {
    await this.cosService.clearRuntimeImgs(list.map((item) => item.name));
    return this.materialDalService.deleteImgMaterials(list, userId);
  }

  async getImgMaterials({
    pagination,
    userId,
    searchTerm,
  }: {
    pagination: IPageInfo;
    userId: number;
    searchTerm?: string;
  }) {
    return this.materialDalService.getImgMaterials({
      pagination,
      userId,
      searchTerm,
    });
  }
}
