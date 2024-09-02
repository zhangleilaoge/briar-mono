import { IChatRequestParams, IConversation, ICreateConversationParams } from 'briar-shared';
import alovaInstance, { getQueryFromObj } from './common';
import OpenAI from 'openai';

export const chatRequest = (params: IChatRequestParams) =>
	alovaInstance.Post<OpenAI.Chat.Completions.ChatCompletion>('/ai/chatRequest', params);

export const chatRequestStream = (params: IChatRequestParams) =>
	alovaInstance.Get(`/ai/chatRequestStream?${getQueryFromObj(params)}`);

export const getConversationList = () =>
	alovaInstance.Get<IConversation[]>(`/ai/getConversationList`);

export const createConversation = (params: ICreateConversationParams) =>
	alovaInstance.Post<{
		conversation: IConversationDTO;
		messages: IMessage[];
	}>(`/ai/createConversation`, params);
