import { CLIENT_ID, IUserAccess, IUserInfoDTO } from 'briar-shared';
import { gapi } from 'gapi-script';
import { useCallback, useEffect, useState } from 'react';

import { createAnonymousUser as createAnonymousUserApi, getUserInfo } from '@/pages/briar/api/user';
import { LocalStorageKey } from '@/pages/briar/constants/env';

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
	}, 100);
};

const useLogin = () => {
	const [userInfo, setUserInfo] = useState<IUserInfoDTO>(DEFAULT_USER_INFO);
	const [availablePage, setAvailablePage] = useState<string[]>([]);

	const init = async () => {
		let {
			accessToken,
			userInfo,
			availablePage = []
		} = await getUserInfo().catch(() => ({}) as IUserAccess);

		if (!userInfo?.id) {
			const data = await createAnonymousUserApi();
			userInfo = data.userInfo;
			accessToken = data.accessToken;
			availablePage = data.availablePage || [];
		}

		localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
		setAvailablePage(availablePage);
		setUserInfo(userInfo);
		hideLoading();
	};

	useEffect(() => {
		const initClient = () => {
			gapi.client.init({
				clientId: CLIENT_ID,
				scope: ''
			});
		};
		gapi.load('client:auth2', initClient);

		init();
	}, []);

	const logout = useCallback(async () => {
		localStorage.removeItem(LocalStorageKey.AccessToken);

		setUserInfo(DEFAULT_USER_INFO);

		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}, []);

	return {
		userInfo,
		availablePage,
		setUserInfo,
		logout
	};
};

export default useLogin;
