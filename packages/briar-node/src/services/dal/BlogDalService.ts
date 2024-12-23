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

  async editBlog(blog: Pick<IBlogDTO, 'title' | 'content'>, id: number) {
    return await this.blogModel.update(blog, { where: { id } });
  }

  async getBlog(blogId: number) {
    return (await this.blogModel.findOne({ where: { id: blogId } })).dataValues;
  }

  async getBlogs(
    pagination: IPageInfo = {
      page: 1,
      pageSize: 1,
    },
  ) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;

    const { count, rows } = await this.blogModel.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['createdAt', 'DESC']], // 以创建时间降序排列
      where: {
        [Op.and]: splitCondition({}),
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

  async deleteBlog(id: number) {
    return await this.blogModel.destroy({ where: { id } });
  }
}
