import { StardewValleyGirl } from 'briar-shared';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'conversations' })
export class ConversationModel extends Model<ConversationModel> {
  @Column
  title?: string;

  // @BelongsTo(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column
  marked?: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profile: StardewValleyGirl;
}
