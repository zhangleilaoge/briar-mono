import { safeJsonParse } from 'briar-shared';
import { useEffect, useState } from 'react';

import { LocalStorageKey } from '@/constants';

const useSider = () => {
	const [isCollapsed, _setIsCollapsed] = useState(
		safeJsonParse(localStorage.getItem(LocalStorageKey.Sider) || 'false') || false
	);
	const [needUpdate, setNeedUpdate] = useState(false);

	useEffect(() => {
		if (!needUpdate) {
			return;
		}
		localStorage.setItem(LocalStorageKey.Sider, JSON.stringify(isCollapsed));
		setNeedUpdate(false);
	}, [isCollapsed, needUpdate]);

	const setIsCollapsed = (_isCollapsed: boolean) => {
		_setIsCollapsed(_isCollapsed);
		setNeedUpdate(true);
	};

	return { isCollapsed, setIsCollapsed };
};

export default useSider;
