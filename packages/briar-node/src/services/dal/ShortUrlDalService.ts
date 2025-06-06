import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { IPageInfo, UrlEnum } from 'briar-shared';
import { difference } from 'lodash';

import { generateRandomStr } from '@/utils/hash';

@Injectable()
export class ShortUrlDalService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async batchCreate(codes: string[]) {
    const { data, error } = await this.supabase
      .from('short_urls')
      .insert(codes.map((code) => ({ code })))
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findOneEmptyCode() {
    const { data, error } = await this.supabase
      .from('short_urls')
      .select('code')
      .is('url', null)
      .limit(1)
      .single();

    if (error) {
      return null;
    }

    return data?.code;
  }

  async findOneByCode(code: string) {
    const { data, error } = await this.supabase
      .from('short_urls')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  async getList(pagination: IPageInfo, userId: number, url: string) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    const code = url.replace(UrlEnum.Base, '');

    const { data, count, error } = await this.supabase
      .from('short_urls')
      .select('*', { count: 'exact' })
      .eq('creator', userId)
      .or(`url.ilike.%${url}%,code.ilike.%${code}%`)
      .order('createdAt', { ascending: false })
      .range(start, end);

    if (error) {
      throw new Error(error.message);
    }

    return {
      items: data || [],
      paginator: {
        total: count || 0,
        page,
        pageSize,
      },
    };
  }

  async updateShortUrl(code: string, url: string, creator: number) {
    const { error } = await this.supabase
      .from('short_urls')
      .update({ url, creator })
      .eq('code', code);

    if (error) {
      throw new Error(error.message);
    }
  }

  async findRepeatCodes(codes: string[]) {
    const { data, error } = await this.supabase
      .from('short_urls')
      .select('code')
      .in('code', codes);

    if (error) {
      throw new Error(error.message);
    }

    return data?.map((item) => item.code) || [];
  }

  async createEmptyShortCode() {
    // 生成 100 个随机字符
    const randomStrs = new Array(100).fill(0).map(() => generateRandomStr(6));
    const repeatCodes = await this.findRepeatCodes(randomStrs);

    // 过滤掉数据库中重复的随机字符串，然后批量插入
    const newRandomStrs = difference(randomStrs, repeatCodes);
    await this.batchCreate(newRandomStrs);
  }
}
