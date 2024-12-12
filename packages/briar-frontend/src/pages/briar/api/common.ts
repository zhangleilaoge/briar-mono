import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import reactHook from 'alova/react';
import qs from 'qs';

import { isDev, LocalStorageKey } from '@/pages/briar/constants/env';
import { errorNotify } from '@/pages/briar/utils/notify';

const alovaInstance = createAlova({
	requestAdapter: fetchAdapter(),
	statesHook: reactHook,
	responded: {
		onSuccess: async (response) => {
			if (response.status >= 400) {
				const rawResponse = await response?.json?.();
				throw new Error(rawResponse?.message || JSON.stringify(rawResponse));
			}

			return response?.json?.() || response;
		},
		onError: (error) => {
			console.log('error:', error);
			errorNotify(error);
			throw error;
		}
	},
	baseURL: isDev ? 'https://stardew.site/api' : '/api',
	timeout: 30000,
	cacheFor: {
		GET: {
			expire: 100
		}
	},

	beforeRequest(method) {
		method.config.credentials = 'include';
		method.config.headers.Authorization = `Bearer ${localStorage.getItem(LocalStorageKey.AccessToken)}`;
		if (method.config.params) {
			const queryParamsStr = qs.stringify(method.config.params, { arrayFormat: 'brackets' });
			if (queryParamsStr === '') return;

			method.url = method.url.includes('?')
				? `${method.url}&${queryParamsStr}`
				: `${method.url}?${queryParamsStr}`;

			// 不删除的话 alova 里面还会对 `params` 再次处理
			// @ts-ignore
			delete method.config.params as any;
		}
	}
});

/** 调用外部接口使用 */
export const outerAlovaInstance = createAlova({
	requestAdapter: fetchAdapter(),
	statesHook: reactHook,
	responded: {
		onSuccess: async (response) => {
			if (response.status >= 400) {
				const rawResponse = await response?.json?.();
				throw new Error(rawResponse?.message || JSON.stringify(rawResponse));
			}

			return response?.json?.() || response;
		},
		onError: (error) => {
			console.log('error:', error);
			errorNotify(error);
			throw error;
		}
	},
	timeout: 30000,
	cacheFor: {
		GET: {
			expire: 100
		}
	}
});

export const getQueryFromObj = (obj: Record<string, any>, queryKey = 'query'): string => {
	if (!obj || typeof obj !== 'object') return '';

	if (!queryKey) {
		return Object.keys(obj)
			.map((key) => `${key}=${encodeURIComponent(obj[key])}`)
			.join('&');
	}

	return `${queryKey}=${encodeURIComponent(JSON.stringify(obj))}`;
};

export default alovaInstance;
