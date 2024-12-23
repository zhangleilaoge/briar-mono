import { UrlEnum } from 'briar-shared';
import { Navigate, Route } from 'react-router-dom';

import { IMenuRouterConfig } from '@/pages/briar/types/router';

import NoAccess from '../components/NoAccess';
import NotFoundRedirect from '../components/NotFound';
import { MenuKeyEnum } from '../constants/router';

export function getLevelPath(level: number) {
	if (level < 1) return '';

	const path = window.location.pathname.replace('/briar', ''); // 获取路径部分
	const pathParts = path.split('/').filter((part) => part !== ''); // 分割路径并过滤掉空字符串

	return pathParts.length >= level - 1 ? `${pathParts[level - 1]}` : ''; // 返回一级路径或根路径
}

/** 将路由配置转化为路由 */
export function getRoutes(
	routerConfig: IMenuRouterConfig[] | undefined,
	availablePage: string[],
	defaultKey: string
) {
	const flat = (config: IMenuRouterConfig[]) => {
		const result: IMenuRouterConfig[] = [];
		config.forEach((item) => {
			if (item.children && !item.component) {
				result.push(...flat(item.children));
			} else result.push(item);
		});
		return result;
	};
	const flatConfig = flat(routerConfig || []);

	return [<Route path="" element={<Navigate to={defaultKey} />} key={''} />].concat(
		flatConfig
			.map((item) => (
				<Route
					path={`${item.key}/*`}
					Component={availablePage.includes(item.key) ? item.component : NoAccess}
					key={item.key}
				/>
			))
			.concat(<Route path="/*" element={<NotFoundRedirect fullUrl={UrlEnum.NotFound} />} />)
	);
}

/** 寻找父节点的 key */
export const findSuperiorRouterConfig = (
	currentRouterKey: string,
	routerConfig: IMenuRouterConfig[]
) => {
	const findKey = (
		config: IMenuRouterConfig[],
		superiorKey?: MenuKeyEnum
	): MenuKeyEnum | undefined => {
		for (let i = 0; i < config.length; i++) {
			const conf = config[i];
			if (conf.key === currentRouterKey) return superiorKey;

			if (conf.children) {
				const key = findKey(conf.children, conf.key);
				if (key) {
					return key;
				}
			}
		}

		return;
	};
	return findKey(routerConfig);
};

/** 获取指定 key 的路由 */
export const getRouterConfigByKey = (key: string, routerConfig: IMenuRouterConfig[]) => {
	const findRouter = (config: IMenuRouterConfig[], key: string): IMenuRouterConfig | undefined => {
		for (let i = 0; i < config.length; i++) {
			const conf = config[i];
			if (conf.key === key) return conf;

			if (conf.children) {
				const result = findRouter(conf.children, key);
				if (result) return result;
			}
		}

		return undefined;
	};

	return findRouter(routerConfig, key);
};

export const getAvailableRoutes = (
	config: IMenuRouterConfig[] = [],
	availablePages: string[] = []
) => {
	const _config: IMenuRouterConfig[] = config
		.map((item) => {
			if (availablePages.includes(item.key)) {
				if (item.children) {
					const children = getAvailableRoutes(item.children || [], availablePages);

					if (children.length > 0) {
						return {
							...item,
							children
						};
					}

					return null;
				}
				return item;
			}

			return null;
		})
		.filter(Boolean) as IMenuRouterConfig[];

	return _config;
};

/** 去除路由下的子路由 */
export const removeChildren = (config: IMenuRouterConfig[]) => {
	const _config = config.map((item) => {
		return {
			...item,
			children: undefined
		};
	});

	return _config;
};

/** @deprecated */
export const getAccessibleRoutes = (config: IMenuRouterConfig[], keys: string[]) => {
	const _config = config
		.map((item) => {
			if (keys.includes(item.key)) {
				return item;
			}
			const children = getAccessibleRoutes(item.children || [], keys);

			if (children.length > 0) {
				return {
					...item,
					children
				};
			}
		})
		.filter(Boolean) as IMenuRouterConfig[];

	return _config;
};

export const getAvailablePages = (config: IMenuRouterConfig[], availablePages: string[]) => {
	const result: string[] = [...availablePages];

	const addFatherToAvailablePages = (key: string) => {
		const father = findSuperiorRouterConfig(key, config);
		if (father && !result.includes(father)) {
			result.push(father);
			addFatherToAvailablePages(father);
		}
	};

	availablePages.forEach((item) => {
		addFatherToAvailablePages(item);
	});

	return result;
};
