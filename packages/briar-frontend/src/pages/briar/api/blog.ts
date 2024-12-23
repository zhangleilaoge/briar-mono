import { IBlogDTO, IGetBlogsResponse, IPageInfo } from 'briar-shared';

import alovaInstance, { getQueryFromObj } from './common';

export const createBlog = (data: { blog: Pick<IBlogDTO, 'title' | 'content'> }) =>
	alovaInstance.Post('/blog/createBlog', data);

export const getBlogs = (data: { pagination?: IPageInfo; id?: number }) =>
	alovaInstance.Get<IGetBlogsResponse>(`/blog/getBlogs?${getQueryFromObj(data)}`);

export const getBlog = (data: { id: number }) =>
	alovaInstance.Get<IGetBlogsResponse['items'][number]>(`/blog/getBlog?${getQueryFromObj(data)}`);

export const editBlog = (data: { blog: Pick<IBlogDTO, 'title' | 'content'>; id: number }) =>
	alovaInstance.Post('/blog/editBlog', data);

export const deleteBlog = (data: { id: number }) => alovaInstance.Post('/blog/deleteBlog', data);
