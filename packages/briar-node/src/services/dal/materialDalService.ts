import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IMaterial, IPageInfo } from 'briar-shared';
import { Op } from 'sequelize';

import { MaterialModel } from '@/model/MaterialModel';

@Injectable()
export class MaterialDalService {
  constructor(
    @InjectModel(MaterialModel)
    private readonly materialModel: typeof MaterialModel,
  ) {}

  async createImgMaterial(
    files: Pick<IMaterial, 'name' | 'thumbUrl' | 'userId'>[],
  ) {
    const userId = files[0].userId;
    const thumbUrls = files.map((file) => file.thumbUrl);

    const existingMaterials = await this.materialModel.findAll({
      where: {
        thumbUrl: {
          [Op.in]: thumbUrls,
        },
        userId,
      },
    });

    return await this.materialModel.bulkCreate(
      files.filter((file) => {
        return !existingMaterials.some(
          (existingMaterial) => existingMaterial.thumbUrl === file.thumbUrl,
        );
      }),
    );
  }

  async getImgMaterials(pagination: IPageInfo, userId: number) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;

    const { count, rows } = await this.materialModel.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['createdAt', 'DESC']], // 以创建时间降序排列
      where: {
        userId,
      },
    });

    return {
      items: rows.map((item) => item.dataValues),
      paginator: {
        total: count,
        page,
        pageSize,
      },
    };
  }
}
