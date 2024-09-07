import { CLIENT_ID, IUserInfoDTO } from 'briar-shared';
import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import { createAnonymousUser as createAnonymousUserApi, getUserInfo } from '@/api/user';

const useLogin = () => {
	const [userInfo, setUserInfo] = useState<IUserInfoDTO>({
		id: 0,
		createdAt: '',
		updatedAt: ''
	});

	const init = async () => {
		const userData = await getUserInfo();
		if (userData) {
			setUserInfo(userData);
			return;
		}

		const newUserData = await createAnonymousUserApi();
		setUserInfo(newUserData);
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

	return {
		userInfo,
		setUserInfo
	};
};

export default useLogin;
