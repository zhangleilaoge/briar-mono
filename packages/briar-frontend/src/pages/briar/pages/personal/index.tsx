import { Layout, Menu, Spin, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { Suspense, useContext, useMemo } from 'react';
import { Routes } from 'react-router-dom';

import Footer from '@/pages/briar/components/Footer';
import { DEFAULT_MENU_KEY, MenuKeyEnum, ROUTER_CONFIG } from '@/pages/briar/constants/router';
import CommonContext from '@/pages/briar/context/common';
import useLevelPath from '@/pages/briar/hooks/biz/useLevelPath';
import useSider from '@/pages/briar/hooks/biz/useSider';
import mainStyle from '@/pages/briar/styles/main.module.scss';
import {
	findSuperiorRouterConfig,
	getAvailableRoutes,
	getRouterConfigByKey,
	getRoutes
} from '@/pages/briar/utils/router';
function Admin() {
	const { isCollapsed, setIsCollapsed } = useSider();
	const { fullScreenInfo, availablePage } = useContext(CommonContext);
	const {
		token: { colorBgContainer, borderRadiusLG }
	} = theme.useToken();

	const { menuKey, onLevelPathChange } = useLevelPath(2);

	const defaultOpenKeys = useMemo(() => {
		const key =
			findSuperiorRouterConfig(menuKey, ROUTER_CONFIG) || DEFAULT_MENU_KEY[MenuKeyEnum.Personal_1];

		return [key];
	}, [menuKey]);

	const routers = useMemo(() => {
		return getRouterConfigByKey(MenuKeyEnum.Personal_1, ROUTER_CONFIG)?.children;
	}, []);

	return (
		<Layout>
			<Sider
				className={fullScreenInfo.SiderClass}
				width={240}
				collapsible
				collapsed={isCollapsed}
				onCollapse={(value) => setIsCollapsed(value)}
			>
				<Menu
					mode="inline"
					selectedKeys={[menuKey]}
					defaultOpenKeys={defaultOpenKeys}
					className={mainStyle.SiderMenu}
					items={getAvailableRoutes(routers, availablePage)}
					onClick={({ key }) => onLevelPathChange(key)}
				/>
			</Sider>
			<div className={fullScreenInfo.LayoutClass}>
				<Content
					style={{
						padding: 24,
						margin: 0,
						minHeight: 280,
						background: colorBgContainer,
						borderRadius: borderRadiusLG
					}}
				>
					<Suspense
						fallback={
							<div className={mainStyle.SuspenseSpin}>
								<Spin size="large" />
							</div>
						}
					>
						<Routes>
							{getRoutes(routers, availablePage, DEFAULT_MENU_KEY[MenuKeyEnum.Personal_1])}
						</Routes>
					</Suspense>
				</Content>
				<Footer />
			</div>
		</Layout>
	);
}

export default Admin;
