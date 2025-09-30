import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import md5 from 'md5-es';
import qs from 'qs';

import { isDev, LocalStorageKey } from '@/pages/briar/constants/env';
import { errorNotify } from '@/pages/briar/utils/notify';

export type PureDataAxiosInstance = {
	get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
	delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
	head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
	options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
};

/**
 * 创建 Axios 实例（参考您原有的 alova 配置）
 */
const createAxiosInstance = () => {
	const instance = axios.create({
		baseURL: isDev ? 'https://stardew.site/api' : '/api',
		timeout: 30000,
		withCredentials: true // 对应原来的 credentials: 'include'
	});

	// 请求拦截器（对应原来的 beforeRequest）
	instance.interceptors.request.use(
		(config) => {
			// 添加认证头
			config.headers.Authorization = `Bearer ${localStorage.getItem(LocalStorageKey.AccessToken)}`;
			config.headers['x-trace-id'] = md5.hash(Date.now().toString() + Math.random().toString());

			// 处理 GET 请求参数（对应原来的 params 处理逻辑）
			if (config.method === 'get' && config.params) {
				const queryParamsStr = qs.stringify(config.params, { arrayFormat: 'brackets' });
				if (queryParamsStr !== '') {
					config.url = config.url?.includes('?')
						? `${config.url}&${queryParamsStr}`
						: `${config.url}?${queryParamsStr}`;
					config.params = {}; // 清空 params，避免重复
				}
			}

			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	// 响应拦截器（对应原来的 responded 配置）
	instance.interceptors.response.use(
		(response: AxiosResponse) => {
			// 对应 onSuccess 逻辑
			if (response.status >= 400) {
				const message = response.data?.message || JSON.stringify(response.data);
				throw new Error(message);
			}
			return response.data; // 直接返回数据部分
		},
		(error) => {
			// 对应 onError 逻辑
			console.log('error:', error);
			errorNotify(error);
			return Promise.reject(error);
		}
	);

	return instance;
};

// 创建实例
const axiosInstance = createAxiosInstance() as PureDataAxiosInstance;

export { axiosInstance };
