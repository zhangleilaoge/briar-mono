import { ConfigProvider, Menu, Spin } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import FloatBtn from './components/FloatBtn';
import Profile from './components/profile';
import { BRIAR_ICON } from './constants/img';
import { MENU_ROUTER_CONFIG, MenuKeyEnum } from './constants/router';
import { THEME } from './constants/styles';
import CommonContext from './context/common';
import useFullScreen from './hooks/useFullScreen';
import useLevelPath from './hooks/useLevelPath';
import useLogin from './hooks/useLogin';
import Page404 from './pages/404';
import s from './styles/main.module.scss';
import { getRoutes } from './utils/router';

function App() {
	const { menuKey, onLevelPathChange } = useLevelPath();
	const { fullScreen, HeaderClass, SiderClass, LayoutClass, inFullScreen, outFullScreen } =
		useFullScreen();
	const { userInfo, logout } = useLogin();

	return (
		<ConfigProvider theme={THEME}>
			<CommonContext.Provider
				value={{
					fullScreenInfo: {
						fullScreen,
						SiderClass,
						LayoutClass
					},
					userInfo,
					inFullScreen,
					outFullScreen,
					logout
				}}
			>
				<FloatBtn />
				<Header className={HeaderClass}>
					<img src={BRIAR_ICON} className={s.Briar} />
					<div className={s.HeaderRight}>
						<Menu
							mode="horizontal"
							selectedKeys={[menuKey]}
							items={MENU_ROUTER_CONFIG.filter(({ hide }) => !hide)}
							onClick={({ key }) => onLevelPathChange(key as MenuKeyEnum)}
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
						{getRoutes(MENU_ROUTER_CONFIG, MenuKeyEnum.Tools)}
						<Route path="/404" Component={Page404} />
						<Route path="*" element={<Navigate to="/404" replace />} />
					</Routes>
				</Suspense>
			</CommonContext.Provider>
		</ConfigProvider>
	);
}

export default App;
