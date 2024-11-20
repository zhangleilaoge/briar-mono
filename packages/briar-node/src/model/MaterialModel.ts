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
