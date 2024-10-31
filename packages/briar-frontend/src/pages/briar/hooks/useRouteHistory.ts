import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getUrlParams, QueryKeyEnum } from '@/pages/briar/utils/url';

const useRouteHistory = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [hrefHistory, setHrefHistory] = useState<string[]>([]);

	useEffect(() => {
		setHrefHistory((history) => {
			const previousHref = history?.[history.length - 1];
			if (previousHref === window.location.href) return history;
			return [...history, window.location.href];
		});
	}, [location]);

	// 自动带参 displayMode
	useEffect(() => {
		const currentHref = hrefHistory?.[hrefHistory.length - 1];
		const oldHref = hrefHistory?.[hrefHistory.length - 2];

		if (currentHref !== window.location.href || !oldHref) return;

		const oldDisplayMode = getUrlParams(oldHref)?.[QueryKeyEnum.DisplayMode];
		const newDisplayMode = getUrlParams(currentHref)?.[QueryKeyEnum.DisplayMode];

		if (oldDisplayMode && !newDisplayMode) {
			const url = new URL(currentHref);

			url.searchParams.set(QueryKeyEnum.DisplayMode, oldDisplayMode);
			navigate(`${url.pathname}${url.search}`);
		}
	}, [hrefHistory, navigate]);

	return {
		hrefHistory
	};
};

export default useRouteHistory;
