import { MessageModel } from '@/model/MessageModel';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleEnum } from 'briar-shared';

@Injectable()
export class MessageDalService {
  constructor(
    @InjectModel(MessageModel)
    private readonly messageModel: typeof MessageModel,
  ) {}

  async create({
    content,
    role,
    conversationId,
  }: {
    content: string;
    role: RoleEnum;
    conversationId: number;
  }): Promise<MessageModel> {
    return this.messageModel.create({ content, role, conversationId });
  }
}
