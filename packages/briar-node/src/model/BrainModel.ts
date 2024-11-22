import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'brain-models' })
export class BrainModel extends Model<BrainModel> {
  @Column
  userId: number;

  @Column
  isPrivate: boolean;

  @Column
  url: string;

  @Column
  type: string;

  @Column
  config: string;

  @Column
  name: string;
}
