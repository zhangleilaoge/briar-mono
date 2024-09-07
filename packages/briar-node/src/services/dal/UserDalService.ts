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

  async findOne(userId: number) {
    return await this.userModel.findOne({ where: { id: userId } });
  }

  async update(data: Partial<UserModel>) {
    return await this.userModel.update(data, { where: { id: data.id } });
  }
}
