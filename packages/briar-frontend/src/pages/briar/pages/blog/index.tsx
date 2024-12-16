import { Layout, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import cx from 'classnames';
import { Suspense, useContext, useMemo } from 'react';
import { Routes } from 'react-router-dom';

import Footer from '@/pages/briar/components/Footer';
import mainStyle from '@/pages/briar/styles/main.module.scss';

import { DEFAULT_MENU_KEY, MenuKeyEnum, ROUTER_CONFIG } from '../../constants/router';
import CommonContext from '../../context/common';
import { getRouterConfigByKey, getRoutes } from '../../utils/router';
import Menu from './components/menu';
import useMenu from './components/menu/useMenu';

const Blog = () => {
	const { fullRef, availablePage } = useContext(CommonContext);

	const routers = useMemo(() => {
		return getRouterConfigByKey(MenuKeyEnum.Blog_1, ROUTER_CONFIG)?.children;
	}, []);
	const { menus } = useMenu();

	return (
		<Layout>
			<Layout className="mx-[120px] mt-[24px] flex flex-row gap-[24px]">
				<Menu menus={menus} />
				<Content className={cx('shrink-1 p-[24px]  bg-white rounded-[8px]')} ref={fullRef}>
					<Suspense
						fallback={
							<div className={mainStyle.SuspenseSpin}>
								<Spin size="large" />
							</div>
						}
					>
						<Routes>
							{getRoutes(routers, availablePage, DEFAULT_MENU_KEY[MenuKeyEnum.Blog_1])}
						</Routes>
					</Suspense>
				</Content>
			</Layout>
			<Footer />
		</Layout>
	);
};

export default Blog;
