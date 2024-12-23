import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'blogs' })
export class BlogModel extends Model<BlogModel> {
  @Column
  userId: number;

  @Column
  title: string;

  @Column
  content: string;

  @Column({
    defaultValue: 0,
  })
  views: number;
}
