import { Table, Column, Model } from 'sequelize-typescript';

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

  // @HasMany(() => ConversationModel)
  // conversations: ConversationModel[];
}
