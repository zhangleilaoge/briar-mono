import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserInfoDTO } from 'briar-shared';
import { Op } from 'sequelize';

import { UserDalService } from './dal/UserDalService';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDalService: UserDalService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userDalService.getUser(
      { username, password },
      Op.and,
    );
    return user as IUserInfoDTO;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
