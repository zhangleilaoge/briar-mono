import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { IBlogDTO, IPageInfo } from 'briar-shared';

@Injectable()
export class BlogDalService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async createBlog(blog: IBlogDTO) {
    const { data, error } = await this.supabase
      .from('blogs')
      .insert(blog)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async editBlog(blog: Pick<IBlogDTO, 'title' | 'content'>, id: number) {
    const { error } = await this.supabase
      .from('blogs')
      .update(blog)
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async incrementViews(id: number) {
    // 查询当前博客的 views 值
    const { data: blogData, error: getError } = await this.supabase
      .from('blogs')
      .select('views')
      .eq('id', id)
      .single();

    if (getError) {
      throw new Error(getError.message);
    }

    const currentViews = blogData.views || 0;

    // 更新 views 值
    const { error: updateError } = await this.supabase
      .from('blogs')
      .update({ views: currentViews + 1 })
      .eq('id', id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { views: currentViews + 1 };
  }

  async getBlog(blogId: number, userId: number) {
    // 获取博客信息
    const { data: blog, error: blogError } = await this.supabase
      .from('blogs')
      .select('*')
      .eq('id', blogId)
      .or(`showRange.eq.public,and(showRange.eq.private,userId.eq.${userId})`)
      .maybeSingle();

    if (blogError) throw blogError;
    if (!blog) return null;

    // 获取收藏数
    const { count: favoriteCount, error: countError } = await this.supabase
      .from('blog_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('blogId', blogId);

    if (countError) throw countError;

    // 检查当前用户是否收藏
    const { data: favorites, error: favoriteError } = await this.supabase
      .from('blog_favorites')
      .select('*')
      .eq('blogId', blogId)
      .eq('userId', userId);

    if (favoriteError) throw favoriteError;

    return {
      ...blog,
      favorite: favorites && favorites.length > 0,
      favoriteCount: favoriteCount || 0,
    };
  }

  async getBlogs({
    pagination,
    userId: currentUserId,
    favorite,
    keyword,
    mine,
  }: {
    pagination: IPageInfo;
    userId: number;
    favorite: boolean;
    keyword: string;
    mine: boolean;
  }) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = this.supabase
      .from('blogs')
      .select('*, blog_favorites(*)', { count: 'exact' })
      .or(
        `showRange.eq.public,and(showRange.eq.private,userId.eq.${currentUserId})`,
      );

    // 关键词搜索
    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`);
    }

    // 只看自己的博客
    if (mine) {
      query = query.eq('userId', currentUserId);
    }

    // 只看收藏的博客
    if (favorite) {
      query = query.eq('blog_favorites.userId', currentUserId);
    }

    // 分页和排序
    query = query.order('createdAt', { ascending: false }).range(start, end);

    const { data, count, error } = await query;

    if (error) throw error;

    const items =
      data?.map((blog) => ({
        ...blog,
        favorite: blog.blog_favorites && blog.blog_favorites.length > 0,
      })) || [];

    return {
      items,
      paginator: {
        total: count || 0,
        page,
        pageSize,
      },
    };
  }

  async favorite(userId: number, blogId: number, favorite: boolean) {
    if (favorite) {
      // 添加收藏
      const { error } = await this.supabase
        .from('blog_favorites')
        .insert({ userId, blogId });

      if (error) throw error;
      return true;
    } else {
      // 取消收藏
      const { error } = await this.supabase
        .from('blog_favorites')
        .delete()
        .eq('userId', userId)
        .eq('blogId', blogId);

      if (error) throw error;
      return true;
    }
  }

  async deleteBlog(id: number) {
    const { error } = await this.supabase.from('blogs').delete().eq('id', id);

    if (error) throw error;
    return true;
  }
}
