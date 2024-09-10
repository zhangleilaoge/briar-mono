import { CLIENT_ID, IUserInfoDTO } from 'briar-shared';
import { gapi } from 'gapi-script';
import { useCallback, useEffect, useState } from 'react';
import {
	createAnonymousUser as createAnonymousUserApi,
	getUserInfo,
	logout as logoutApi
} from '@/api/user';
import { LocalStorageKey } from '@/constants/env';

const useLogin = () => {
	const [userInfo, setUserInfo] = useState<IUserInfoDTO>({
		id: 0,
		createdAt: '',
		updatedAt: ''
	});

	const init = async () => {
		const userInfo = await getUserInfo();
		if (userInfo.id) {
			setUserInfo(userInfo);
			return;
		}

		const { userInfo: newUserInfo, accessToken } = await createAnonymousUserApi();

		localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
		setUserInfo(newUserInfo);
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
		await logoutApi();

		setUserInfo({
			id: 0,
			createdAt: '',
			updatedAt: ''
		});

		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}, []);

	return {
		userInfo,
		setUserInfo,
		logout
	};
};

export default useLogin;
