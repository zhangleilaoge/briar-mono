import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IVerifyCodeDTO, VerifyScene } from 'briar-shared';
import { Op } from 'sequelize';
import sequelize from 'sequelize';

import { VerifyCodeModel } from '@/model/VerifyModel';

@Injectable()
export class VerifyDalService {
  constructor(
    @InjectModel(VerifyCodeModel)
    private readonly verifyCodeModel: typeof VerifyCodeModel,
  ) {}

  async createVerifyCode({
    creator,
    validDuration,
    code,
    scene,
    consumer,
  }: Omit<IVerifyCodeDTO, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.verifyCodeModel.create({
      creator,
      validDuration,
      code,
      scene,
      consumer,
    });
  }

  async checkVerifyCode({
    creator,
    code,
    scene,
    consumer,
  }: {
    creator: number;
    code: string;
    scene: VerifyScene;
    consumer: number;
  }) {
    // 查询数据库中符合条件的记录
    const verifyCode = (
      await this.verifyCodeModel.findOne({
        where: {
          creator,
          code,
          scene,
          consumer,
        },
      })
    )?.dataValues;

    if (verifyCode) {
      const currentTime = new Date();
      const createdAt = verifyCode.createdAt;
      const validDuration = verifyCode.validDuration; // 从数据库中获取 validDuration

      const isExpired =
        new Date(createdAt.getTime() + validDuration) < currentTime;

      return !isExpired;
    }

    return false;
  }

  async clearExpiredVerifyCode() {
    await this.verifyCodeModel.destroy({
      where: {
        [Op.and]: [
          sequelize.literal(
            `TIMESTAMPDIFF(SECOND, createdAt, NOW()) > (validDuration / 1000)`,
          ),
        ],
      },
    });
  }
}
