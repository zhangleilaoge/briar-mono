import 'dotenv/config';

import { Injectable } from '@nestjs/common';
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

  async getBlog(blogId: number) {
    return this.blogDalService.getBlog(blogId);
  }

  async getBlogs(pagination: IPageInfo, id?: number) {
    const data = await this.blogDalService.getBlogs(
      pagination,
      this.contextService.get().userId,
      id,
    );

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
}
