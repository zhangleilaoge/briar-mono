import { IPageInfo } from './common';
import { IModel } from './model';

export type IShortUrlDTO = IModel<{
	creator?: number;
	code: string;
	url?: string;
}>;

// ====================== request params below ========================
export type IGetShortUrlListParams = IPageInfo & {
	url: string;
};
