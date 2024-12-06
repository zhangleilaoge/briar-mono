import { UrlEnum } from '..';

export const getShortUrl = (code: string) => {
	return UrlEnum.Base + 'short/' + code;
};
