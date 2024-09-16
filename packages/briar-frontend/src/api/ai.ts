import { IChatRequestParams, IConversationDTO, IMessageDTO } from 'briar-shared';
import alovaInstance, { getQueryFromObj } from './common';
import { ICreateImgResponse } from 'briar-shared';
// export const chatRequest = (params: IChatRequestParams) =>
// 	alovaInstance.Post<OpenAI.Chat.Completions.ChatCompletion>('/ai/chatRequest', params);

export const chatRequestStream = (params: IChatRequestParams) =>
	alovaInstance.Get(`/ai/chatRequestStream?${getQueryFromObj(params)}`);

export const getConversationList = () =>
	alovaInstance.Get<IConversationDTO[]>(`/ai/getConversationList`);

export const createConversation = ({ title = '' }) =>
	alovaInstance.Post<IConversationDTO>(`/ai/createConversation`, { title });

export const deleteConversation = ({ ids }: { ids: number[] }) =>
	alovaInstance.Post(`/ai/deleteConversation`, { ids });

export const updateConversation = (conversation: Partial<IConversationDTO>) =>
	alovaInstance.Post(`/ai/updateConversation`, conversation);

export const findMessagesByConversationId = (conversationId: number) =>
	alovaInstance.Get<IMessageDTO[]>(
		`/ai/findMessagesByConversationId?conversationId=${conversationId}`
	);

export const createMessage = (params: Partial<IMessageDTO>) =>
	alovaInstance.Post<IMessageDTO>(`/ai/createMessage`, params);

export const updateMessage = (message: Partial<IMessageDTO>) =>
	alovaInstance.Post(`/ai/updateMessage`, message);

export const chatToCreateImg = (params: { content: string }) =>
	alovaInstance.Post<ICreateImgResponse>(`/ai/chatToCreateImg`, params, {
		timeout: 60000
	});
