import { Body, Controller, Get, Post, Query, Sse } from '@nestjs/common';
import { AiService } from '../services/AiService';
import { IMessage, ModelEnum, safeJsonParse } from 'briar-shared';
@Controller('api/ai')
export class AppController {
  constructor(private readonly AiService: AiService) {}

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
    // console.log('messages', reply);
    return this.AiService.chatRequestStream({
      messages: safeJsonParse(messages),
      model: model || ModelEnum.Gpt4oMini,
    });
  }
}
