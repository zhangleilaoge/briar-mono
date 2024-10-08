export enum ConversationEnum {
  Latest = "latest",
  DuringPast3Days = "duringPast3Days",
  DuringPastWeek = "duringPastWeek",
  DuringPastMonth = "duringPastMonth",
}

export const CONVERSATION_DESC = {
  [ConversationEnum.Latest]: "刚刚",
  [ConversationEnum.DuringPast3Days]: "三天内",
  [ConversationEnum.DuringPastWeek]: "一周内",
  [ConversationEnum.DuringPastMonth]: "一个月内",
}

export const enum SSEHookReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSED = 2,
}

export const MAX_CONVERSATION_NUM = 100
