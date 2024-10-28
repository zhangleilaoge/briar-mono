export interface IPageInfo {
	page: number;
	pageSize: number;
	total?: number;
}

export interface IPageResult<T> {
	items: T[];
	paginator: IPageInfo;
}

export enum StardewValleyGirl {
	Abigail = 'Abigail',
	Caroline = 'Caroline',
	Emily = 'Emily',
	Haley = 'Haley',
	Penny = 'Penny',
	Robin = 'Robin'
}

export enum UrlEnum {
	Base = 'https://stardew.site/',
	NotFound = 'https://stardew.site/404'
}
