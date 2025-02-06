import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import {
  AbilityEnum,
  ChatRoleEnum,
  IChatRequestParams,
  IConversationDTO,
  IGetMessagesParams,
  LogModuleEnum,
} from 'briar-shared';
import { ICreateImgResponse } from 'briar-shared';

import { Public } from '@/decorators/Public';
import { QueryToObject } from '@/decorators/Query2Obj';
import { AbilityGuard } from '@/guards/ability';
import { UserLogService } from '@/services/LogService';

import { Ability } from '../decorators/Ability';
import { AiService } from '../services/AiService';

@Controller('api/ai')
export class AppController {
  constructor(
    private readonly aiService: AiService,
    private readonly userLogService: UserLogService,
  ) {}

  @Public()
  @Get('chatRequestStream')
  @Sse('sse')
  async chatRequestStream(@QueryToObject() params: IChatRequestParams) {
    const { query, model, conversationId, imgList = [] } = params;

    const messageArr = (await this.aiService.getMessages(conversationId)).items;

    return this.aiService.chatRequestStream({
      messages: [
        ...messageArr,
        {
          content: query,
          role: ChatRoleEnum.User,
          conversationId,
          model,
          imgList,
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
      imgUrl = await this.aiService.createImg(content, 'dall-e-3');
    } catch (error) {
      this.userLogService.error(error, {
        content: '图片生成失败：',
        module: LogModuleEnum.GenerateImg,
      });

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

  @Get('getConversationModels')
  async getConversationModels() {
    const models = await this.aiService.getModels();
    return models;
  }

  @Get('getMessages')
  async getMessages(@QueryToObject() params: IGetMessagesParams) {
    const { conversationId, endTime = Date.now(), pageSize = 50 } = params;
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
    @Body('model') model: string,
    @Body('conversationId') conversationId: number,
    @Body('role') role = ChatRoleEnum.User,
    @Body('imgList') imgList: string[] = [],
  ) {
    return this.aiService.createMessage({
      content,
      model,
      conversationId,
      role,
      imgList,
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
