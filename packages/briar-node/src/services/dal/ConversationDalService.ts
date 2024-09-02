import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConversationModel } from '@/model/ConversationModel';
import { MessageDalService } from './MessageDalService';
import { MessageModel } from '@/model/MessageModel';

@Injectable()
export class ConversationDalService {
  constructor(
    @InjectModel(ConversationModel)
    private readonly conversationModel: typeof ConversationModel,
    private readonly messageDalService: MessageDalService,
  ) {}

  async create({ model, messages, userId }): Promise<{
    conversation: ConversationModel;
    messages: MessageModel[];
  }> {
    const conversation = await this.conversationModel.create({
      model,
      // TODO: auto generate title
      title: messages[0].content.slice(0, 10),
      userId,
    });

    const message = await this.messageDalService.create({
      content: messages[0].content,
      role: messages[0].role,
      conversationId: conversation.id,
    });

    return {
      conversation,
      messages: [message],
    };
  }

  async delete(id: number) {
    return await this.conversationModel.destroy({ where: { id } });
  }

  async getConversationList(userId: number) {
    return await this.conversationModel.findAll({
      where: { userId },
    });
  }
}
