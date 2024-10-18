import { ConfigProvider, Menu, Spin } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { UrlEnum } from 'briar-shared';
import { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import FloatBtn from './components/FloatBtn';
import Profile from './components/profile';
import { MENU_ROUTER_CONFIG, MenuKeyEnum } from './constants/router';
import { THEME } from './constants/styles';
import CommonContext from './context/common';
import useFullScreen from './hooks/useFullScreen';
import useLevelPath from './hooks/useLevelPath';
import useLogin from './hooks/useLogin';
import s from './styles/main.module.scss';
import { getRoutes } from './utils/router';

const NotFoundRedirect = ({ fullUrl }: { fullUrl: string }) => {
	useEffect(() => {
		window.location.href = fullUrl;
	}, [fullUrl]);

	return null; // 组件不渲染任何内容
};

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
					<img
						src={
							'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Abigail-Dev_Update_12.gif'
						}
						className={s.Briar}
					/>
					<div className={s.HeaderRight}>
						<Menu
							mode="horizontal"
							selectedKeys={[menuKey]}
							items={MENU_ROUTER_CONFIG}
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
						{getRoutes(MENU_ROUTER_CONFIG, MenuKeyEnum.Tools)}
						<Route path="/*" element={<NotFoundRedirect fullUrl={UrlEnum.NotFound} />} />
					</Routes>
				</Suspense>
			</CommonContext.Provider>
		</ConfigProvider>
	);
}

export default App;
