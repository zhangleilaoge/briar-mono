import { IChatRequestParams } from "briar-shared"
import alovaInstance from "./common"
import OpenAI from "openai"

export const chatRequest = (params: IChatRequestParams) =>
  alovaInstance.Post<OpenAI.Chat.Completions.ChatCompletion>(
    "./ai/chatRequest",
    params
  )
