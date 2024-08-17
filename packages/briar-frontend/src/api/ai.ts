import { IChatRequestParams } from "briar-shared"
import alovaInstance, { getQueryFromObj } from "./common"
import OpenAI from "openai"

export const chatRequest = (params: IChatRequestParams) =>
  alovaInstance.Post<OpenAI.Chat.Completions.ChatCompletion>(
    "./ai/chatRequest",
    params
  )

export const chatRequestStream = (params: IChatRequestParams) =>
  alovaInstance.Get(`./ai/chatRequestStream?${getQueryFromObj(params)}`)
