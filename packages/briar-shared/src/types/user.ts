import { IModel } from './model';

export enum AbilityEnum {
	Chat = 1,
	CreateImg = 2
}

export enum CycleEnum {
	day = 1,
	week = 7,
	month = 30,
	year = 365,
	forever = 999
}

export enum DurationEnum {
	relative = 'relative',
	cycle = 'cycle'
}

export interface IAbilityUsageRule {
	/** 统计时间范围类型 */
	durationType: DurationEnum;
	/** 统计相对时间范围（单位秒），durationType 为 relative 时生效 */
	relativeDuration?: number;
	/** 统计周期时间范围类型，durationType 为 cycle 时生效*/
	cycleDuration?: CycleEnum;
	/** 统计时间范围内触发次数限制 */
	points: number;
}

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
