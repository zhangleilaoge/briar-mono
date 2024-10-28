import { SetMetadata } from '@nestjs/common';

export const USER_ROLE_KEY = 'role';
export const Role = (roleId: number[] | number) =>
  SetMetadata(USER_ROLE_KEY, Array.isArray(roleId) ? roleId : [roleId]);
