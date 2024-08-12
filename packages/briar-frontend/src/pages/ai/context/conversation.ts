import { IConversation } from "briar-shared"
import React from "react"

// 创建一个新的 Context
const ConversationContext = React.createContext({
  updateConversation: (_conversation: IConversation) => {},
  addConversation: (_conversation: IConversation) => {},
  currentConversation: undefined as IConversation | undefined,
  setCurrentConversationKey: (_key?: string) => {},
})

export default ConversationContext
