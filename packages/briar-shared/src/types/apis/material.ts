import { IPageInfo } from '../common';

export interface IGetImgMaterialsRequest {
	pagination: IPageInfo;
	searchTerm?: string;
}
