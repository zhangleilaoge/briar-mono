import { IModel } from './model';

export enum LogTypeEnum {
	Info = 'info',
	Warning = 'warning',
	Error = 'error'
}

/** @description 日志来源 */
export enum LogFromEnum {
	User = 'user',
	System = 'system'
}

export type ILogDTO = IModel<{
	userId?: number;
	type: LogTypeEnum;
	content: string;
	ip?: string;
}>;
