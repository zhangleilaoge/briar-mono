import { message } from 'antd';
import { BRIAR_BASENAME } from 'briar-shared';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// 记录页面历史
const useRouteHistory = () => {
	const location = useLocation();
	const [hrefHistory, setHrefHistory] = useState<string[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		setHrefHistory((history) => {
			const previousHref = history?.[history.length - 1];
			if (previousHref === window.location.href) return history;
			return [...history, window.location.href];
		});
	}, [location]);

	const goBack = () => {
		setHrefHistory((history) => {
			if (history.length > 1) {
				// Remove the most recent href and get the previous one
				const previousHref = history[history.length - 2];

				history.pop(); // Remove current href
				navigate(previousHref.split(BRIAR_BASENAME)[1]); // Navigate to the previous href
			} else {
				message.warning('上一页不存在');
			}
			return [...history]; // Return the updated history
		});
	};

	return {
		hrefHistory,
		goBack
	};
};

export default useRouteHistory;
