export enum ConversationEnum {
  Latest = "latest",
  DuringPast3Days = "duringPast3Days",
  DuringPastWeek = "duringPastWeek",
  DuringPastMonth = "duringPastMonth",
}

export const CONVERSATION_DESC = {
  [ConversationEnum.Latest]: "Latest",
  [ConversationEnum.DuringPast3Days]: "During past 3 days",
  [ConversationEnum.DuringPastWeek]: "During past week",
  [ConversationEnum.DuringPastMonth]: "During past month",
}
