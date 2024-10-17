import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'short_urls' })
export class ShortUrlModel extends Model<ShortUrlModel> {
  @Column
  creator: number;

  @Column({
    type: DataType.CHAR(10),
  })
  code: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: '',
  })
  url: string;
}
