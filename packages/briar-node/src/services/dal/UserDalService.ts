import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '@/model/UserModel';

@Injectable()
export class UserDalService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async create({
    name = '匿名用户',
    profileImg = '',
    email = '',
    googleId = '',
  }): Promise<UserModel> {
    return await this.userModel.create({
      name,
      profileImg,
      email,
      googleId,
    });
  }

  async delete(id: number) {
    return await this.userModel.destroy({ where: { id } });
  }
}
