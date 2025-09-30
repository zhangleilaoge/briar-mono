import { axiosInstance } from './axios';

export const login = (params: { username: string; password: string }) =>
	axiosInstance.post<{ accessToken: string }>(`/auth/login`, params);
