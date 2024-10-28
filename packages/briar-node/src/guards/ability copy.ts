import 'dotenv/config';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Scope,
} from '@nestjs/common';

import { USER_ROLE_KEY } from '@/decorators/Role';
import { UserAbilityService } from '@/services/UserAbilityService';

@Injectable({ scope: Scope.REQUEST })
export class RoleGuard implements CanActivate {
  constructor(private userAbilityService: UserAbilityService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const needRoles = Reflect.getMetadata(USER_ROLE_KEY, handler);
    // const userRoles  = await

    // if (results.includes(false)) {
    //   throw new ForbiddenException('能力使用已达上限');
    // }

    // await Promise.all(
    //   abilities.map((ability) => {
    //     return this.userAbilityService.createAbilityRecord(ability);
    //   }),
    // );

    return true;
  }
}
