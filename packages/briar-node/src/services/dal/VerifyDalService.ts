import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { IVerifyCodeDTO, VerifyScene } from 'briar-shared';

@Injectable()
export class VerifyDalService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async createVerifyCode({
    creator,
    validDuration,
    code,
    scene,
    consumer,
  }: Omit<IVerifyCodeDTO, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await this.supabase
      .from('verify_codes')
      .insert({
        creator,
        validDuration,
        code,
        scene,
        consumer,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async checkVerifyCode({
    creator,
    code,
    scene,
    consumer,
  }: {
    creator: number;
    code: string;
    scene: VerifyScene;
    consumer: number;
  }) {
    const { data, error } = await this.supabase
      .from('verify_codes')
      .select('*')
      .eq('creator', creator)
      .eq('code', code)
      .eq('scene', scene)
      .eq('consumer', consumer)
      .single();

    if (error) {
      return false;
    }

    if (data) {
      const currentTime = new Date();
      const createdAt = new Date(data.created_at);
      const validDuration = data.validDuration;

      return new Date(createdAt.getTime() + validDuration) > currentTime;
    }

    return false;
  }

  async clearExpiredVerifyCode() {
    const { error } = await this.supabase
      .from('verify_codes')
      .delete()
      .filter('createdAt', 'lt', new Date(Date.now() - 1000).toISOString());

    if (error) {
      throw new Error(error.message);
    }
  }
}
