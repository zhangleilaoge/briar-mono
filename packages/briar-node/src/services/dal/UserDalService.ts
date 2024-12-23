import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IPageInfo, IRoleDTO, ISortInfo } from 'briar-shared';
import { omit } from 'lodash';
import { Op, Order, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { RoleEnum } from '@/constants/user';
import { SafeReturn } from '@/decorators/SafeReturn';
import { RolesModel, UserModel } from '@/model/UserModel';
import { getOrderList } from '@/utils/common';
import { splitCondition } from '@/utils/dal';

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
  async getUser(
    {
      userId,
      googleId,
      password,
      username,
      email,
    }: {
      userId?: number;
      googleId?: string;
      password?: string;
      username?: string;
      email?: string;
    },
    optType = Op.or,
  ) {
    const orMatch = splitCondition({
      id: userId,
      googleId,
      password,
      username,
      email,
    });

    return (
      await this.userModel.findOne({
        where: { [optType]: orMatch },
      })
    )?.dataValues;
  }

  @SafeReturn(SENSITIVE_FIELDS)
  async getUsers(ids: number[]) {
    return (
      await this.userModel.findAll({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      })
    ).map((user) => user.dataValues);
  }

  async update(data: Partial<UserModel>) {
    const { email, mobile, username, id } = data;

    if (email) {
      const existingEmailUser = await this.userModel.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
        },
      });
      if (existingEmailUser) {
        throw new ForbiddenException('当前 email 已经被使用'); // "The current email is already in use"
      }
    }

    if (mobile) {
      const existingMobileUser = await this.userModel.findOne({
        where: {
          mobile,
          id: { [Op.ne]: id },
        },
      });

      if (existingMobileUser) {
        throw new ForbiddenException('当前 mobile 已经被使用'); // "The current mobile number is already in use"
      }
    }

    if (username) {
      const existingUsernameUser = await this.userModel.findOne({
        where: {
          username,
          id: { [Op.ne]: id },
        },
      });

      if (existingUsernameUser) {
        throw new ForbiddenException('当前 username 已经被使用'); // "The current username is already in use"
      }
    }

    return await this.userModel.update(data, { where: { id } });
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

  async getUserList({
    pagination,
    sorter,
    name,
    mobile,
    email,
    id,
    roles,
  }: {
    pagination: IPageInfo;
    sorter: ISortInfo;
    roles: number[];
    name?: string;
    mobile?: string;
    email?: string;
    id?: number;
  }) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;
    const sortBy = sorter.sortBy;
    const sortType = sorter.sortType;

    const orMatch = splitCondition({
      id,
      name: name ? { [Op.like]: `%${name}%` } : null,
      username: name ? { [Op.like]: `%${name}%` } : null,
      mobile,
      email,
    });

    const { count, rows } = await this.userModel.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: getOrderList([{ sortBy, sortType }]) as Order,
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
