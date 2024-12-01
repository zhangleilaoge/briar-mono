import { VerifyScene } from 'briar-shared';

import alovaInstance from './common';

export const sendVerifyCode4RetrievePassword = (email: string) =>
	alovaInstance.Post(`/user/sendVerifyCode4RetrievePassword`, {
		email
	});

export const checkVerifyCode = (data: { scene: VerifyScene; code: string; email: string }) =>
	alovaInstance.Post<{
		result: boolean;
	}>(`/verify/checkVerifyCode`, data);
