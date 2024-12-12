import { IMessageDTO, RoleEnum } from 'briar-shared';
import { encode } from 'gpt-tokenizer';

export const getLimitedMessages = (
  msgs: Omit<IMessageDTO, 'createdAt' | 'updatedAt' | 'id'>[],
) => {
  const MAX_CONTEXT_TOKEN = 3800;
  let result = [];
  let currentToken = 0;

  for (let i = msgs.length - 1; i >= 0; i--) {
    const msgContent = msgs[i].content;

    currentToken += encode(msgContent).length;

    if (currentToken > MAX_CONTEXT_TOKEN) break;

    result.unshift(msgs[i]);
  }

  result = result.map((msg) => {
    let content = msg.content;
    if (msg.imgList?.[0] && msg.role === RoleEnum.User) {
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
