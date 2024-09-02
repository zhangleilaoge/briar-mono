import { Injectable } from '@nestjs/common';
import { UserDalService } from './dal/UserDalService';

@Injectable()
export class UserService {
  constructor(private readonly userDalService: UserDalService) {}

  async createAnonymousUser() {
    const user = (await this.userDalService.create({})).toJSON();
    return user;
  }
}
