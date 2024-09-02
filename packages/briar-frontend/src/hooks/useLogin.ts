import { isDev, LocalStorageKey } from '@/constants/env';
import { clientId } from '@/constants/user';
import { safeJsonParse, IUserInfo } from 'briar-shared';
import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import { createAnonymousUser as createAnonymousUserApi } from '@/api/user';
import Cookies from 'js-cookie';

const useLogin = () => {
	const [userInfo, setUserInfo] = useState<IUserInfo>({
		id: 0,
		createdAt: '',
		updatedAt: ''
	});

	const createAnonymousUser = async () => {
		const data = await createAnonymousUserApi();
		setUserInfo(data);
		localStorage.setItem(LocalStorageKey.userInfo, JSON.stringify(data));
    if(isDev){
      Cookies.set('userId', data.id);
    }
	};

	useEffect(() => {
		const initClient = () => {
			gapi.client.init({
				clientId,
				scope: ''
			});
		};
		gapi.load('client:auth2', initClient);

		const initUserInfo = safeJsonParse(localStorage.getItem(LocalStorageKey.userInfo) || '{}');

		if (!initUserInfo.id) {
			createAnonymousUser();
		} else setUserInfo(initUserInfo);
	}, []);

	return {
		userInfo,
		setUserInfo
	};
};

export default useLogin;
