import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'materials' })
export class MaterialModel extends Model<MaterialModel> {
  @Column
  userId: number;

  @Column
  name: string;

  @Column
  thumbUrl: string;

  @Column
  url: string;
}

// todo 1 增加文件尺寸字段
// todo 2 增加统一登录页
// todo 3 增加关键词查询以及排序能力
