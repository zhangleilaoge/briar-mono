import { VerifyScene } from 'briar-shared';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'verify-codes' })
export class VerifyCodeModel extends Model<VerifyCodeModel> {
  @Column
  creator: number;

  @Column
  validDuration: number;

  @Column
  code: string;

  @Column
  scene: VerifyScene;

  @Column
  consumer: number;
}
