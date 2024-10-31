import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IPageInfo, IRoleDTO } from 'briar-shared';
import { omit } from 'lodash';
import { Op, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { RoleEnum } from '@/constants/user';
import { SafeReturn } from '@/decorators/SafeReturn';
import { RolesModel, UserModel } from '@/model/UserModel';
const SENSITIVE_FIELDS = ['password'];

@Injectable()
export class UserDalService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,

    @InjectModel(RolesModel)
    private readonly rolesModel: typeof RolesModel,

    private readonly sequelize: Sequelize,
  ) {}

  @SafeReturn(SENSITIVE_FIELDS)
  async create({
    name = '匿名用户',
    profileImg = '',
    email = '',
    googleId = '',
    roles = [RoleEnum.Traveler],
  }) {
    return (
      await this.userModel.create({
        name,
        profileImg,
        email,
        googleId,
        roles,
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

  async createRole({
    name,
    desc,
    menuKeys,
  }: Pick<IRoleDTO, 'name' | 'desc' | 'menuKeys'>) {
    return await this.rolesModel.create({ name, desc, menuKeys });
  }

  async updateRole({
    name,
    desc,
    menuKeys,
    id,
  }: Pick<IRoleDTO, 'name' | 'desc' | 'menuKeys' | 'id'>) {
    return await this.rolesModel.update(
      { name, desc, menuKeys },
      { where: { id } },
    );
  }

  async getRoles() {
    const query = `
        SELECT r.*, COUNT(u.id) AS userCount
    FROM roles AS r
    LEFT JOIN users AS u ON JSON_CONTAINS(u.roles, JSON_ARRAY(r.id))
    GROUP BY r.id;
      `;

    const rolesWithUserCounts = await this.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    return rolesWithUserCounts as Array<
      IRoleDTO & {
        userCount: number;
      }
    >;
  }

  async getUserList(
    pagination: IPageInfo,
    {
      name,
      mobile,
      email,
      id,
      roles,
    }: {
      name?: string;
      username?: string;
      mobile?: string;
      email?: string;
      id?: number;
      roles?: number[];
    },
  ) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;

    const orMatch = [];
    if (id) orMatch.push({ id });
    if (name) orMatch.push({ username: name, name });
    if (mobile) orMatch.push({ mobile });
    if (email) orMatch.push({ email });

    const { count, rows } = await this.userModel.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      where: {
        [Op.and]: [
          ...(orMatch.length > 0 ? [{ [Op.or]: orMatch }] : []),
          Sequelize.where(
            Sequelize.fn(
              'JSON_CONTAINS',
              Sequelize.col('roles'),
              JSON.stringify(roles),
            ),
            1, // JSON_CONTAINS 返回 1 或 0，1 = 包含，0 = 不包含
          ),
        ],
      },
    });

    return {
      items: rows.map((item) => {
        const data = item.dataValues;
        return omit(data, 'password');
      }),
      paginator: {
        total: count,
        page,
        pageSize,
      },
    };
  }
}
