import { IModel } from './model';

export enum RoleEnum {
	System = 'system',
	User = 'user',
	Assistant = 'assistant'
}

export enum ModelEnum {
	Gpt4oMini = 'gpt-4o-mini',
	Gpt4o = 'gpt-4o',
	DallE3 = 'dall-e-3'
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
	marked?: boolean;
}>;

// ====================== request params below ========================
export interface IChatRequestParams {
	query: string;
	conversationId?: number;
	model: ModelEnum;
}

// ====================== response below ========================
export interface ICreateImgResponse {
	imgList: string[];
	imgDesc: string;
}
