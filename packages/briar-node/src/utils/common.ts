import { filterDummy, ISortInfo } from 'briar-shared';

export const getOrderList = (list: ISortInfo[]) => {
  return list
    .map((item) => {
      return [item.sortBy, item.sortType?.toUpperCase()];
    })
    .filter((item) => filterDummy(item[0]) && filterDummy(item[1]));
};
