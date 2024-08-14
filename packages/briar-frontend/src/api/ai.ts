import { IChatRequestParams } from "briar-shared"
import alovaInstance from "./common"

export const chatRequest = (params: IChatRequestParams) =>
  alovaInstance.Post("./ai/chatRequest", params)
