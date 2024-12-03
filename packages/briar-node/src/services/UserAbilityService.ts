import { Injectable } from '@nestjs/common';
import { AbilityEnum, IAbilityUsageRule } from 'briar-shared';

import { getDayCycleRule } from '@/utils/ability';

import { ContextService } from './common/ContextService';
import { UserAbilityDalService } from './dal/UserAbilityDalService';

const DEFAULT_RULES: Record<AbilityEnum, IAbilityUsageRule[]> = {
  [AbilityEnum.Chat]: [getDayCycleRule(100)],
  [AbilityEnum.CreateImg]: [getDayCycleRule(10)],
};

@Injectable()
export class UserAbilityService {
  constructor(
    private userAbilityDalService: UserAbilityDalService,
    private contextService: ContextService,
  ) {}

  async checkAbilityRules(ability: AbilityEnum) {
    const userId = this.contextService.get().userId;
    const rules = await this.userAbilityDalService.findRules(ability, userId);

    if (rules.length) {
      for (let i = 0; i < rules.length; i++) {
        const { durationType, relativeDuration, cycleDuration, points } =
          rules[i];

        const abilityRecords =
          await this.userAbilityDalService.findAbilityRecords(
            {
              ability,
              relativeDuration,
              cycleDuration,
              durationType,
            },
            userId,
          );
        if (abilityRecords.length >= points) return false;
      }
      return true;
    }
    return true;
  }

  async createAbilityRecord(ability: AbilityEnum) {
    const userId = this.contextService.get().userId;
    await this.userAbilityDalService.createAbilityRecord(ability, userId);
  }

  async initUserAbilityLimit() {
    const userId = this.contextService.get().userId;
    await this.userAbilityDalService.create(DEFAULT_RULES, userId);

    return;
  }
}
