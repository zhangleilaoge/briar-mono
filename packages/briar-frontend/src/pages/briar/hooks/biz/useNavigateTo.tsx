import { NavigateOptions, useNavigate as useReactNavigate } from 'react-router-dom';

import { MenuKeyEnum, ROUTER_CONFIG } from '../../constants/router';
import { findSuperiorRouterConfig, getRouterConfigByKey } from '../../utils/router';

const useNavigateTo = () => {
	const navigate = useReactNavigate();

	const navigateTo = ({
		target,
		options,
		query
	}: {
		target?: MenuKeyEnum;
		options?: NavigateOptions;
		query?: Record<string, string>;
	}) => {
		if (!target) {
			navigate(`/`, options);
			return;
		}

		const paths = [target];
		while (1) {
			const fatherKey = findSuperiorRouterConfig(target, ROUTER_CONFIG);

			if (!fatherKey) {
				break;
			}

			const father = getRouterConfigByKey(fatherKey, ROUTER_CONFIG);

			if (fatherKey) {
				// 跳过虚拟父节点
				father?.component && paths.unshift(fatherKey);
				target = fatherKey;
			} else {
				break;
			}
		}
		navigate(
			`/${paths.join('/')}${query ? `?${new URLSearchParams(query).toString()}` : ''}`,
			options
		);
	};

	return navigateTo;
};
export default useNavigateTo;
