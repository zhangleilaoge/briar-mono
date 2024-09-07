import {
	IChatRequestParams,
	IConversationDTO,
	ICreateMessageParams,
	IMessageDTO
} from 'briar-shared';
import alovaInstance, { getQueryFromObj } from './common';

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

export const createMessage = (params: ICreateMessageParams) =>
	alovaInstance.Post<IMessageDTO>(`/ai/createMessage`, params);

export const updateMessage = (message: Partial<IMessageDTO>) =>
	alovaInstance.Post(`/ai/updateMessage`, message);
