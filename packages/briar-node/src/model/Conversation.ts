import { ModelEnum } from 'briar-shared';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Conversation extends Model<Conversation> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model: ModelEnum;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  created: number;

  @Column
  title?: string;
}
