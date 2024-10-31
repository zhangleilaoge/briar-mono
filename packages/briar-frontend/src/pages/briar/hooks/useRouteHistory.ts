import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// 记录页面历史
const useRouteHistory = () => {
	const location = useLocation();
	const [hrefHistory, setHrefHistory] = useState<string[]>([]);

	useEffect(() => {
		setHrefHistory((history) => {
			const previousHref = history?.[history.length - 1];
			if (previousHref === window.location.href) return history;
			return [...history, window.location.href];
		});
	}, [location]);

	return {
		hrefHistory
	};
};

export default useRouteHistory;
