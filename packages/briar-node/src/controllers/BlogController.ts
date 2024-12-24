import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IBlogDTO, IGetBlogs } from 'briar-shared';

import { QueryToObject } from '@/decorators/Query2Obj';
import { RoleGuard } from '@/guards/role';
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

  @Post('/editBlog')
  @UseGuards(RoleGuard)
  async editBlog(
    @Body('blog') blog: Pick<IBlogDTO, 'title' | 'content'>,
    @Body('id') id: number,
  ) {
    await this.blogService.checkBlogPermission(id);
    await this.blogService.editBlog(blog, id);
    return {
      success: true,
    };
  }

  @Get('/getBlogs')
  async getBlogs(@QueryToObject() query: IGetBlogs) {
    return await this.blogService.getBlogs(query.pageInfo);
  }

  @Get('/getBlog')
  async getBlog(@QueryToObject() query: { id: number }) {
    return await this.blogService.getBlog(query.id);
  }

  @Post('/deleteBlog')
  @UseGuards(RoleGuard)
  async deleteBlog(@Body('id') id: number) {
    await this.blogService.checkBlogPermission(id);
    await this.blogService.deleteBlog(id);
    return {
      success: true,
    };
  }
}
