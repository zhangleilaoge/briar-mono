import { Injectable } from '@nestjs/common';
import { AbilityEnum, IAbilityUsageRule } from 'briar-shared';

import { getDayCycleRule } from '@/utils/ability';

import { UserAbilityDalService } from './dal/UserAbilityDalService';

const DEFAULT_RULES: Record<AbilityEnum, IAbilityUsageRule[]> = {
  [AbilityEnum.Chat]: [getDayCycleRule(100)],
  [AbilityEnum.CreateImg]: [getDayCycleRule(10)],
};

@Injectable()
export class UserAbilityService {
  constructor(private userAbilityDalService: UserAbilityDalService) {}

  async checkAbilityRules(ability: AbilityEnum) {
    const rules = await this.userAbilityDalService.findRules(ability);

    if (rules.length) {
      for (let i = 0; i < rules.length; i++) {
        const { durationType, relativeDuration, cycleDuration, points } =
          rules[i];

        const abilityRecords =
          await this.userAbilityDalService.findAbilityRecords({
            ability,
            relativeDuration,
            cycleDuration,
            durationType,
          });
        if (abilityRecords.length >= points) return false;
      }
      return true;
    }
    return true;
  }

  async createAbilityRecord(ability: AbilityEnum) {
    await this.userAbilityDalService.createAbilityRecord(ability);
  }

  async initUserAbilityLimit() {
    await this.userAbilityDalService.create(DEFAULT_RULES);

    return;
  }
}
