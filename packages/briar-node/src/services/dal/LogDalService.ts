import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { ILogDTO, LogFromEnum, LogTypeEnum, PureModel } from 'briar-shared';

import { LogModel } from '@/model/LogModel';

@Injectable()
export class LogDalService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async create(
    {
      content,
      type = LogTypeEnum.Info,
      userId,
      ip,
      traceId,
      location,
    }: PureModel<ILogDTO>,
    from: LogFromEnum,
  ): Promise<LogModel> {
    const { data, error } = await this.supabase
      .from('logs')
      .insert({
        userId,
        type,
        content,
        ip,
        from,
        traceId,
        location,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async clear(days = 30): Promise<void> {
    const maxAge = 60 * 60 * 24 * days;
    const { error } = await this.supabase
      .from('logs')
      .delete()
      .lt('created_at', new Date(Date.now() - maxAge * 1000).toISOString());

    if (error) {
      throw new Error(error.message);
    }
  }
}
