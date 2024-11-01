import 'dotenv/config';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Scope,
} from '@nestjs/common';

import { UserAbilityService } from '@/services/UserAbilityService';

import { USER_ABILITY_KEY } from '../decorators/Ability';

/** 能力权限控制守卫 */
@Injectable({ scope: Scope.REQUEST })
export class AbilityGuard implements CanActivate {
  constructor(private userAbilityService: UserAbilityService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const abilities = Reflect.getMetadata(USER_ABILITY_KEY, handler);
    const results: boolean[] = await Promise.all(
      abilities.map((ability) => {
        return this.userAbilityService.checkAbilityRules(ability);
      }),
    );

    if (results.includes(false)) {
      throw new ForbiddenException('能力使用已达上限');
    }

    await Promise.all(
      abilities.map((ability) => {
        return this.userAbilityService.createAbilityRecord(ability);
      }),
    );

    return true;
  }
}
