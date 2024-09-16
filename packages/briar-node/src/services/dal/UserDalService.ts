import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '@/model/UserModel';
import { Op } from 'sequelize';
import { SafeReturn } from '@/decorators/SafeReturn';

const SENSITIVE_FIELDS = ['password'];

@Injectable()
export class UserDalService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  @SafeReturn(SENSITIVE_FIELDS)
  async create({ name = '', profileImg = '', email = '', googleId = '' }) {
    return (
      await this.userModel.create({
        name,
        profileImg,
        email,
        googleId,
      })
    ).dataValues;
  }

  async delete(id: number) {
    return await this.userModel.destroy({ where: { id } });
  }

  @SafeReturn(SENSITIVE_FIELDS)
  async getUser({
    userId,
    googleId,
    password,
    username,
  }: {
    userId?: number;
    googleId?: string;
    password?: string;
    username?: string;
  }) {
    const orMatch = [];
    if (userId) orMatch.push({ id: userId });
    if (googleId) orMatch.push({ googleId });
    if (password) orMatch.push({ password });
    if (username) orMatch.push({ username });

    return (
      await this.userModel.findOne({
        where: { [Op.or]: orMatch },
      })
    )?.dataValues;
  }

  async update(data: Partial<UserModel>) {
    return await this.userModel.update(data, { where: { id: data.id } });
  }
}
