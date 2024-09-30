import { CycleEnum, DurationEnum, IAbilityUsageRule } from 'briar-shared';

/** 每天限制触发 x 次 */
export const getDayCycleRule = (points: number): IAbilityUsageRule => {
  return {
    cycleDuration: CycleEnum.day,
    durationType: DurationEnum.cycle,
    points: points,
  };
};
