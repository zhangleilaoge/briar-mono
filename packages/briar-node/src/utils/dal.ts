import { filterDummyObj } from 'briar-shared';

interface ICondition {
  [key: string | symbol]: number | string | ICondition;
}

export const splitCondition = (condition: ICondition) => {
  return Object.entries(filterDummyObj(condition)).map(([key, value]) => {
    return {
      [key]: value,
    };
  });
};
