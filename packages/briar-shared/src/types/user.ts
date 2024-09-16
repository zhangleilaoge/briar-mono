import { IModel } from './model';

export type IUserInfoDTO = IModel<{
	profileImg?: string;
	name?: string;
	email?: string;
	googleId?: string;
	isAuthenticated?: boolean;
	username?: string;
	password?: string;
}>;

// ====================== response below ========================
export interface IUserAccess {
	userInfo: IUserInfoDTO;
	accessToken: string;
}
