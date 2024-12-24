import { IPageInfo, ISortInfo } from './common';
import { IModel } from './model';

export enum AbilityEnum {
	Chat = 1,
	CreateImg = 2
}

export enum RoleEnum {
	Admin = 1,
	Manager = 2,
	Traveler = 3,
	Registered = 4
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
	roles: Array<number>;
	mobile?: string;
}>;

export type IRoleDTO = IModel<{
	name: string;
	desc: string;
	menuKeys: Array<string>;
}>;

// ====================== response below ========================
export interface IUserAccess {
	userInfo: IUserInfoDTO;
	accessToken: string;
	availablePage?: string[];
}

export interface IRolesWithUserCount extends IRoleDTO {
	userCount: number;
}

export type IGetUserListParams = ISortInfo &
	IPageInfo & {
		keyword: string;
		roles: number[];
	};

export interface ICheckUsername {
	alreadyExists: boolean;
}
