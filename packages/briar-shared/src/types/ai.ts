import { IModel } from './model';

export enum StardewValleyGirl {
	Abigail = 'Abigail',
	Caroline = 'Caroline',
	Emily = 'Emily',
	Haley = 'Haley',
	Penny = 'Penny',
	Robin = 'Robin'
}

export enum ChatRoleEnum {
	System = 'system',
	User = 'user',
	Assistant = 'assistant'
}

export type IMessageDTO = IModel<{
	role: ChatRoleEnum;
	content: string;
	conversationId: number;
	model: string;
	imgList?: string[];
}>;

export type IConversationDTO = IModel<{
	model: string;
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
	model: string;
	imgList?: string[];
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

export interface IConversationModels {
	id: string;
}
