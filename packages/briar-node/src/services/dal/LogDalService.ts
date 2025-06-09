import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ILogDTO, LogFromEnum, LogTypeEnum, PureModel } from 'briar-shared';
import sequelize, { Op } from 'sequelize';

import { LogModel } from './../../model/LogModel';

@Injectable()
export class LogDalService {
  constructor(
    @InjectModel(LogModel)
    private readonly logModel: typeof LogModel,
  ) {}

  async create(
    {
      content,
      type = LogTypeEnum.Info,
      userId,
      ip,
      traceId,
      location,
    }: PureModel<ILogDTO>,
    from: LogFromEnum,
  ): Promise<LogModel> {
    return (
      await this.logModel.create({
        content,
        type,
        userId,
        ip,
        from,
        traceId,
        location,
      })
    ).dataValues;
  }

  async clear(days = 30) {
    const maxAge = 60 * 60 * 24 * days;
    // 清理 30 天前的日志
    await this.logModel.destroy({
      where: {
        [Op.and]: [
          sequelize.literal(
            `TIMESTAMPDIFF(SECOND, createdAt, NOW()) > ${maxAge}`,
          ),
        ],
      },
    });
  }
}
