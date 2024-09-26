import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import {
  IConversationDTO,
  IMessageDTO,
  ModelEnum,
  RoleEnum,
} from 'briar-shared';
import OpenAI from 'openai';
import { map, Subject } from 'rxjs';
import {
  DEFAULT_FREE_API_KEY,
  MAX_STREAM_TOKEN,
  OPEN_AI_BASE_URL,
} from 'src/constants/ai';

import { getLimitedMessages } from '@/utils/ai';

import { ContextService } from './common/ContextService';
import { ConversationDalService } from './dal/ConversationDalService';
import { MessageDalService } from './dal/MessageDalService';
import { LogService } from './LogService';

@Injectable()
export class AiService {
  openai = new OpenAI({
    apiKey: process.env.BRIAR_API_KEY || DEFAULT_FREE_API_KEY,
    baseURL: OPEN_AI_BASE_URL,
  });

  constructor(
    private readonly conversationDalService: ConversationDalService,
    private readonly messageDalService: MessageDalService,
    private readonly logger: LogService,
    private contextService: ContextService,
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
          this.logger.error(err);

          subject.error(err);
        }
      })
      .catch((err) => {
        console.error(err);
        subject.error(err);
      });
    return subject.pipe(map((data: string) => data));
  }

  async createImg(query: string, model: ModelEnum) {
    this.logger.log('图片生成开始');

    const response = await this.openai.images.generate({
      model,
      prompt: query,
      n: 1,
      size: '1024x1024',
    });

    this.logger.log(`图片生成完成: ${JSON.stringify(response.data)}`);

    return response.data.map((data) => data.url);
  }

  async getConversationList() {
    const conversationList =
      await this.conversationDalService.getConversationList(
        this.contextService.get().userId,
      );
    return conversationList;
  }

  async getContextMessages(conversationId: number) {
    const messages =
      await this.messageDalService.findMessagesByConversationId(conversationId);
    return messages;
  }

  async createConversation(title: string) {
    const conversation = await this.conversationDalService.create({
      title,
      userId: this.contextService.get().userId,
    });
    return conversation;
  }

  async updateConversation(
    id: number,
    conversation: Partial<IConversationDTO>,
  ) {
    return this.conversationDalService.update(id, conversation);
  }

  async deleteConversation(ids: number[]) {
    return this.conversationDalService.delete(ids);
  }

  async createMessage({
    content,
    model,
    conversationId,
    role = RoleEnum.User,
  }: {
    content: string;
    model: ModelEnum;
    conversationId: number;
    role?: RoleEnum;
  }) {
    const message = await this.messageDalService.create({
      content,
      model,
      conversationId,
      role,
    });
    return message;
  }

  async updateMessage(id: number, content: string, imgList: string) {
    return this.messageDalService.update({
      content,
      id,
      imgList,
    });
  }
}
