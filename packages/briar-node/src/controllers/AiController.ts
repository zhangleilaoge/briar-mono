import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { IConversationDTO, ModelEnum, RoleEnum } from 'briar-shared';
import { ICreateImgResponse } from 'briar-shared';
import { getFileExtension } from 'briar-shared';

import { Public } from '@/decorators/Public';
import { RateLimited } from '@/decorators/RateLimit';
import { RateLimiterGuard } from '@/guards/rate-limit';
import { CosService } from '@/services/CosService';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
import { MessageDalService } from '@/services/dal/MessageDalService';
import { UserService } from '@/services/UserService';

import { AiService } from '../services/AiService';

@Controller('api/ai')
export class AppController {
  constructor(
    private readonly AiService: AiService,
    private readonly ConversationDalService: ConversationDalService,
    private readonly MessageDalService: MessageDalService,
    private readonly CosService: CosService,
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
  @UseGuards(RateLimiterGuard)
  @RateLimited({ points: 10, duration: 60 * 60 * 24, key: 'chatRequestStream' })
  async chatToCreateImg(
    @Body('content') content: string,
    @Request() req,
  ): Promise<ICreateImgResponse> {
    const tempImgList = await this.AiService.createImg(
      content,
      ModelEnum.DallE2,
    );
    const userId = UserService.getUserIdByJwt(req);

    const imgList: string[] = await Promise.all(
      tempImgList.map(async (img) => {
        const imgUrl = (await this.CosService.uploadImg2Cos(
          `runtime-images/${userId}-${Date.now()}.${getFileExtension(img)}`,
          img,
        )) as string;
        return imgUrl;
      }),
    );

    return {
      imgList,
      // imgDesc: `Here's xxx. Let me know if you'd like to make any adjustments!`,
      imgDesc: '',
    };
  }

  @Get('getConversationList')
  async getConversationList(@Request() req) {
    const userId = UserService.getUserIdByJwt(req);
    return this.AiService.getConversationList(userId || 0);
  }

  @Get('findMessagesByConversationId')
  async findMessagesByConversationId(
    @Query('conversationId') conversationId: number,
  ) {
    return this.MessageDalService.findMessagesByConversationId(conversationId);
  }

  @Post('createConversation')
  async createConversation(@Body('title') title: string, @Request() req) {
    const userId = UserService.getUserIdByJwt(req);
    const data = await this.ConversationDalService.create({
      userId,
      title,
    });

    return data;
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
