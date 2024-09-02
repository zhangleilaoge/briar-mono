import { ModelEnum } from 'briar-shared';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'conversations' })
export class ConversationModel extends Model<ConversationModel> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model: ModelEnum;

  @Column
  title?: string;
 
 // @BelongsTo(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
}
