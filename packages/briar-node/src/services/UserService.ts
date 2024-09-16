import { Injectable } from '@nestjs/common';
import { UserDalService } from './dal/UserDalService';
import { IUserInfoDTO } from 'briar-shared';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly userDalService: UserDalService,
    private jwtService: JwtService,
  ) {}

  static getUserIdByJwt(query: {
    [key: string]: any;
    user?: {
      sub: number;
    };
  }) {
    return query.user?.sub;
  }

  async getUserByJwt(query: {
    [key: string]: any;
    user?: {
      sub: number;
    };
  }) {
    const userId = await UserService.getUserIdByJwt(query);

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
    return !!(await this.userDalService.getUser({ username }))?.id;
  }

  async signUp(userInfo: Partial<IUserInfoDTO>) {
    return this.userDalService.update({
      ...userInfo,
      isAuthenticated: true,
    });
  }

  async createJwt(userId: number) {
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
    });
    return accessToken;
  }
}
