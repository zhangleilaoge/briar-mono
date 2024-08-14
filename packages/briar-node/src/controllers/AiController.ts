import { Body, Controller, Post, Query } from '@nestjs/common';
import { AiService } from '../services/AiService';
import { IMessage, ModelEnum } from 'briar-shared';

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
}
