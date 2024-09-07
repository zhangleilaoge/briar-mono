import { IModel } from './model';

export enum RoleEnum {
	System = 'system',
	User = 'user',
	Assistant = 'assistant'
}

export enum ModelEnum {
	Gpt4oMini = 'gpt-4o-mini',
	Gpt4o = 'gpt-4o'
}

export type IMessageDTO = IModel<{
	role: RoleEnum;
	content: string;
	conversationId: number;
	model: ModelEnum;
}>;

export type IConversationDTO = IModel<{
	model: ModelEnum;
	title?: string;
	userId: number;
}>;

// ====================== request params below ========================
export interface IChatRequestParams {
	query: string;
	conversationId?: number;
	model: ModelEnum;
}

export interface ICreateMessageParams {
	content: string;
	conversationId: number;
	model: ModelEnum;
	role: RoleEnum;
}
