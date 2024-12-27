import 'dotenv/config';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { IBlogDTO, IGetBlogs, RoleEnum } from 'briar-shared';
import { intersection } from 'lodash';

import { ContextService } from './common/ContextService';
import { BlogDalService } from './dal/BlogDalService';
import { UserDalService } from './dal/UserDalService';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogDalService: BlogDalService,
    private readonly userDalService: UserDalService,
    private readonly contextService: ContextService,
  ) {}

  async createBlog(blog: IBlogDTO) {
    return this.blogDalService.createBlog({
      ...blog,
      userId: this.contextService.get().userId,
    });
  }

  async editBlog(blog: Pick<IBlogDTO, 'title' | 'content'>, id: number) {
    return this.blogDalService.editBlog(blog, id);
  }

  async incrementViews(id: number) {
    return this.blogDalService.incrementViews(id);
  }

  async checkBlogPermission(blogId: number) {
    const blog = await this.blogDalService.getBlog(
      blogId,
      this.contextService.get().userId,
    );

    if (
      blog.userId !== this.contextService.get().userId &&
      intersection(this.contextService.get().roles, [RoleEnum.Admin]).length ===
        0
    ) {
      throw new ForbiddenException('你没有权限编辑该博文');
    }

    return true;
  }

  async getBlog(blogId: number) {
    const data = await this.blogDalService.getBlog(
      blogId,
      this.contextService.get().userId,
    );

    const authorId = data.userId;

    const author = await this.userDalService.getUser({ userId: authorId });

    return {
      ...data,
      author,
    };
  }

  async favorite(blogId: number, favorite: boolean) {
    return this.blogDalService.favorite(
      this.contextService.get().userId,
      blogId,
      favorite,
    );
  }

  async getBlogs({ pageInfo: pagination, favorite, keyword }: IGetBlogs) {
    const data = await this.blogDalService.getBlogs({
      pagination,
      userId: this.contextService.get().userId,
      favorite,
      keyword,
    });

    const AuthorIds = data.items.map((item) => item.userId);

    const Authors = await this.userDalService.getUsers(AuthorIds);

    const blogs = data.items.map((item) => {
      return {
        ...item,
        author: Authors.find((author) => author.id === item.userId),
      };
    });

    return {
      ...data,
      items: blogs,
    };
  }

  async deleteBlog(blogId: number) {
    return this.blogDalService.deleteBlog(blogId);
  }
}
