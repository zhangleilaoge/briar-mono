import { IMessageDTO, RoleEnum } from 'briar-shared';
import { encode } from 'gpt-tokenizer';

export const getLimitedMessages = (
  msgs: Omit<IMessageDTO, 'createdAt' | 'updatedAt' | 'id'>[],
) => {
  const MAX_CONTEXT_TOKEN = 3800;
  let result = [];
  let currentToken = 0;

  // 当上下文过多，优先清除时间较早的消息
  for (let i = msgs.length - 1; i >= 0; i--) {
    const msgContent = msgs[i].content;

    currentToken += encode(msgContent).length;

    if (currentToken > MAX_CONTEXT_TOKEN) break;

    result.unshift(msgs[i]);
  }

  result = result.map((msg, index) => {
    const keepImage = index === result.length - 1;
    let content = msg.content;
    // 历史会话不需要保留图片，不然会占用太多token
    if (msg.imgList?.[0] && msg.role === RoleEnum.User && keepImage) {
      content = [
        {
          type: 'text',
          text: content,
        },
        {
          type: 'image_url',
          image_url: { url: msg.imgList[0] },
        },
      ];
    }
    return {
      ...msg,
      content,
    };
  });

  return result;
};
