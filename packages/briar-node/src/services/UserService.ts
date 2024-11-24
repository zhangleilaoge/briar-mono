import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import {
  EMAIL_REG,
  IPageInfo,
  IRoleDTO,
  ISortInfo,
  IUserInfoDTO,
  MOBILE_REG,
} from 'briar-shared';

import { RoleEnum } from '@/constants/user';

import { ContextService } from './common/ContextService';
import { UserDalService } from './dal/UserDalService';
import { UserAbilityService } from './UserAbilityService';

@Injectable()
export class UserService {
  constructor(
    private readonly userDalService: UserDalService,
    private contextService: ContextService,
    private jwtService: JwtService,
    private userAbilityService: UserAbilityService,
  ) {}

  async getUserByJwt() {
    const userId = this.contextService.get().userId;

    try {
      const user = await this.userDalService.getUser({ userId });
      return user as IUserInfoDTO;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getLoginUser(username: string, password: string) {
    const user = await this.userDalService.getUser({ username, password });
    return user as IUserInfoDTO;
  }

  async createAnonymousUser() {
    const user = await this.userDalService.create({});
    this.contextService.setValue('userId', user.id);
    await this.userAbilityService.initUserAbilityLimit();

    return user as IUserInfoDTO;
  }

  async authenticateUserByGoogle(googleAccessToken: string, userId: number) {
    const userInfo: any = await axios({
      method: 'get',
      url: `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleAccessToken}`,
      responseType: 'stream',
    });

    if (!userInfo) return false;

    const user = await this.userDalService.getUser({ googleId: userInfo.sub });

    // 1. google 账号已绑定账号 => 返回绑定的账号
    if (user?.id) {
      return user?.id;
    }

    // 2. google 账号未绑定账号 => 绑定当前账号
    await this.userDalService.update({
      isAuthenticated: true,
      id: userId,
      name: userInfo.name,
      profileImg: userInfo.picture,
      email: userInfo.email,
      googleId: userInfo.sub,
    });
    return userId;
  }

  async checkUsername(username: string) {
    return {
      alreadyExists: !!(await this.userDalService.getUser({ username }))?.id,
    };
  }

  async signUp(userInfo: Partial<IUserInfoDTO>) {
    return this.userDalService.update({
      ...userInfo,
      isAuthenticated: true,
      roles: [RoleEnum.Registered],
    });
  }

  async createJwt(userId: number) {
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
    });
    return accessToken;
  }

  async createRole({
    name,
    desc,
    menuKeys,
  }: Pick<IRoleDTO, 'name' | 'desc' | 'menuKeys'>) {
    const result = await this.userDalService.createRole({
      name,
      desc,
      menuKeys,
    });
    return result;
  }

  async updateRole({
    name,
    desc,
    menuKeys,
    id,
  }: Pick<IRoleDTO, 'name' | 'desc' | 'menuKeys' | 'id'>) {
    const result = await this.userDalService.updateRole({
      name,
      desc,
      menuKeys,
      id,
    });
    return result;
  }

  async updateUser(data: Partial<IUserInfoDTO>) {
    const result = await this.userDalService.update(data);
    return result;
  }

  async getRoleList() {
    const result = await this.userDalService.getRoles();
    return result;
  }

  async getAvailablePage(roles: number[]) {
    // 默认为游客
    if (!roles.length) {
      roles.push(RoleEnum.Traveler);
    }
    const menuKeys = (await this.getRoleList())
      .filter((role) => roles.includes(role.id))
      .map((role) => role.menuKeys)
      .flat();

    return Array.from(new Set(menuKeys));
  }

  async getUserList({
    pagination,
    keyword,
    roles,
    sorter,
  }: {
    pagination: IPageInfo;
    sorter: ISortInfo;
    keyword: string;
    roles: number[];
  }) {
    let name: string | undefined;
    let mobile: string | undefined;
    let email: string | undefined;
    let id: number | undefined;

    if (keyword) {
      name = keyword;
      if (!isNaN(+keyword)) {
        id = +keyword;
      }
    }

    if (EMAIL_REG.test(keyword)) {
      email = keyword;
    }

    if (MOBILE_REG.test(keyword)) {
      mobile = keyword;
    }

    return await this.userDalService.getUserList({
      pagination,
      sorter,
      name,
      mobile,
      email,
      id,
      roles,
    });
  }
}
