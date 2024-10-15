import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IConversationDTO } from 'briar-shared';
import { Op } from 'sequelize';

import { ConversationModel } from '@/model/ConversationModel';
import { MessageModel } from '@/model/MessageModel';

import { FollowDelete } from './MessageDalService';

@Injectable()
export class ConversationDalService {
  constructor(
    @InjectModel(ConversationModel)
    private readonly conversationModel: typeof ConversationModel,
    @InjectModel(MessageModel)
    private readonly messageModel: typeof MessageModel,
  ) {}

  async create({ userId, title, profile }): Promise<ConversationModel> {
    const conversation = await this.conversationModel.create({
      title: title.slice(0, 25),
      userId,
      profile,
    });

    return conversation.dataValues;
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

  async getConversationList(userId: number, limit = 100) {
    return (
      await this.conversationModel.findAll({
        where: { userId },
        limit,
        order: [
          ['marked', 'DESC'],
          ['updatedAt', 'DESC'],
        ],
      })
    ).map((c) => c.dataValues);
  }

  async getConversation(conversationId: number) {
    return (
      await this.conversationModel.findOne({
        where: { id: conversationId },
      })
    ).dataValues;
  }

  async update(id: number, conversation: Partial<IConversationDTO>) {
    const data = await this.conversationModel.update(conversation, {
      where: { id },
    });

    return data;
  }
}
