import { isDev } from '@/constants/env';
import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import reactHook from 'alova/react';

const alovaInstance = createAlova({
	requestAdapter: fetchAdapter(),
	statesHook: reactHook,
	responded: (response) => response?.json?.() || response,
	baseURL: isDev ? 'http://localhost:8922/api' : '/api',
	timeout: 20000,
	cacheFor: {
		GET: {
			expire: 1000 * 3
		}
	},
  beforeRequest({ config }) {
    config.credentials = 'include'
  },
});

export const getQueryFromObj = (obj: Record<string, any>) => {
	if (!obj) return '';
	return Object.keys(obj)
		.map((key) => `${key}=${encodeURIComponent(obj[key])}`)
		.join('&');
};

export default alovaInstance;
