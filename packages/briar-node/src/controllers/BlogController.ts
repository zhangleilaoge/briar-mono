import { Body, Controller, Get, Post } from '@nestjs/common';
import { IBlogDTO, IGetBlogs } from 'briar-shared';

import { QueryToObject } from '@/decorators/Query2Obj';
import { BlogService } from '@/services/BlogService';

@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/createBlog')
  async createBlog(@Body('blog') blog: IBlogDTO) {
    await this.blogService.createBlog(blog);
    return {
      success: true,
    };
  }

  @Get('/getBlogs')
  async getBlogs(@QueryToObject() query: IGetBlogs) {
    return await this.blogService.getBlogs(
      query.pageInfo || {
        page: 1,
        pageSize: 1,
      },
      query.id,
    );
  }
}
