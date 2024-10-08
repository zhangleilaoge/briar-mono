import { Layout, Menu, Spin, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { Suspense, useContext, useMemo } from 'react';
import { Routes } from 'react-router-dom';

import Footer from '@/components/Footer';
import { SETTINGS_ROUTER_CONFIG, SettingsPathKeyEnum } from '@/constants/router';
import CommonContext from '@/context/common';
import useLevelPath from '@/hooks/useLevelPath';
import useSider from '@/hooks/useSider';
import mainStyle from '@/styles/main.module.scss';
import { findSuperiorRouterConfig, getRoutes } from '@/utils/router';

function Settings() {
	const { isCollapsed, setIsCollapsed } = useSider();
	const { fullScreenInfo } = useContext(CommonContext);
	const {
		token: { colorBgContainer, borderRadiusLG }
	} = theme.useToken();

	const { menuKey, onLevelPathChange } = useLevelPath(2);

	const defaultOpenKeys = useMemo(() => {
		return findSuperiorRouterConfig(menuKey, SETTINGS_ROUTER_CONFIG);
	}, [menuKey]);

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
					items={SETTINGS_ROUTER_CONFIG}
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
						<Routes>{getRoutes(SETTINGS_ROUTER_CONFIG, SettingsPathKeyEnum.Dosage)}</Routes>
					</Suspense>
				</Content>
				<Footer />
			</div>
		</Layout>
	);
}

export default Settings;