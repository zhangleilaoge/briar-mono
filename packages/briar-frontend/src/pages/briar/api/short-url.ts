import { IGetShortUrlListParams, IPageResult, IShortUrlDTO } from 'briar-shared';

import alovaInstance, { getQueryFromObj } from './common';

export const createShortUrl = (data: { url: string }) =>
	alovaInstance.Post<{ shortUrl: string }>(`/shortUrl/createShortUrl`, data);

export const getShortUrlList = (data: IGetShortUrlListParams) =>
	alovaInstance.Get<IPageResult<IShortUrlDTO>>(
		`/shortUrl/getShortUrlList?${getQueryFromObj(data)}`
	);
