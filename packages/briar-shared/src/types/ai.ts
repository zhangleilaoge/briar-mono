import { IModel } from './model';

export enum StardewValleyGirl {
	Abigail = 'Abigail',
	Caroline = 'Caroline',
	Emily = 'Emily',
	Haley = 'Haley',
	Penny = 'Penny',
	Robin = 'Robin'
}

export enum RoleEnum {
	System = 'system',
	User = 'user',
	Assistant = 'assistant'
}

export enum ModelEnum {
	Gpt4oMini = 'gpt-4o-mini',
	Gpt4o = 'gpt-4o',
	DallE3 = 'dall-e-3',
	DallE2 = 'dall-e-2'
}

export type IMessageDTO = IModel<{
	role: RoleEnum;
	content: string;
	conversationId: number;
	model: ModelEnum;
	imgList?: string;
}>;

export type IConversationDTO = IModel<{
	model: ModelEnum;
	title?: string;
	userId: number;
	profile?: StardewValleyGirl;
	marked?: boolean;
	prompt?: string;
}>;

// ====================== request params below ========================
export interface IChatRequestParams {
	query: string;
	conversationId?: number;
	model: ModelEnum;
}

export interface IGetMessagesParams {
	conversationId: number;
	endTime?: number;
	pageSize?: number;
}

// ====================== response below ========================
export interface ICreateImgResponse {
	imgList: string[];
	imgDesc: string;
}

export interface IMessagesResult<T> {
	total: number;
	items: T[];
}
