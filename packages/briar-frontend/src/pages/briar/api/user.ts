import { IUserAccess, IUserInfoDTO } from 'briar-shared';
import alovaInstance from './common';

export const createAnonymousUser = () =>
	alovaInstance.Post<IUserAccess>('/user/createAnonymousUser');

export const getUserInfo = () => alovaInstance.Get<IUserAccess>(`/user/getUserInfo`);

export const authenticateUserByGoogle = (googleAccessToken: string) =>
	alovaInstance.Post<string | false>(`/user/authenticateUserByGoogle`, {
		googleAccessToken
	});

export const checkUsername = (username: string) =>
	alovaInstance.Get<boolean>(`/user/checkUsername?username=${username}`);

export const signUp = (userInfo: Partial<IUserInfoDTO>) =>
	alovaInstance.Post<IUserAccess>(`/user/signUp`, userInfo);

export const signIn = (userInfo: Partial<IUserInfoDTO>) =>
	alovaInstance.Post<IUserAccess>(`/user/signIn`, userInfo);
