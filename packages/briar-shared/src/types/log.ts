import { IModel } from './model';

export enum LogTypeEnum {
	Info = 'Info',
	Warning = 'Warning',
	Error = 'Error'
}

/** @description 日志来源 */
export enum LogFromEnum {
	User = 'user',
	System = 'system'
}

export enum LogModuleEnum {
	GenerateImg = '图片生成',
	ShortUrl = '短链服务',
	AiChat = 'AI对话',
	ScheduleTask = '定时任务',
	RequestMiddleware = '请求中间件'
}

export interface ILogParams {
	content: string;
	module: LogModuleEnum;
	type?: LogTypeEnum;
}

export type ILogDTO = IModel<{
	userId?: number;
	type: LogTypeEnum;
	content: string;
	ip?: string;
}>;
