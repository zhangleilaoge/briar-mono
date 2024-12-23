import { IBlogDTO, IGetBlogsResponse, IPageInfo } from 'briar-shared';

import alovaInstance, { getQueryFromObj } from './common';

export const createBlog = (data: { blog: Pick<IBlogDTO, 'title' | 'content'> }) =>
	alovaInstance.Post('/blog/createBlog', data);

export const getBlogs = (data: { pagination?: IPageInfo; id?: number }) =>
	alovaInstance.Get<IGetBlogsResponse>(`/blog/getBlogs?${getQueryFromObj(data)}`);
