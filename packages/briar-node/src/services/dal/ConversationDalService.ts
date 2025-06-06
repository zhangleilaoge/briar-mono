import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { IConversationDTO } from 'briar-shared';

@Injectable()
export class ConversationDalService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async create({ userId, title, profile, prompt }) {
    const { data, error } = await this.supabase
      .from('conversations')
      .insert({
        title: title.slice(0, 25),
        userId,
        profile,
        prompt,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async delete(ids: number[]) {
    // 首先删除关联的消息
    const { error: messagesError } = await this.supabase
      .from('messages')
      .delete()
      .in('conversationId', ids);

    if (messagesError) {
      throw new Error(messagesError.message);
    }

    // 然后删除对话
    const { error: conversationsError } = await this.supabase
      .from('conversations')
      .delete()
      .in('id', ids);

    if (conversationsError) {
      throw new Error(conversationsError.message);
    }
  }

  async getConversationList(userId: number, limit = 100) {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('userId', userId)
      .order('marked', { ascending: false })
      .order('updatedAt', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  async getConversation(conversationId: number) {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async update(id: number, conversation: Partial<IConversationDTO>) {
    const { error } = await this.supabase
      .from('conversations')
      .update(conversation)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
