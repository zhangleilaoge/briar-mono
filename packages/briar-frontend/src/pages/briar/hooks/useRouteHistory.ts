import { getUrlParams, QueryKeyEnum } from '@/pages/briar/utils/url';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// 暂时用不到
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

		const oldDisplayMode = getUrlParams(oldHref)?.[QueryKeyEnum.displayMode];
		const newDisplayMode = getUrlParams(currentHref)?.[QueryKeyEnum.displayMode];

		if (oldDisplayMode && !newDisplayMode) {
			const url = new URL(currentHref);

			url.searchParams.set(QueryKeyEnum.displayMode, oldDisplayMode);
			navigate(`${url.pathname}${url.search}`);
		}
	}, [hrefHistory, navigate]);

	return {
		hrefHistory
	};
};

export default useRouteHistory;
