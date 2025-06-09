import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbilityEnum, CycleEnum, IAbilityUsageRule } from 'briar-shared';
import { startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { Op } from 'sequelize';

import {
  AbilityUsageLimitModel,
  AbilityUsageRecordModel,
} from '@/model/UserAbilityModel';

@Injectable()
export class UserAbilityDalService {
  constructor(
    @InjectModel(AbilityUsageLimitModel)
    private readonly abilityUsageLimitModel: typeof AbilityUsageLimitModel,
    @InjectModel(AbilityUsageRecordModel)
    private readonly abilityUsageRecordModel: typeof AbilityUsageRecordModel,
  ) {}

  async create(
    rules: Partial<Record<AbilityEnum, Array<IAbilityUsageRule>>>,
    userId: number,
  ) {
    Object.keys(rules).forEach(async (key) => {
      await this.abilityUsageLimitModel.create({
        userId,
        ability: +key as AbilityEnum,
        rules: rules[key],
      });
    });

    return;
  }

  async findRules(ability: AbilityEnum, userId: number) {
    const abilityLimit = await this.abilityUsageLimitModel.findOne({
      where: { userId, ability },
    });
    const rules = abilityLimit?.dataValues?.rules || [];
    return rules;
  }

  async createAbilityRecord(ability: AbilityEnum, userId: number) {
    await this.abilityUsageRecordModel.create({
      userId,
      ability,
    });
  }

  async findAbilityRecords(
    {
      ability,
      relativeDuration,
      cycleDuration,
      durationType,
    }: {
      ability: AbilityEnum;
      relativeDuration?: number;
      cycleDuration?: CycleEnum;
      durationType?: 'relative' | 'cycle';
    },
    userId: number,
  ) {
    let records = [];

    // 相对时间范围内的能力使用记录
    if (relativeDuration && durationType === 'relative') {
      records = await this.abilityUsageRecordModel.findAll({
        where: {
          userId,
          ability,
          createdAt: {
            [Op.gte]: new Date(new Date().getTime() - relativeDuration * 1000),
          },
        },
      });
      // 周期时间范围内的能力使用记录
    } else if (cycleDuration && durationType === 'cycle') {
      let start = new Date(0);
      switch (cycleDuration) {
        case CycleEnum.day:
          start = startOfDay(new Date());
          break;
        case CycleEnum.week:
          start = startOfWeek(new Date());
          break;
        case CycleEnum.month:
          start = startOfMonth(new Date());
          break;
        case CycleEnum.year:
          start = startOfYear(new Date());
          break;
        default:
          break;
      }

      records = await this.abilityUsageRecordModel.findAll({
        where: {
          userId,
          ability,
          createdAt: {
            [Op.gte]: start,
          },
        },
      });
    }

    return records;
  }
}
