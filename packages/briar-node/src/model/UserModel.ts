import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel> {
  @Column
  name?: string;

  @Column
  profileImg?: string;

  @Column
  email?: string;

  @Column
  googleId?: string;

  @Column({
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  isAuthenticated?: boolean;

  // @HasMany(() => ConversationModel)
  // conversations: ConversationModel[];
}
