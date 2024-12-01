import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class UserModel extends Model<UserModel> {
  @Column
  name?: string;

  @Column
  username?: string;

  @Column
  password?: string;

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

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  roles: Array<number>;

  @Column
  mobile?: string;
}

@Table({ tableName: 'roles' })
export class RolesModel extends Model<RolesModel> {
  @Column
  name?: string;

  @Column
  desc?: string;

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  menuKeys: Array<string>;
}
