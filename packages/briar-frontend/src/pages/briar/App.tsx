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
import s from './styles/main.module.scss';
import { getRoutes } from './utils/router';

function App() {
	const { menuKey, onLevelPathChange, goBack } = useLevelPath();
	usePageTitle();
	const { fullRef, toggleFullscreen } = useFullScreen();
	const { userInfo, headerRoutes, availablePage, logout } = useLogin();

	return (
		<ConfigProvider theme={THEME}>
			<CommonContext.Provider
				value={{
					availablePage,
					userInfo,
					fullRef,
					toggleFullscreen,
					logout,
					goBack
				}}
			>
				<FloatBtn />
				<Header className={s.Header}>
					<img src={'https://briar-shanghai-1309736035.cos.ap-shanghai.myqcloud.com/Abigail-Dev_Update_12.gif'} className={s.Briar} />
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
