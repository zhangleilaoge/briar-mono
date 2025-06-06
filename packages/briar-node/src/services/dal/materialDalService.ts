import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  IMaterial,
  IPageInfo,
} from 'briar-shared';

import { MaterialModel } from '@/model/MaterialModel';

@Injectable()
export class MaterialDalService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async createImgMaterial(
    files: Pick<IMaterial, 'name' | 'thumbUrl' | 'userId' | 'url'>[],
  ) {
    const userId = files[0].userId;
    const urls = files.map((file) => file.url);

    // 查找已存在的材料
    const { data: existingMaterials } = await this.supabase
      .from('materials')
      .select('*')
      .in('url', urls)
      .eq('userId', userId);

    // 过滤掉已存在的材料
    const newFiles = files.filter((file) => {
      return !existingMaterials?.some(
        (existingMaterial) => existingMaterial.thumbUrl === file.thumbUrl,
      );
    });

    if (newFiles.length === 0) {
      return [];
    }

    // 批量创建新材料
    const { data, error } = await this.supabase
      .from('materials')
      .insert(newFiles)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteImgMaterials(
    list: { id: number; name: string }[],
    userId: number,
  ) {
    const { error } = await this.supabase
      .from('materials')
      .delete()
      .in(
        'id',
        list.map((item) => item.id),
      )
      .eq('userId', userId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getImgMaterials(pagination: IPageInfo, userId: number) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, count, error } = await this.supabase
      .from('materials')
      .select('*', { count: 'exact' })
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(start, end);

    if (error) {
      throw new Error(error.message);
    }

    return {
      items: (data || []) as MaterialModel[],
      paginator: {
        total: count || 0,
        page,
        pageSize,
      },
    };
  }
}
