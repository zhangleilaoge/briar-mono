import { StardewValleyGirl } from './common';
import { IModel } from './model';

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

export declare enum BrainModelEnum {
	/** 时间步长循环神经网络可以记住并预测未来值 */
	LSTM = 'LSTM',
	/** 循环神经网络可以记住，并且具有有限的结果集 */
	RNN = 'RNN',
	/** 前馈神经网络可以很好地对简单事物进行分类，但它不记得之前的动作，并且结果变化无穷 */
	NeuralNetwork
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

export type IBrainModelDTO = IModel<{
	userId: number;
	isPrivate: boolean;
	url: string;
	type: BrainModelEnum;
	config: string;
	name: string;
}>;

export type ITrainData = string[] | { input: string; output: string }[];

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
