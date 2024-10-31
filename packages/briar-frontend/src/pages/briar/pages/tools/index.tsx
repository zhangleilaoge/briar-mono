import { Layout, Menu, Spin, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { Suspense, useContext, useMemo } from 'react';
import { Routes } from 'react-router-dom';

import Footer from '@/pages/briar/components/Footer';
import { MenuKeyEnum, ROUTER_CONFIG } from '@/pages/briar/constants/router';
import CommonContext from '@/pages/briar/context/common';
import useLevelPath from '@/pages/briar/hooks/useLevelPath';
import useSider from '@/pages/briar/hooks/useSider';
import mainStyle from '@/pages/briar/styles/main.module.scss';
import {
	findSuperiorRouterConfig,
	getRouterConfigByKey,
	getRoutes
} from '@/pages/briar/utils/router';

function CodeConverter() {
	const { isCollapsed, setIsCollapsed } = useSider();
	const { fullScreenInfo, availablePage } = useContext(CommonContext);
	const {
		token: { colorBgContainer, borderRadiusLG }
	} = theme.useToken();

	const { menuKey, onLevelPathChange } = useLevelPath(2);

	const defaultOpenKeys = useMemo(() => {
		const key = findSuperiorRouterConfig(menuKey, ROUTER_CONFIG);
		return key ? [key] : [];
	}, [menuKey]);

	const routers = useMemo(() => {
		return getRouterConfigByKey(MenuKeyEnum.Tools_1, ROUTER_CONFIG)?.children;
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
					items={routers}
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
							{getRoutes(routers, availablePage, MenuKeyEnum.CompositionStyleConverter_3)}
						</Routes>
					</Suspense>
				</Content>
				<Footer />
			</div>
		</Layout>
	);
}

export default CodeConverter;
