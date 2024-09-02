import { IConversation, IMessage } from "briar-shared"
import React from "react"

// 创建一个新的 Context
const ConversationContext = React.createContext({
  updateConversation: (_conversation: IConversation) => {},
  createConversation: (_conversation: IConversation) => {},
  currentConversation: undefined as IConversation | undefined,
  setCurrentConversationKey: (_key?: string) => {},
  multiSelectMode: false,
  inMultiSelectMode: () => {},
  outMultiSelectMode: () => {},
  setSelectedConversationKeys: (_keys: string[]) => {},
  selectedConversationKeys: [] as string[],
  deleteSelectedConversation: () => {},
  messages: [] as IMessage[],
})

export default ConversationContext
