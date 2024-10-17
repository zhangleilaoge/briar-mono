import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { ShortUrlModel } from '@/model/ShortUrlModel';

@Injectable()
export class ShortUrlDalService {
  constructor(
    @InjectModel(ShortUrlModel)
    private readonly shortUrlModel: typeof ShortUrlModel,
  ) {}

  async batchCreate(codes: string[]) {
    return await this.shortUrlModel.bulkCreate(codes.map((code) => ({ code })));
  }

  async findOneEmptyCode() {
    return (
      await this.shortUrlModel.findOne({
        where: {
          url: {
            [Op.eq]: '',
          },
        },
      })
    )?.dataValues?.code;
  }

  async findOneByCode(code: string) {
    return (
      await this.shortUrlModel.findOne({
        where: {
          code: {
            [Op.eq]: code,
          },
        },
      })
    )?.dataValues;
  }

  async updateShortUrl(code: string, url: string, creator: number) {
    console.log(url, creator);
    await this.shortUrlModel.update(
      {
        url,
        creator,
      },
      {
        where: {
          code,
        },
      },
    );
  }

  async findRepeatCodes(codes: string[]) {
    const repeatCodes = (
      await this.shortUrlModel.findAll({
        where: {
          code: {
            [Op.in]: codes,
          },
        },
      })
    ).map((item) => item.dataValues.code);

    return repeatCodes;
  }
}
