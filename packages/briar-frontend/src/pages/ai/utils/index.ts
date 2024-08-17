import { IMessage } from "briar-shared"

export function trimMessageList(
  messageList: IMessage[],
  maxLength = 2048
): IMessage[] {
  const res = messageList.concat()

  const getTotalContentLen = () => {
    let totalLength = 0
    for (const message of res) {
      totalLength += message.content.length
    }
    return totalLength
  }

  // 如果总长度超过最大值，则从顶部开始删除消息
  while (getTotalContentLen() > maxLength && res.length > 0) {
    res.shift() // 删除数组顶部的第一个元素
  }

  return res
}
