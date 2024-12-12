import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelEnum, RoleEnum } from 'briar-shared';
import { safeJSON } from 'openai/core';
import { Op } from 'sequelize';

import { MessageModel } from '@/model/MessageModel';

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
    model,
    imgList,
  }: {
    content: string;
    role: RoleEnum;
    conversationId: number;
    model: ModelEnum;
    imgList: string[];
  }): Promise<MessageModel> {
    const result = (
      await this.messageModel.create({
        content,
        role,
        conversationId,
        model,
        imgList: JSON.stringify(imgList),
      })
    ).dataValues;

    return {
      ...result,
      imgList: result.imgList ? safeJSON(result.imgList) : [],
    } as MessageModel;
  }

  async update(data: Partial<MessageModel>) {
    return await this.messageModel.update(data, { where: { id: data.id } });
  }

  async findMessages(conversationId: number, endTime = Date.now(), limit = 50) {
    const totalCount = await this.messageModel.count({
      where: {
        conversationId,
        createdAt: { [Op.lt]: new Date(endTime) },
      },
    });

    const messages = await this.messageModel.findAll({
      where: { conversationId, createdAt: { [Op.lt]: new Date(endTime) } },
      limit,
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    const messageData = messages
      .reverse()
      .map((msg) => msg.dataValues)
      .map((msg) => ({
        ...msg,
        imgList: msg.imgList ? safeJSON(msg.imgList) : [],
      }));

    return {
      total: totalCount,
      items: messageData,
    };
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
