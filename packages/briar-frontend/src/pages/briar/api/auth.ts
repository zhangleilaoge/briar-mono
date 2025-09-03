import alovaInstance from './common';

export const login = (params: { username: string; password: string }) =>
	alovaInstance.Post<{ accessToken: string }>(`/auth/login`, params);
