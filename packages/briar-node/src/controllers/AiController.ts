import { Body, Controller, Get, Post, Query, Sse } from '@nestjs/common';
import { AiService } from '../services/AiService';
import { IMessage, ModelEnum, safeJsonParse } from 'briar-shared';
import { Cookies } from '@/decorators/Cookies';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
@Controller('api/ai')
export class AppController {
  constructor(
    private readonly AiService: AiService,
    private readonly ConversationDalService: ConversationDalService,
  ) {}

  @Post('chatRequest')
  async chatRequest(
    @Body('messages') messages: IMessage[],
    @Body('model') model: ModelEnum,
  ) {
    const data = await this.AiService.chatRequest({
      messages,
      model: model || ModelEnum.Gpt4oMini,
    });
    return data;
  }

  @Get('chatRequestStream')
  @Sse('sse')
  async chatRequestStream(
    @Query('messages') messages: string,
    @Query('model') model: ModelEnum,
  ) {
    return this.AiService.chatRequestStream({
      messages: safeJsonParse(decodeURIComponent(messages)),
      model: model || ModelEnum.Gpt4oMini,
    });
  }

  @Get('getConversationList')
  async getConversationList(@Cookies('userId') userId: number) {
    return this.AiService.getConversationList(userId);
  }

  @Post('createConversation')
  async createConversation(
    @Body('model') model: ModelEnum,
    @Body('messages') messages: IMessage[],
    @Cookies('userId') userId: number,
  ) {
    const data = await this.ConversationDalService.create({
      model,
      messages,
      userId,
    });

    return data;
  }
}
