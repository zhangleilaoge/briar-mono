export interface ISource {
	keyword: string;
	city: string;
}

export interface IPlan {
	distanceTotal: string;
	timeTotal: string;

	instructions: string[];
	fastest?: boolean;
	shortest?: boolean;
}

export interface ISearchResult {
	start: string;
	minDistance: string;
	minTime: string;
	plans: IPlan[];
}

export interface IRowData {
	[key: string]: any;
}
