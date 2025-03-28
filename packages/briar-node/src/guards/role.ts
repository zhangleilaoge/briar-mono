import 'dotenv/config';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Scope,
} from '@nestjs/common';
import { intersection } from 'lodash';

import { USER_ROLE_KEY } from '@/decorators/Role';
import { ContextService } from '@/services/common/ContextService';
import { UserService } from '@/services/UserService';

/** 角色权限控制守卫 */
@Injectable({ scope: Scope.REQUEST })
export class RoleGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private contextService: ContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const roles = Reflect.getMetadata(USER_ROLE_KEY, handler);
    const { roles: userRoles } = await this.userService.getUserByJwt();
    const pass = intersection(roles, userRoles).length > 0;

    this.contextService.setValue('roles', userRoles);

    if (!pass && roles?.length > 0) {
      throw new ForbiddenException('当前角色无权限访问');
    }

    return true;
  }
}
