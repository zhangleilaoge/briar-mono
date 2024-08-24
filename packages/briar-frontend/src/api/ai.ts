import { IChatRequestParams } from "briar-shared"
import alovaInstance, { getQueryFromObj } from "./common"
import OpenAI from "openai"

export const chatRequest = (params: IChatRequestParams) =>
  alovaInstance.Post<OpenAI.Chat.Completions.ChatCompletion>(
    "/api/ai/chatRequest",
    params
  )

export const chatRequestStream = (params: IChatRequestParams) =>
  alovaInstance.Get(`/api/ai/chatRequestStream?${getQueryFromObj(params)}`)
