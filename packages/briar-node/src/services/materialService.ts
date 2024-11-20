import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { IMaterial, IPageInfo } from 'briar-shared';

import { MaterialDalService } from './dal/materialDalService';

@Injectable()
export class MaterialService {
  constructor(private readonly materialDalService: MaterialDalService) {}

  async createImgMaterial(
    files: Pick<IMaterial, 'name' | 'thumbUrl' | 'userId'>[],
  ) {
    return this.materialDalService.createImgMaterial(files);
  }

  async getImgMaterials(pagination: IPageInfo, userId: number) {
    return this.materialDalService.getImgMaterials(pagination, userId);
  }
}
