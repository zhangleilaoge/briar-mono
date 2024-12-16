import { useContext } from 'react';

import { MenuKeyEnum, ROUTER_CONFIG } from '@/pages/briar/constants/router';
import CommonContext from '@/pages/briar/context/common';
import { getRouterConfigByKey } from '@/pages/briar/utils/router';

const useMenu = () => {
	const { availablePage } = useContext(CommonContext);
	const menus =
		getRouterConfigByKey(MenuKeyEnum.Blog_1, ROUTER_CONFIG)?.children?.filter((item) =>
			availablePage.includes(item.key)
		) || [];

	return {
		menus
	};
};

export default useMenu;
