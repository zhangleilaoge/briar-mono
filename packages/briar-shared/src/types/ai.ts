export enum RoleEnum {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export enum ModelEnum {
  Gpt4oMini = "gpt-4o-mini",
}

export interface IMessage {
  role: RoleEnum
  content: string
  created: number
}

export interface IConversation {
  messages: IMessage[]
  model: ModelEnum
  created: number
}

export interface IChatRequestParams {
  messages: IMessage[]
  model: ModelEnum
}
