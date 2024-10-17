import { IModel } from './model';

export enum LogTypeEnum {
	Info = 'info',
	Warning = 'warning',
	Error = 'error'
}

export type ILogDTO = IModel<{
	userId: number;
	type: LogTypeEnum;
	content: string;
	ip: string;
}>;
