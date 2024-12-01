export interface IPageInfo {
	page: number;
	pageSize: number;
	total?: number;
}

export interface ISortInfo {
	sortBy: string;
	sortType: 'asc' | 'desc' | '' | null;
}

export interface IPageResult<T> {
	items: T[];
	paginator: IPageInfo;
}

export enum UrlEnum {
	Base = 'https://stardew.site/',
	NotFound = 'https://stardew.site/404'
}
