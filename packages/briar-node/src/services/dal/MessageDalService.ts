import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { ChatRoleEnum } from 'briar-shared';

import { MessageModel } from '@/model/MessageModel';

@Injectable()
export class MessageDalService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async create({
    content,
    role,
    conversationId,
    model,
    imgList,
  }: {
    content: string;
    role: ChatRoleEnum;
    conversationId: number;
    model: string;
    imgList: string[];
  }) {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        content,
        role,
        conversationId,
        model,
        imgList, // Supabase 自动处理 JSON 字段，不需要手动 stringify
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      ...data,
      imgList: data.imgList || [],
    };
  }

  async update(data: Partial<MessageModel>) {
    const { error } = await this.supabase
      .from('messages')
      .update(data)
      .eq('id', data.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async findMessages(conversationId: number, endTime = Date.now(), limit = 50) {
    const { data: messages, error: countError } = await this.supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('conversationId', conversationId)
      .lt('createdAt', new Date(endTime).toISOString())
      .order('createdAt', { ascending: true })
      .order('id', { ascending: true })
      .limit(limit);

    if (countError) {
      throw new Error(countError.message);
    }

    const messageData = (messages || []).map((msg) => ({
      ...msg,
      imgList: msg.imgList || [],
    }));

    return {
      total: messages?.length || 0,
      items: messageData,
    };
  }
}

// Supabase 版本的 FollowDelete 装饰器
export function FollowDelete(idName: string) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ids: number[], ...args: any[]) {
      const { error } = await this.supabase
        .from('messages')
        .delete()
        .in(idName, ids);

      if (error) {
        throw new Error(error.message);
      }

      const result = await originalMethod.apply(this, [ids, ...args]);
      return result;
    };

    return descriptor;
  };
}
