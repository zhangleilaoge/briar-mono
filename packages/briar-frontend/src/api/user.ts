import { IUserInfoDTO } from 'briar-shared';
import alovaInstance from './common';

export const createAnonymousUser = () =>
	alovaInstance.Post<IUserInfoDTO>('/user/createAnonymousUser');

export const getUserInfo = () => alovaInstance.Get<IUserInfoDTO>(`/user/getUserInfo`);

export const authenticateUserByGoogle = (tokenId: string) =>
	alovaInstance.Post<boolean>(`/user/authenticateUserByGoogle`, {
		tokenId
	});

export const logout = () => alovaInstance.Post(`/user/logout`);
