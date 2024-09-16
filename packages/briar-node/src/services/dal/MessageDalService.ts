import { MessageModel } from '@/model/MessageModel';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelEnum, RoleEnum } from 'briar-shared';
import { Op } from 'sequelize';

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
    model = ModelEnum.Gpt4oMini,
  }: {
    content: string;
    role: RoleEnum;
    conversationId: number;
    model?: ModelEnum;
  }): Promise<MessageModel> {
    return (
      await this.messageModel.create({ content, role, conversationId, model })
    ).dataValues;
  }

  async update(data: Partial<MessageModel>) {
    return await this.messageModel.update(data, { where: { id: data.id } });
  }

  async findMessagesByConversationId(conversationId: number, limit = 100) {
    return this.messageModel
      .findAll({
        where: { conversationId },
        limit,
        order: [
          ['createdAt', 'DESC'],
          ['id', 'DESC'],
        ],
      })
      .then((messages) => messages.reverse().map((msg) => msg.dataValues));
  }
}

export function FollowDelete(idName: string) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ids: number[], ...args: any[]) {
      await this.messageModel.destroy({
        where: {
          [idName]: {
            [Op.in]: ids,
          },
        },
      });

      const result = await originalMethod.apply(this, [ids, ...args]);

      return result;
    };

    return descriptor;
  };
}
