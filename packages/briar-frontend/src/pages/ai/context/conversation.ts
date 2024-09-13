import { IConversationDTO, IMessageDTO } from 'briar-shared';
import React from 'react';

// 创建一个新的 Context
const ConversationContext = React.createContext({
	selectedConversationKeys: [] as number[],
	currentConversation: undefined as IConversationDTO | undefined,
	messageArr: [] as IMessageDTO[],
	multiSelectMode: false,
	createImgMode: false,
	setCreateImgMode: (_createImgMode: boolean) => {},
	updateConversation: (_conversation: IConversationDTO) => {},
	createConversation: (_title: string) => {},
	setCurrentConversationKey: (_key?: number) => {},
	inMultiSelectMode: () => {},
	outMultiSelectMode: () => {},
	setSelectedConversationKeys: (_keys: number[]) => {},
	deleteSelectedConversation: () => {},
	setMessageArr: (_messages: IMessageDTO[]) => {},
	refreshConversationList: () => {}
});

export default ConversationContext;
