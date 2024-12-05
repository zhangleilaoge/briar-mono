import { useDebounceFn, useTitle } from 'ahooks';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { MENU_KEY_NAMES } from '../../constants/router';

const DEFAULT_TITLE = 'Briar';

const usePageTitle = () => {
	const [title, setTitle] = useState(DEFAULT_TITLE);
	const location = useLocation();
	useTitle(title);

	const { run } = useDebounceFn(
		(lastPathSegment: keyof typeof MENU_KEY_NAMES) => {
			const _title = `${DEFAULT_TITLE}${lastPathSegment ? ' - ' + MENU_KEY_NAMES?.[lastPathSegment] : ''}`;

			console.log('更新 title：', _title);
			setTitle(_title);
		},
		{
			wait: 100
		}
	);

	useEffect(() => {
		const path = location.pathname;
		const lastPathSegment = path.split('/').pop() as keyof typeof MENU_KEY_NAMES;

		run(lastPathSegment);
	}, [location, run]);
};

export default usePageTitle;
