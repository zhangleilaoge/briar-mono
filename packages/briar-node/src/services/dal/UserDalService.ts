import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '@/model/UserModel';
import { Op } from 'sequelize';

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

  async findOne({ userId, googleId }: { userId?: number; googleId?: string }) {
    const orMatch = [];
    if (userId) orMatch.push({ id: userId });
    if (googleId) orMatch.push({ googleId });

    return await this.userModel.findOne({
      where: { [Op.or]: orMatch },
    });
  }

  async update(data: Partial<UserModel>) {
    return await this.userModel.update(data, { where: { id: data.id } });
  }
}
