import { message } from 'antd';
import { CLIENT_ID, IUserAccess, IUserInfoDTO } from 'briar-shared';
import { gapi } from 'gapi-script';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { createAnonymousUser as createAnonymousUserApi, getUserInfo } from '@/pages/briar/api/user';
import { LocalStorageKey } from '@/pages/briar/constants/env';

import { ROUTER_CONFIG } from '../../constants/router';
import { getAvailablePages, removeChildren } from '../../utils/router';

interface IProps {
	needCreateUser?: boolean;
}

const DEFAULT_USER_INFO = {
	id: 0,
	createdAt: '',
	updatedAt: '',
	roles: []
};

const hideLoading = () => {
	const loadingScreen = document.getElementById('loading-screen');

	setTimeout(() => {
		loadingScreen && (loadingScreen.style.display = 'none');
	}, 200);
};

const useLogin = ({ needCreateUser = true }: IProps) => {
	const [userInfo, setUserInfo] = useState<IUserInfoDTO>(DEFAULT_USER_INFO);
	const [availablePage, setAvailablePage] = useState<string[]>([]);
	const [initialized, setInitialized] = useState(false);

	const init = useCallback(async () => {
		let {
			accessToken,
			userInfo,
			availablePage: availablePages = []
		} = await getUserInfo().catch(() => ({}) as IUserAccess);

		if (!needCreateUser && !userInfo?.id) {
			setInitialized(true);
			return;
		}

		if (!userInfo?.id) {
			if (localStorage.getItem(LocalStorageKey.AccessToken)) {
				message.warning('登录过期，已自动退出登录。');
			}

			const data = await createAnonymousUserApi();
			userInfo = data.userInfo;
			accessToken = data.accessToken;
			availablePages = data.availablePage || [];
		}

		localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
		const accessPages = getAvailablePages(ROUTER_CONFIG, availablePages);
		setAvailablePage(accessPages);
		setUserInfo(userInfo);

		hideLoading();
		setInitialized(true);
	}, [needCreateUser]);

	useEffect(() => {
		const initClient = () => {
			gapi.client.init({
				clientId: CLIENT_ID,
				scope: ''
			});
		};
		gapi.load('client:auth2', initClient);

		init();
	}, [init]);

	const logout = useCallback(async () => {
		localStorage.removeItem(LocalStorageKey.AccessToken);

		setUserInfo(DEFAULT_USER_INFO);

		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}, []);

	const headerRoutes = useMemo(() => {
		return removeChildren(
			ROUTER_CONFIG.filter((item) => availablePage.includes(item.key) && !item.hideInNav)
		);
	}, [availablePage]);

	return {
		userInfo,
		availablePage,
		initialized,
		headerRoutes,
		setUserInfo,
		logout
	};
};

export default useLogin;
