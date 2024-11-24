import { SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import { IPageInfo, ISortInfo } from 'briar-shared';
import { isNil, omitBy } from 'lodash-es';

/** @description 标准的 antdTable 的 onChange 中的排序转换处理  */
export const convertAntdSortInfo = <T>(sorter: SorterResult<T>): ISortInfo => {
	return {
		sortBy: sorter.field as string,
		sortType: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : null
	};
};

/** @description 标准的 antdTable 的 onChange 中的页码转换处理  */
export const convertAntdPaginator = (pagination: TablePaginationConfig): IPageInfo => {
	return omitBy({ ...pagination, page: pagination.current }, isNil);
};
