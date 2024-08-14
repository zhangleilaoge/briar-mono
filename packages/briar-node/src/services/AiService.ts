import { Injectable } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IChatRequestParams, RoleEnum } from 'briar-shared';
import OpenAI from 'openai';
import { DEFAULT_FREE_API_KEY, OPEN_AI_BASE_URL } from 'src/constants/ai';

@Injectable()
export class AiService {
  openai = new OpenAI({
    apiKey: process.env.API_KEY || DEFAULT_FREE_API_KEY,
    baseURL: OPEN_AI_BASE_URL,
  });

  @Throttle({
    default: {
      ttl: 60,
      limit: 6,
    },
  })
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
