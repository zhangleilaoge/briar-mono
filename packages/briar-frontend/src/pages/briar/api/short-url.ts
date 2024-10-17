import alovaInstance from './common';

export const createShortUrl = (data: { url: string }) =>
	alovaInstance.Post<{ shortUrl: string }>(`/shortUrl/createShortUrl`, data);
