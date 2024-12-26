import {
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

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

  @HasMany(() => BlogFavoriteModel, { foreignKey: 'blogId' })
  blogFavorites: BlogFavoriteModel[];
}

@Table({ tableName: 'blog_favorites' })
export class BlogFavoriteModel extends Model<BlogFavoriteModel> {
  @Column
  userId: number;

  @ForeignKey(() => BlogModel)
  @Column
  blogId: number;
}
