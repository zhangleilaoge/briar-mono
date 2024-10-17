import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ILogDTO, LogTypeEnum, PureModel } from 'briar-shared';

import { LogModel } from './../../model/LogModel';

@Injectable()
export class LogDalService {
  constructor(
    @InjectModel(LogModel)
    private readonly logModel: typeof LogModel,
  ) {}

  async create({
    content,
    type = LogTypeEnum.Info,
    userId,
    ip,
  }: PureModel<ILogDTO>): Promise<LogModel> {
    return (await this.logModel.create({ content, type, userId, ip }))
      .dataValues;
  }
}
