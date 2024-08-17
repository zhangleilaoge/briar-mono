import { Injectable } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IChatRequestParams, RoleEnum } from 'briar-shared';
import OpenAI from 'openai';
import { map, Subject } from 'rxjs';
import {
  DEFAULT_FREE_API_KEY,
  MAX_STREAM_TOKEN,
  OPEN_AI_BASE_URL,
} from 'src/constants/ai';

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

  @Throttle({
    default: {
      ttl: 60,
      limit: 6,
    },
  })
  async chatRequestStream(params: IChatRequestParams) {
    const subject = new Subject();

    this.openai.chat.completions
      .create(
        {
          messages: [
            {
              role: RoleEnum.Assistant,
              content: 'You are a helpful assistant.',
            },
            ...params.messages,
          ],
          max_tokens: MAX_STREAM_TOKEN,
          model: params.model,
          stream: true,
        },
        { stream: true },
      )
      .then(async (completion) => {
        try {
          for await (const chunk of completion) {
            const payload = chunk.choices[0]?.delta?.content || '';
            if (payload) {
              subject.next(payload);
            }
          }
          subject.complete();
        } catch (err) {
          console.error(err);
          subject.error(err);
        }
      })
      .catch((err) => {
        console.error(err);
        subject.error(err);
      });
    return subject.pipe(map((data: string) => data));
  }
}
