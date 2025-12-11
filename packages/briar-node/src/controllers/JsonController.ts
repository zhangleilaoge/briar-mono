import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IGetJsonListRequest } from 'briar-shared';

import { QueryToObject } from '@/decorators/Query2Obj';
import { RoleGuard } from '@/guards/role';
import { JsonService } from '@/services/JsonService';

@Controller('api/json')
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  /**
   * 创建 JSON 文档
   * POST /api/json/create
   */
  @Post('/create')
  @UseGuards(RoleGuard)
  async createJson(
    @Body('content') content: string,
    @Body('name') name: string,
  ) {
    const doc = await this.jsonService.createJson({
      content,
      name,
    });

    return {
      success: true,
      data: {
        id: doc.id,
        name: doc.name,
        content: doc.content,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    };
  }

  /**
   * 获取 JSON 文档列表
   * GET /api/json/list?page=1&pageSize=10&keyword=test
   */
  @Get('/list')
  @UseGuards(RoleGuard)
  async getJsonList(@QueryToObject() query: IGetJsonListRequest) {
    const page = parseInt(query.page as any) || 1;
    const pageSize = parseInt(query.pageSize as any) || 10;

    const result = await this.jsonService.getJsonList({
      page,
      pageSize,
      keyword: query.keyword,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * 获取单个 JSON 文档
   * GET /api/json/:id
   */
  @Get('/:id')
  @UseGuards(RoleGuard)
  async getJson(@Param('id') id: string) {
    const doc = await this.jsonService.getJson(parseInt(id));

    return {
      success: true,
      data: {
        id: doc.id,
        name: doc.name,
        content: doc.content,
        views: doc.views,
        contentSize: doc.contentSize,
        isFavorite: doc.isFavorite,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    };
  }

  /**
   * 更新 JSON 文档
   * PUT /api/json/:id
   */
  @Put('/:id')
  @UseGuards(RoleGuard)
  async updateJson(
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('name') name: string,
  ) {
    const doc = await this.jsonService.updateJson(parseInt(id), {
      content,
      name,
    });

    return {
      success: true,
      data: {
        id: doc.id,
        name: doc.name,
        content: doc.content,
        updatedAt: doc.updatedAt,
      },
    };
  }

  /**
   * 删除 JSON 文档
   * DELETE /api/json/:id
   */
  @Delete('/:id')
  @UseGuards(RoleGuard)
  async deleteJson(@Param('id') id: string) {
    await this.jsonService.deleteJson(parseInt(id));

    return {
      success: true,
    };
  }

  /**
   * 切换收藏状态
   * POST /api/json/:id/favorite
   */
  @Post('/:id/favorite')
  @UseGuards(RoleGuard)
  async toggleFavorite(@Param('id') id: string) {
    const doc = await this.jsonService.toggleFavorite(parseInt(id));

    return {
      success: true,
      data: {
        id: doc.id,
        isFavorite: doc.isFavorite,
      },
    };
  }

  /**
   * 获取用户统计数据
   * GET /api/json/stats/overview
   */
  @Get('/stats/overview')
  @UseGuards(RoleGuard)
  async getStats() {
    const stats = await this.jsonService.getUserStats();

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * 获取文档版本历史
   * GET /api/json/:id/versions
   */
  @Get('/:id/versions')
  @UseGuards(RoleGuard)
  async getVersionHistory(@Param('id') id: string) {
    const versions = await this.jsonService.getVersionHistory(parseInt(id));

    return {
      success: true,
      data: versions,
    };
  }

  /**
   * 恢复到指定版本
   * POST /api/json/:id/restore/:versionId
   */
  @Post('/:id/restore/:versionId')
  @UseGuards(RoleGuard)
  async restoreVersion(
    @Param('id') id: string,
    @Param('versionId') versionId: string,
  ) {
    const doc = await this.jsonService.restoreVersion(
      parseInt(id),
      parseInt(versionId),
    );

    return {
      success: true,
      data: {
        id: doc.id,
        content: doc.content,
        updatedAt: doc.updatedAt,
      },
    };
  }
}
