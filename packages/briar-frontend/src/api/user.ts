import { IUserInfo } from 'briar-shared';
import alovaInstance from './common';

export const createAnonymousUser = () =>
	alovaInstance.Post<IUserInfo>('/user/createAnonymousUser');
