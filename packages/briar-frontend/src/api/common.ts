import { LocalStorageKey } from '@/constants/env';
import { errorNotify } from '@/utils/notify';
import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import reactHook from 'alova/react';

const alovaInstance = createAlova({
	requestAdapter: fetchAdapter(),
	statesHook: reactHook,
	responded: {
		onSuccess: (response) => response?.json?.() || response,
		onError: (error) => {
			console.log('error:', error);
			errorNotify(error);
			throw error;
		}
	},
	baseURL: '/api',
	timeout: 20000,
	cacheFor: {
		GET: {
			expire: 100
		}
	},

	beforeRequest({ config }) {
		config.credentials = 'include';
		config.headers.Authorization = `Bearer ${localStorage.getItem(LocalStorageKey.AccessToken)}`;
	}
});

export const getQueryFromObj = (obj: Record<string, any>) => {
	if (!obj) return '';
	return Object.keys(obj)
		.map((key) => `${key}=${encodeURIComponent(obj[key])}`)
		.join('&');
};

export default alovaInstance;
