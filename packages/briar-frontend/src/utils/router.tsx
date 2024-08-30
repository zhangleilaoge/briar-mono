import { IMenuRouterConfig } from '@/types/router';
import { Navigate, Route } from 'react-router-dom';

export function getLevelPath(level: number) {
	if (level < 1) return '';

	const path = window.location.pathname; // 获取路径部分
	const pathParts = path.split('/').filter((part) => part !== ''); // 分割路径并过滤掉空字符串

	return pathParts.length >= level - 1 ? `${pathParts[level - 1]}` : ''; // 返回一级路径或根路径
}

export function getRoutes(routerConfig: IMenuRouterConfig[], defaultKey: string) {
	const flat = (config: IMenuRouterConfig[]) => {
		const result: IMenuRouterConfig[] = [];
		config.forEach((item) => {
			if (item.children) {
				result.push(...flat(item.children));
			} else result.push(item);
		});
		return result;
	};
	const flatConfig = flat(routerConfig);

	// @ts-ignore
	return [<Route path="" element={<Navigate to={defaultKey} />} />].concat(
		flatConfig.map((item) => (
			<Route path={`${item.key}/*`} Component={item.component} key={item.key} />
		))
	);
}

export const findSuperiorRouterConfig = (
	currentRouterKey: string,
	routerConfig: IMenuRouterConfig[]
) => {
	const findKey = (config: IMenuRouterConfig[], superiorKeys: string[] = []): string[] => {
		for (let i = 0; i < config.length; i++) {
			const conf = config[i];
			if (conf.key === currentRouterKey) return superiorKeys;

			if (conf.children) {
				return findKey(conf.children, [...superiorKeys, conf.key]);
			}
		}

		return superiorKeys;
	};
	return findKey(routerConfig);
};
