import { Injectable } from '@nestjs/common';
import { IChatRequestParams, RoleEnum } from 'briar-shared';
import OpenAI from 'openai';
import { FOREIGN_OPEN_AI_BASE_URL, OPEN_AI_BASE_URL } from 'src/constants/ai';
import { isDev } from 'src/constants/env';

@Injectable()
export class AiService {
  openai = new OpenAI({
    // 这个 key 下次 push 时必须处理掉
    apiKey: 'sk-WVEHYHXsi4bPoPRFXfyd5nqL8YFdkJQt9FlNWDWV1aet9tKx',
    baseURL: isDev ? OPEN_AI_BASE_URL : FOREIGN_OPEN_AI_BASE_URL,
  });

  async chatRequest(params: IChatRequestParams) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        { role: RoleEnum.Assistant, content: 'You are a helpful assistant.' },
        ...params.messages,
      ],
      model: params.model,
    });

    return completion;
  }
}
