import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IPageInfo } from 'briar-shared';
import { difference } from 'lodash';
import { Op } from 'sequelize';

import { ShortUrlModel } from '@/model/ShortUrlModel';
import { generateRandomStr } from '@/utils/hash';

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

  async getList(pagination: IPageInfo, userId: number, url: string) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;

    const { count, rows } = await this.shortUrlModel.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['createdAt', 'DESC']], // 以创建时间降序排列
      where: {
        creator: userId,
        url: {
          [Op.like]: `%${url}%`, // 确保 URL 包含传入的 url
        },
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

  // 这个方法聚合了逻辑，其实不应该出现在 dal，但是上层逻辑因为生命周期原因不能复用
  async createEmptyShortCode() {
    // 生成 100 个随机字符
    const randomStrs = new Array(100).fill(0).map(() => generateRandomStr(6));
    const repeatCodes = await this.findRepeatCodes(randomStrs);

    // 过滤掉数据库中重复的随机字符串，然后批量插入
    const newRandomStrs = difference(randomStrs, repeatCodes);
    await this.batchCreate(newRandomStrs);
  }
}
