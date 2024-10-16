import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import {
  AbilityEnum,
  IConversationDTO,
  ModelEnum,
  RoleEnum,
} from 'briar-shared';
import { ICreateImgResponse } from 'briar-shared';

import { Ability } from '@/decorators/ability';
import { Public } from '@/decorators/Public';
import { AbilityGuard } from '@/guards/ability';
import { LogService } from '@/services/LogService';

import { AiService } from '../services/AiService';

@Controller('api/ai')
export class AppController {
  constructor(
    private readonly aiService: AiService,
    private readonly logger: LogService,
  ) {}

  @Public()
  @Get('chatRequestStream')
  @Sse('sse')
  async chatRequestStream(
    @Query('query') query: string,
    @Query('model') model: ModelEnum,
    @Query('conversationId') conversationId: number,
  ) {
    const messageArr = (await this.aiService.getMessages(conversationId)).items;

    return this.aiService.chatRequestStream({
      messages: [
        ...messageArr,
        {
          content: query,
          role: RoleEnum.User,
          conversationId,
          model,
        },
      ],
      conversationId,
    });
  }

  @Post('genImg')
  @Ability(AbilityEnum.CreateImg)
  @UseGuards(AbilityGuard)
  async genImg(@Body('content') content: string): Promise<ICreateImgResponse> {
    let imgUrl = '';
    try {
      imgUrl = await this.aiService.createImg(content, ModelEnum.DallE2);
    } catch (error) {
      this.logger.error(error, '图片生成失败：');

      throw new ForbiddenException(error);
    }

    return {
      imgList: [imgUrl],
      imgDesc: '',
    };
  }

  @Get('getConversationList')
  async getConversationList() {
    return this.aiService.getConversationList();
  }

  @Get('getMessages')
  async getMessages(
    @Query('conversationId') conversationId: number,
    @Query('pageSize') pageSize = 50,
    @Query('endTime') endTime = Date.now(),
  ) {
    return this.aiService.getMessages(+conversationId, +endTime, +pageSize);
  }

  @Post('createConversation')
  async createConversation(@Body('title') title: string) {
    const data = await this.aiService.createConversation(title);

    return data;
  }

  @Post('deleteConversation')
  async deleteConversation(@Body('ids') ids: number[]) {
    return this.aiService.deleteConversation(ids);
  }

  @Post('updateConversation')
  async updateConversation(
    @Body('id') id: number,
    @Body() conversation: Partial<IConversationDTO>,
  ) {
    return this.aiService.updateConversation(id, conversation);
  }

  @Post('createMessage')
  async createMessage(
    @Body('content') content: string,
    @Body('model') model: ModelEnum,
    @Body('conversationId') conversationId: number,
    @Body('role') role = RoleEnum.User,
  ) {
    return this.aiService.createMessage({
      content,
      model,
      conversationId,
      role,
    });
  }

  @Post('updateMessage')
  async updateMessage(
    @Body('content') content: string,
    @Body('imgList') imgList: string,
    @Body('id') id: number,
  ) {
    return this.aiService.updateMessage(id, content, imgList);
  }
}
