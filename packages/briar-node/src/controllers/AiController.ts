import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Sse,
  Request,
} from '@nestjs/common';
import { AiService } from '../services/AiService';
import { IConversationDTO, ModelEnum, RoleEnum } from 'briar-shared';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
import { MessageDalService } from '@/services/dal/MessageDalService';
import { Public } from '@/decorators/Public';
import { ICreateImgResponse } from 'briar-shared';
@Controller('api/ai')
export class AppController {
  CosService: any;
  constructor(
    private readonly AiService: AiService,
    private readonly ConversationDalService: ConversationDalService,
    private readonly MessageDalService: MessageDalService,
  ) {}

  // @Post('chatRequest')
  // async chatRequest(
  //   @Body('messages') messages: IMessage[],
  //   @Body('model') model: ModelEnum,
  // ) {
  //   const data = await this.AiService.chatRequest({
  //     messages,
  //     model: model || ModelEnum.Gpt4oMini,
  //   });
  //   return data;
  // }

  // sse 貌似不支持自定义 header，只能放行了
  @Public()
  @Get('chatRequestStream')
  @Sse('sse')
  async chatRequestStream(
    @Query('query') query: string,
    @Query('model') model: ModelEnum,
    @Query('conversationId') conversationId: number,
  ) {
    const messageArr = await this.AiService.getContextMessages(conversationId);

    return this.AiService.chatRequestStream({
      messages: [
        ...messageArr,
        {
          content: query,
          role: RoleEnum.User,
          conversationId,
          model,
        },
      ],
    });
  }

  @Post('chatToCreateImg')
  async chatToCreateImg(
    @Body('content') content: string,
    @Request() req,
  ): Promise<ICreateImgResponse> {
    const imgList = await this.AiService.createImg(content, ModelEnum.DallE3);
    for (const img of imgList) {
      await this.CosService.uploadImg2Cos(
        `runtime-images/${req.user.sub}-${Date.now()}`,
        img,
      );
    }

    return {
      imgList,
      // imgDesc: `Here's xxx. Let me know if you'd like to make any adjustments!`,
      imgDesc: '',
    };
  }

  @Get('getConversationList')
  async getConversationList(@Request() req) {
    return this.AiService.getConversationList(req.user.sub || 0);
  }

  @Get('findMessagesByConversationId')
  async findMessagesByConversationId(
    @Query('conversationId') conversationId: number,
  ) {
    return this.MessageDalService.findMessagesByConversationId(conversationId);
  }

  @Post('createConversation')
  async createConversation(@Body('title') title: string, @Request() req) {
    const data = await this.ConversationDalService.create({
      userId: req.user.sub,
      title,
    });

    return data.toJSON();
  }

  @Post('deleteConversation')
  async deleteConversation(@Body('ids') ids: number[]) {
    return this.ConversationDalService.delete(ids);
  }

  @Post('updateConversation')
  async updateConversation(
    @Body('id') id: number,
    @Body() conversation: Partial<IConversationDTO>,
  ) {
    return this.ConversationDalService.update(id, conversation);
  }

  @Post('createMessage')
  async createMessage(
    @Body('content') content: string,
    @Body('model') model: ModelEnum,
    @Body('conversationId') conversationId: number,
    @Body('role') role = RoleEnum.User,
  ) {
    return this.MessageDalService.create({
      content,
      role,
      conversationId,
      model,
    });
  }

  @Post('updateMessage')
  async updateMessage(
    @Body('content') content: string,
    @Body('imgList') imgList: string,
    @Body('id') id: number,
  ) {
    return this.MessageDalService.update({
      content,
      id,
      imgList,
    });
  }
}
