import { IPageInfo, IPageResult } from './common';
import { IUserInfoDTO } from './user';

export interface IBlogDTO {
	id: number;
	title: string;
	content: string;
	userId: number;
	createdAt: string;
}

// ====================== request below ========================
export interface IGetBlogs {
	pageInfo?: IPageInfo;
	id?: number;
}

// ====================== response below ========================

export type IGetBlogsResponse = IPageResult<
	IBlogDTO & {
		author: IUserInfoDTO;
	}
>;
