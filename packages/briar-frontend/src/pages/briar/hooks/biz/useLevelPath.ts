import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getLevelPath } from '@/pages/briar/utils/router';

import useRouteHistory from '../useRouteHistory';

// 根目录进入时的menu初始化
const useLevelPath = (level = 1) => {
	const [menuKey, setMenuKey] = useState(getLevelPath(level));
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { hrefHistory } = useRouteHistory();

	const onLevelPathChange = (key: string) => {
		if (key === menuKey) return;
		setMenuKey(key);

		// 如果存在 key 相关的历史访问页面，进入相应页面，而非进入 key 根页面而后走自动重定向进入子页面
		const historyHref = hrefHistory
			.slice()
			.reverse()
			.find((history) => history.indexOf(`/${key}/`) !== -1);

		if (historyHref) {
			navigate(historyHref.split('/briar')[1]);
			return;
		}

		navigate(key);
	};

	useEffect(() => {
		setMenuKey(getLevelPath(level));
	}, [level, pathname]);

	return {
		menuKey,
		onLevelPathChange
	};
};

export default useLevelPath;
