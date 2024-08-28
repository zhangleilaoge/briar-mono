import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Conversation } from '@/model/Conversation';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Conversation)
    private readonly conversationModel: typeof Conversation,
  ) {}

  async createConversation({ model, created, title }): Promise<Conversation> {
    return await this.conversationModel.create({ model, created, title });
  }

  async deleteConversation(id: number) {
    return await this.conversationModel.destroy({ where: { id } });
  }

  // async getConver
}
