import 'dotenv/config';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { IBlogDTO, IPageInfo } from 'briar-shared';

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

  async checkBlogPermission(blogId: number) {
    const blog = await this.blogDalService.getBlog(blogId);

    if (blog.userId !== this.contextService.get().userId) {
      throw new ForbiddenException('你没有权限编辑该博文');
    }

    return true;
  }

  async getBlog(blogId: number) {
    const data = await this.blogDalService.getBlog(blogId);

    const authorId = data.userId;

    const author = await this.userDalService.getUser({ userId: authorId });

    return {
      ...data,
      author,
    };
  }

  async getBlogs(pagination: IPageInfo) {
    const data = await this.blogDalService.getBlogs(pagination);

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
