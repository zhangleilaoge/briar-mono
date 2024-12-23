import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IBlogDTO, IPageInfo } from 'briar-shared';
import { Op } from 'sequelize';

import { BlogModel } from '@/model/BlogModel';
import { splitCondition } from '@/utils/dal';
@Injectable()
export class BlogDalService {
  constructor(
    @InjectModel(BlogModel)
    private readonly blogModel: typeof BlogModel,
  ) {}

  async createBlog(blog: IBlogDTO) {
    return await this.blogModel.create(blog);
  }

  async getBlog(blogId: number) {
    return (await this.blogModel.findByPk(blogId)).dataValues;
  }

  async getBlogs(pagination: IPageInfo, userId: number, id?: number) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;

    const { count, rows } = await this.blogModel.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['createdAt', 'DESC']], // 以创建时间降序排列
      where: {
        [Op.and]: splitCondition({
          id,
          userId,
        }),
      },
    });

    return {
      items: rows.map((item) => item.dataValues),
      paginator: {
        total: count,
        page,
        pageSize,
      },
    };
  }
}
