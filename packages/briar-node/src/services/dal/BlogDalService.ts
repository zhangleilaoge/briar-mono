import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IBlogDTO, IPageInfo } from 'briar-shared';
import { Op } from 'sequelize';

import { BlogFavoriteModel, BlogModel } from '@/model/BlogModel';
import { splitCondition } from '@/utils/dal';

// import { favorite } from './../../../../briar-frontend/src/pages/briar/api/blog';
@Injectable()
export class BlogDalService {
  constructor(
    @InjectModel(BlogModel)
    private readonly blogModel: typeof BlogModel,
    @InjectModel(BlogFavoriteModel)
    private readonly blogFavoriteModel: typeof BlogFavoriteModel,
  ) {}

  async createBlog(blog: IBlogDTO) {
    return await this.blogModel.create(blog);
  }

  async editBlog(blog: Pick<IBlogDTO, 'title' | 'content'>, id: number) {
    return await this.blogModel.update(blog, { where: { id } });
  }

  async incrementViews(id: number) {
    return await this.blogModel.increment('views', { where: { id } });
  }

  async getBlog(blogId: number) {
    return (await this.blogModel.findOne({ where: { id: blogId } })).dataValues;
  }

  async getBlogs(
    pagination: IPageInfo = {
      page: 1,
      pageSize: 1,
    },
    currentUserId: number, // 当前用户的 ID
    favorite: boolean = false,
  ) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;

    // Step 1: 查询博客以及与当前用户的收藏信息
    const { count, rows } = await this.blogModel.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['createdAt', 'DESC']], // 以创建时间降序排列
      where: {
        [Op.and]: splitCondition({}),
      },
      include: [
        {
          model: BlogFavoriteModel,
          required: favorite,
          where: {
            userId: currentUserId,
          },
        },
      ],
      group: ['BlogModel.id'],
    });

    // Step 2: 在返回的数据中处理 favorite 字段
    const items = (
      rows as Array<BlogModel & { blogFavorites: BlogFavoriteModel[] }>
    ).map((item) => {
      const _favorite = item.blogFavorites && item.blogFavorites.length > 0;
      return {
        ...item.dataValues,
        favorite: !!_favorite, // 确定是否为收藏
      };
    });

    return {
      items,
      paginator: {
        total: count,
        page,
        pageSize,
      },
    };
  }

  async favorite(userId: number, blogId: number, favorite: boolean) {
    if (favorite) {
      // 添加收藏
      return await this.blogFavoriteModel.create({ userId, blogId });
    } else {
      // 取消收藏
      return await this.blogFavoriteModel.destroy({
        where: { userId, blogId },
      });
    }
  }

  async deleteBlog(id: number) {
    return await this.blogModel.destroy({ where: { id } });
  }
}
