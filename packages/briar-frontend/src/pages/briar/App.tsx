import { ConfigProvider, Menu, Spin } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Suspense } from 'react';
import { Routes } from 'react-router-dom';

import FloatBtn from './components/FloatBtn';
import Profile from './components/profile';
import { DEFAULT_MENU_KEY, MenuKeyEnum, ROUTER_CONFIG } from './constants/router';
import { THEME } from './constants/styles';
import CommonContext from './context/common';
import useFullScreen from './hooks/biz/useFullScreen';
import useLevelPath from './hooks/biz/useLevelPath';
import useLogin from './hooks/biz/useLogin';
import usePageTitle from './hooks/biz/usePageTitle';
import useRouteHistory from './hooks/useRouteHistory';
import s from './styles/main.module.scss';
import { getRoutes } from './utils/router';

function App() {
	const { menuKey, onLevelPathChange } = useLevelPath();
	usePageTitle();
	const { fullRef, enterFullscreen, exitFullscreen, toggleFullscreen } = useFullScreen();
	const { userInfo, headerRoutes, availablePage, logout } = useLogin();
	useRouteHistory();

	return (
		<ConfigProvider theme={THEME}>
			<CommonContext.Provider
				value={{
					availablePage,
					userInfo,
					fullRef,
					enterFullscreen,
					exitFullscreen,
					toggleFullscreen,
					logout
				}}
			>
				<FloatBtn />
				<Header className={s.Header}>
					<img src={'https://static.stardew.site/Abigail-Dev_Update_12.gif'} className={s.Briar} />
					<div className={s.HeaderRight}>
						<Menu
							mode="horizontal"
							selectedKeys={[menuKey]}
							items={headerRoutes}
							onClick={({ key }) => onLevelPathChange(key)}
							className={s.Menu}
							theme={'light'}
						/>
						<Profile />
					</div>
				</Header>
				<Suspense
					fallback={
						<div className={s.SuspenseSpin}>
							<Spin size="large" />
						</div>
					}
				>
					<Routes>
						{getRoutes(ROUTER_CONFIG, availablePage, DEFAULT_MENU_KEY[MenuKeyEnum.Briar_0])}
					</Routes>
				</Suspense>
			</CommonContext.Provider>
		</ConfigProvider>
	);
}

export default App;
