import { Injectable } from '@nestjs/common';
import { UserDalService } from './dal/UserDalService';
import { OAuth2Client } from 'google-auth-library';
import { CLIENT_ID, COOKIE_MAX_AGE } from 'briar-shared';

@Injectable()
export class UserService {
  constructor(private readonly userDalService: UserDalService) {}

  async createAnonymousUser() {
    const user = (await this.userDalService.create({})).toJSON();
    return user;
  }

  async getUserInfo(userId: number) {
    try {
      const user = (await this.userDalService.findOne({ userId })).toJSON();
      return user;
    } catch (error) {
      return null;
    }
  }

  async authenticateUserByGoogle(
    tokenId: string,
    userId: number,
    response: any,
  ) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) return false;

    const user = (
      await this.userDalService.findOne({ googleId: payload.sub })
    )?.toJSON();

    // 1. google 账号已绑定账号 => 返回绑定的账号
    if (user?.id) {
      response.setCookie('userId', user.id, {
        httpOnly: true,
        secure: true,
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      });
      return true;
    }

    // 2. google 账号未绑定账号 => 绑定当前账号
    await this.userDalService.update({
      isAuthenticated: true,
      id: userId,
      name: payload.name,
      profileImg: payload.picture,
      email: payload.email,
      googleId: payload.sub,
    });
    return true;
  }
}
