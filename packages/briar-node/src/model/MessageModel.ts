import { ModelEnum, RoleEnum } from 'briar-shared';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

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

  // @BelongsTo(() => ConversationModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  conversationId: number;
}
