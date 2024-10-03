import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/** 将接口设置为公开接口，业务逻辑中请不要再加入任何权限判断和用户相关逻辑 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
