import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ICreateJsonRequest,
  IGetJsonListRequest,
  IJsonDocumentDTO,
  IJsonListResponse,
  IJsonStatsDTO,
  IUpdateJsonRequest,
} from 'briar-shared';
import { Op } from 'sequelize';

import {
  JsonDocumentAccessLogModel,
  JsonDocumentModel,
  JsonDocumentOperationLogModel,
  JsonDocumentVersionModel,
} from '@/model/JsonDocumentModel';

import { ContextService } from './common/ContextService';

@Injectable()
export class JsonService {
  constructor(
    @InjectModel(JsonDocumentModel)
    private readonly jsonDocumentModel: typeof JsonDocumentModel,
    @InjectModel(JsonDocumentVersionModel)
    private readonly jsonDocumentVersionModel: typeof JsonDocumentVersionModel,
    @InjectModel(JsonDocumentOperationLogModel)
    private readonly jsonOperationLogModel: typeof JsonDocumentOperationLogModel,
    @InjectModel(JsonDocumentAccessLogModel)
    private readonly jsonAccessLogModel: typeof JsonDocumentAccessLogModel,
    private readonly contextService: ContextService,
  ) {}

  /**
   * 创建 JSON 文档
   */
  async createJson(dto: ICreateJsonRequest): Promise<JsonDocumentModel> {
    const userId = this.contextService.get().userId;
    const contentSize = Buffer.byteLength(dto.content, 'utf8');

    const doc = await this.jsonDocumentModel.create({
      userId,
      name: dto.name,
      content: dto.content,
      contentSize,
      description: dto.description,
      docType: dto.docType || 'json',
    });

    // 创建初始版本
    await this.jsonDocumentVersionModel.create({
      documentId: doc.id,
      version: 1,
      content: dto.content,
      operatorId: userId,
      changeLog: '初始版本',
    });

    // 记录操作日志
    await this.jsonOperationLogModel.create({
      documentId: doc.id,
      operationType: 'create',
      operatorId: userId,
      details: `创建了 JSON 文档: ${dto.name}`,
    });

    // 记录访问日志
    await this.jsonAccessLogModel.create({
      userId,
      documentId: doc.id,
      accessType: 'write',
    });

    return doc;
  }

  /**
   * 获取 JSON 文档列表（分页）
   */
  async getJsonList(params: IGetJsonListRequest): Promise<IJsonListResponse> {
    const userId = this.contextService.get().userId;
    const { page, pageSize, keyword } = params;
    const offset = (page - 1) * pageSize;

    const where: any = { userId };

    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const { rows, count } = await this.jsonDocumentModel.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'name',
        'content',
        'contentSize',
        'views',
        'isFavorite',
        'docType',
        'createdAt',
        'updatedAt',
      ],
    });

    return {
      items: rows as IJsonDocumentDTO[],
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * 获取单个 JSON 文档
   */
  async getJson(documentId: number): Promise<JsonDocumentModel> {
    const userId = this.contextService.get().userId;
    const doc = await this.jsonDocumentModel.findByPk(documentId);

    if (!doc) {
      throw new NotFoundException('文档不存在');
    }

    if (doc.userId !== userId) {
      throw new ForbiddenException('无权访问该文档');
    }

    // 增加访问次数
    await doc.increment('views', { by: 1 });

    // 记录访问日志
    await this.jsonAccessLogModel.create({
      userId,
      documentId,
      accessType: 'read',
    });

    return doc;
  }

  /**
   * 更新 JSON 文档
   */
  async updateJson(
    documentId: number,
    dto: IUpdateJsonRequest,
  ): Promise<JsonDocumentModel> {
    const userId = this.contextService.get().userId;
    const doc = await this.jsonDocumentModel.findByPk(documentId);

    if (!doc) {
      throw new NotFoundException('文档不存在');
    }

    if (doc.userId !== userId) {
      throw new ForbiddenException('无权修改该文档');
    }

    // 如果内容有变化，保存版本
    if (dto.content && dto.content !== doc.content) {
      const latestVersion = await this.jsonDocumentVersionModel.findOne({
        where: { documentId },
        order: [['version', 'DESC']],
      });

      const newVersion = (latestVersion?.version || 1) + 1;

      await this.jsonDocumentVersionModel.create({
        documentId,
        version: newVersion,
        content: dto.content,
        operatorId: userId,
        changeLog: '更新文档',
      });

      // 更新文档内容大小
      const contentSize = Buffer.byteLength(dto.content, 'utf8');
      dto = { ...dto, contentSize };
    }

    // 更新文档
    await doc.update(dto);

    // 记录操作日志
    await this.jsonOperationLogModel.create({
      documentId,
      operationType: 'update',
      operatorId: userId,
      details: `更新了 JSON 文档`,
    });

    // 记录访问日志
    await this.jsonAccessLogModel.create({
      userId,
      documentId,
      accessType: 'write',
    });

    return doc;
  }

  /**
   * 删除 JSON 文档
   */
  async deleteJson(documentId: number): Promise<void> {
    const userId = this.contextService.get().userId;
    const doc = await this.jsonDocumentModel.findByPk(documentId);

    if (!doc) {
      throw new NotFoundException('文档不存在');
    }

    if (doc.userId !== userId) {
      throw new ForbiddenException('无权删除该文档');
    }

    // 记录操作日志
    await this.jsonOperationLogModel.create({
      documentId,
      operationType: 'delete',
      operatorId: userId,
      details: `删除了 JSON 文档: ${doc.name}`,
    });

    // 删除关联数据
    await this.jsonDocumentVersionModel.destroy({
      where: { documentId },
    });

    // 删除文档
    await doc.destroy();

    // 记录访问日志
    await this.jsonAccessLogModel.create({
      userId,
      documentId,
      accessType: 'delete',
    });
  }

  /**
   * 切换收藏状态
   */
  async toggleFavorite(documentId: number): Promise<JsonDocumentModel> {
    const userId = this.contextService.get().userId;
    const doc = await this.jsonDocumentModel.findByPk(documentId);

    if (!doc) {
      throw new NotFoundException('文档不存在');
    }

    if (doc.userId !== userId) {
      throw new ForbiddenException('无权操作该文档');
    }

    await doc.update({ isFavorite: !doc.isFavorite });

    return doc;
  }

  /**
   * 获取用户的统计数据
   */
  async getUserStats(): Promise<IJsonStatsDTO> {
    const userId = this.contextService.get().userId;
    const [totalDocuments, totalSize, monthlyRequests] = await Promise.all([
      // 总文档数
      this.jsonDocumentModel.count({ where: { userId } }),

      // 总大小
      this.jsonDocumentModel.sum('contentSize', { where: { userId } }),

      // 本月API请求数
      this.jsonAccessLogModel.count({
        where: {
          userId,
          createdAt: {
            [Op.gte]: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1,
            ),
          },
        },
      }),
    ]);

    // 获取最近活动
    const recentLogs = await this.jsonOperationLogModel.findAll({
      where: { operatorId: userId },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    return {
      totalDocuments,
      totalSize: totalSize || 0,
      monthlyRequests,
      storageUsed: Math.ceil((totalSize || 0) / 1024 / 1024), // 转换为 MB
      storageLimit: 100, // Mock: 100MB 限额
      recentLogs,
    };
  }

  /**
   * 获取文档的版本历史
   */
  async getVersionHistory(documentId: number) {
    const userId = this.contextService.get().userId;
    const doc = await this.jsonDocumentModel.findByPk(documentId);

    if (!doc) {
      throw new NotFoundException('文档不存在');
    }

    if (doc.userId !== userId) {
      throw new ForbiddenException('无权访问该文档');
    }

    return await this.jsonDocumentVersionModel.findAll({
      where: { documentId },
      order: [['version', 'DESC']],
      attributes: ['id', 'version', 'changeLog', 'createdAt'],
    });
  }

  /**
   * 恢复到指定版本
   */
  async restoreVersion(
    documentId: number,
    versionId: number,
  ): Promise<JsonDocumentModel> {
    const userId = this.contextService.get().userId;
    const doc = await this.jsonDocumentModel.findByPk(documentId);

    if (!doc) {
      throw new NotFoundException('文档不存在');
    }

    if (doc.userId !== userId) {
      throw new ForbiddenException('无权操作该文档');
    }

    const version = await this.jsonDocumentVersionModel.findByPk(versionId);

    if (!version || version.documentId !== documentId) {
      throw new NotFoundException('版本不存在');
    }

    // 创建新版本记录当前恢复操作
    const latestVersion = await this.jsonDocumentVersionModel.findOne({
      where: { documentId },
      order: [['version', 'DESC']],
    });

    const newVersion = (latestVersion?.version || 1) + 1;

    await this.jsonDocumentVersionModel.create({
      documentId,
      version: newVersion,
      content: version.content,
      operatorId: userId,
      changeLog: `从版本 ${version.version} 恢复`,
    });

    // 更新文档内容
    const contentSize = Buffer.byteLength(version.content, 'utf8');
    await doc.update({
      content: version.content,
      contentSize,
    });

    // 记录操作日志
    await this.jsonOperationLogModel.create({
      documentId,
      operationType: 'restore',
      operatorId: userId,
      details: `恢复到版本 ${version.version}`,
    });

    return doc;
  }
}
