import { Injectable } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IMessageDTO, RoleEnum } from 'briar-shared';
import OpenAI from 'openai';
import { map, Subject } from 'rxjs';
import {
  DEFAULT_FREE_API_KEY,
  MAX_STREAM_TOKEN,
  OPEN_AI_BASE_URL,
} from 'src/constants/ai';
import { ConversationDalService } from './dal/ConversationDalService';
import { MessageDalService } from './dal/MessageDalService';

import { getLimitedMessages } from '@/utils/ai';

const THROTTLE_CONFIG = {
  default: {
    ttl: 60,
    limit: 6,
  },
};

@Injectable()
export class AiService {
  openai = new OpenAI({
    apiKey: process.env.API_KEY || DEFAULT_FREE_API_KEY,
    baseURL: OPEN_AI_BASE_URL,
  });

  constructor(
    private readonly conversationDalService: ConversationDalService,
    private readonly messageDalService: MessageDalService,
  ) {}

  // async chatRequest(prompt: string) {
  //   const completion = await this.openai.chat.completions.create({
  //     messages: [
  //       { role: RoleEnum.System, content: prompt },
  //       ...params.messages,
  //     ],
  //     model: ModelEnum.Gpt4oMini,
  //   });

  //   return completion;
  // }

  @Throttle(THROTTLE_CONFIG)
  async chatRequestStream(params: {
    messages: Omit<IMessageDTO, 'createdAt' | 'updatedAt' | 'id'>[];
  }) {
    const subject = new Subject();

    this.openai.chat.completions
      .create(
        {
          messages: [
            {
              role: RoleEnum.System,
              content: 'You are a helpful assistant.',
            },
            ...getLimitedMessages(params.messages),
          ],
          max_tokens: MAX_STREAM_TOKEN,
          model: params.messages.pop().model,
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

  async getConversationList(userId: number) {
    const conversationList = (
      await this.conversationDalService.getConversationList(userId)
    ).map((conversation) => conversation.toJSON());
    return conversationList;
  }

  async getContextMessages(conversationId: number) {
    const messages =
      await this.messageDalService.findMessagesByConversationId(conversationId);
    return messages;
  }
}
