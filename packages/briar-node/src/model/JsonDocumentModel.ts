import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';

import { UserModel } from './UserModel';

/**
 * JSON 文档主表
 */
@Table({ tableName: 'json_documents', timestamps: true })
@Index(['userId', 'createdAt'])
@Index(['name'])
export class JsonDocumentModel extends Model<JsonDocumentModel> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => UserModel)
  @Column
  userId: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: '文档名称',
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'JSON 内容',
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '内容大小（字节）',
  })
  contentSize: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    comment: '访问次数',
  })
  views: number;

  @Column({
    type: DataType.STRING(50),
    defaultValue: 'private',
    comment: '分享范围：private(私有)、link(链接分享)、public(公开)',
  })
  shareRange: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: '分享链接token',
  })
  shareToken: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    comment: '是否收藏',
  })
  isFavorite: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: '备注说明',
  })
  description: string;

  @Column({
    type: DataType.STRING(50),
    defaultValue: 'json',
    comment: '文档类型标签',
  })
  docType: string;

  @HasMany(() => JsonDocumentVersionModel, { foreignKey: 'documentId' })
  versions: JsonDocumentVersionModel[];

  @HasMany(() => JsonDocumentOperationLogModel, { foreignKey: 'documentId' })
  operationLogs: JsonDocumentOperationLogModel[];
}

/**
 * JSON 文档版本控制表
 */
@Table({ tableName: 'json_document_versions', timestamps: true })
export class JsonDocumentVersionModel extends Model<JsonDocumentVersionModel> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => JsonDocumentModel)
  @Column
  documentId: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
    comment: '版本号',
  })
  version: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: '该版本的JSON内容',
  })
  content: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: '变更说明',
  })
  changeLog: string;

  @Column({
    type: DataType.INTEGER,
    comment: '操作用户ID',
  })
  operatorId: number;
}

/**
 * JSON 文档操作日志表（用于统计）
 */
@Table({ tableName: 'json_document_operation_logs', timestamps: true })
export class JsonDocumentOperationLogModel extends Model<JsonDocumentOperationLogModel> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => JsonDocumentModel)
  @Column
  documentId: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '操作类型：create、update、delete、view等',
  })
  operationType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '操作用户ID',
  })
  operatorId: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: '操作详情',
  })
  details: string;
}

/**
 * JSON 文档访问记录（用于统计API请求）
 */
@Table({ tableName: 'json_document_access_logs' })
@Index(['userId', 'createdAt'])
export class JsonDocumentAccessLogModel extends Model<JsonDocumentAccessLogModel> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column
  userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  documentId: number;

  @Column({
    type: DataType.STRING(50),
    comment: '访问类型：read、write、delete等',
  })
  accessType: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: '访问IP',
  })
  ipAddress: string;
}
