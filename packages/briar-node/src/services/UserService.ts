import { Injectable } from '@nestjs/common';
import { UserDalService } from './dal/UserDalService';
import { OAuth2Client } from 'google-auth-library';
import { CLIENT_ID } from 'briar-shared';

@Injectable()
export class UserService {
  constructor(private readonly userDalService: UserDalService) {}

  async createAnonymousUser() {
    const user = (await this.userDalService.create({})).toJSON();
    return user;
  }

  async getUserInfo(userId: number) {
    try {
      const user = (await this.userDalService.findOne(userId)).toJSON();
      return user;
    } catch (error) {
      return null;
    }
  }

  async authenticateUserByGoogle(tokenId: string, userId: number) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (payload) {
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

    return false;
  }
}
