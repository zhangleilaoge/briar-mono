import { LogFromEnum, LogTypeEnum } from 'briar-shared';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'logs' })
export class LogModel extends Model<LogModel> {
  @Column
  userId: number;

  @Column({
    defaultValue: false,
    type: DataType.CHAR(10),
  })
  type: LogTypeEnum;

  @Column({
    type: DataType.TEXT,
    defaultValue: '',
  })
  content: string;

  @Column
  ip: string;

  @Column
  from: LogFromEnum;
}
