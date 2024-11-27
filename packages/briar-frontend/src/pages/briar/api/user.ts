import {
	ICheckUsername,
	IGetUserListParams,
	IPageResult,
	IRoleDTO,
	IRolesWithUserCount,
	IUserAccess,
	IUserInfoDTO
} from 'briar-shared';

import alovaInstance, { getQueryFromObj } from './common';

export const createAnonymousUser = () =>
	alovaInstance.Post<IUserAccess>('/user/createAnonymousUser');

export const getUserInfo = () => alovaInstance.Get<IUserAccess>(`/user/getUserInfo`);

export const authenticateUserByGoogle = (googleAccessToken: string) =>
	alovaInstance.Post<string | false>(`/user/authenticateUserByGoogle`, {
		googleAccessToken
	});

export const getMiniprogramCode = () =>
	alovaInstance.Post<{
		imgBase64: string;
		code: string;
	}>(`/wx/getMiniprogramCode`);

export const getMiniprogramCodeStatus = () =>
	alovaInstance.Post<{
		imgCode: string;
	}>(`/wx/getMiniprogramCodeStatus`);

export const checkUsername = (username: string) =>
	alovaInstance.Get<ICheckUsername>(`/user/checkUsername?username=${username}`);

export const signUp = (userInfo: Partial<IUserInfoDTO>) =>
	alovaInstance.Post<IUserAccess>(`/user/signUp`, userInfo);

export const signIn = (userInfo: Partial<IUserInfoDTO>) =>
	alovaInstance.Post<IUserAccess>(`/user/signIn`, userInfo);

export const addRole = (role: Pick<IRoleDTO, 'name' | 'desc' | 'menuKeys'>) =>
	alovaInstance.Post(`/user/addRole`, role);

export const updateRole = (role: Pick<IRoleDTO, 'name' | 'desc' | 'menuKeys' | 'id'>) =>
	alovaInstance.Post(`/user/updateRole`, role);

export const getRoleList = () => alovaInstance.Get<IRolesWithUserCount[]>(`/user/getRoleList`);

export const getUserList = (data: IGetUserListParams) =>
	alovaInstance.Get<IPageResult<IUserInfoDTO>>(`/user/getUserList?${getQueryFromObj(data)}`);

export const updateUser = (role: Pick<IUserInfoDTO, 'id' | 'roles'>) =>
	alovaInstance.Post(`/user/updateUser`, role);

export const updateSelf = (role: Pick<IUserInfoDTO, 'name' | 'profileImg' | 'email'>) =>
	alovaInstance.Post(`/user/updateSelf`, role);
