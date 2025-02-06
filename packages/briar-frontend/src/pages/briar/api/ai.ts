import {
	IChatRequestParams,
	IConversationDTO,
	IConversationModels,
	ICreateImgResponse,
	IGetMessagesParams,
	IMessageDTO,
	IMessagesResult
} from 'briar-shared';

import alovaInstance, { getQueryFromObj } from './common';
// export const chatRequest = (params: IChatRequestParams) =>
// 	alovaInstance.Post<OpenAI.Chat.Completions.ChatCompletion>('/ai/chatRequest', params);

export const chatRequestStream = (params: IChatRequestParams) =>
	alovaInstance.Get(`/ai/chatRequestStream?${getQueryFromObj(params)}`);

export const getConversationModels = () =>
	alovaInstance.Get<IConversationModels[]>(`/ai/getConversationModels`);

export const getConversationList = () =>
	alovaInstance.Get<IConversationDTO[]>(`/ai/getConversationList`);

export const createConversation = ({ title = '' }) =>
	alovaInstance.Post<IConversationDTO>(`/ai/createConversation`, { title });

export const deleteConversation = ({ ids }: { ids: number[] }) =>
	alovaInstance.Post(`/ai/deleteConversation`, { ids });

export const updateConversation = (conversation: Partial<IConversationDTO>) =>
	alovaInstance.Post(`/ai/updateConversation`, conversation);

export const getMessages = (params: IGetMessagesParams) =>
	alovaInstance.Get<IMessagesResult<IMessageDTO>>(`/ai/getMessages?${getQueryFromObj(params)}`);

export const createMessage = (params: Partial<IMessageDTO>) =>
	alovaInstance.Post<IMessageDTO>(`/ai/createMessage`, params);

export const updateMessage = (message: Partial<IMessageDTO>) =>
	alovaInstance.Post(`/ai/updateMessage`, message);

export const genImg = (params: { content: string }) =>
	alovaInstance.Post<ICreateImgResponse>(`/ai/genImg`, params, {
		timeout: 60000
	});
