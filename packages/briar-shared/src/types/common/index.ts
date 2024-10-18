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
	Base = 'https://restrained-hunter.website/',
	NotFound = 'https://restrained-hunter.website/briar/404'
}
