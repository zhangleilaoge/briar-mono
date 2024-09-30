import { ModelEnum, RoleEnum } from 'briar-shared';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'messages' })
export class MessageModel extends Model<MessageModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: RoleEnum;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model: ModelEnum;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  conversationId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  imgList: string;
}
