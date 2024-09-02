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

export interface IMessage {
	role: RoleEnum;
	content: string;
	created: number;
}

export type IConversationDTO = IModel<{
	model: ModelEnum;
	title?: string;
	userId: number;
}>;

export type IConversation = IConversationDTO;

// ====================== request params below ========================
export interface IChatRequestParams {
	messages: IMessage[];
	model: ModelEnum;
}

export interface ICreateConversationParams {
	model: ModelEnum;
	messages: IMessage[];
}
