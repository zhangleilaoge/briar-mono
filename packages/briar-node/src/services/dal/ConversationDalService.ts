import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConversationModel } from '@/model/ConversationModel';
import { Op } from 'sequelize';
import { IConversationDTO } from 'briar-shared';
import { FollowDelete } from './MessageDalService';
import { MessageModel } from '@/model/MessageModel';

@Injectable()
export class ConversationDalService {
  constructor(
    @InjectModel(ConversationModel)
    private readonly conversationModel: typeof ConversationModel,
    @InjectModel(MessageModel)
    private readonly messageModel: typeof MessageModel,
  ) {}

  async create({ userId, title }): Promise<ConversationModel> {
    const conversation = await this.conversationModel.create({
      title: title.slice(0, 25),
      userId,
    });

    return conversation;
  }

  @FollowDelete('conversationId')
  async delete(ids: number[]) {
    return await this.conversationModel.destroy({
      where: {
        id: {
          [Op.in]: ids, // 只删除这些 ID 的记录
        },
      },
    });
  }

  async getConversationList(userId: number) {
    return await this.conversationModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async update(id: number, conversation: Partial<IConversationDTO>) {
    const data = await this.conversationModel.update(conversation, {
      where: { id },
    });

    return data;
  }
}
