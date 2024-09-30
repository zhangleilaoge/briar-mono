import { AbilityEnum, IAbilityUsageRule } from 'briar-shared';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'ability_usage_limit' })
export class AbilityUsageLimitModel extends Model<AbilityUsageLimitModel> {
  @Column
  userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ability: AbilityEnum;

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  rules: Array<IAbilityUsageRule>;
}

@Table({ tableName: 'ability_usage_records' })
export class AbilityUsageRecordModel extends Model<AbilityUsageRecordModel> {
  @Column
  userId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ability: AbilityEnum;
}
