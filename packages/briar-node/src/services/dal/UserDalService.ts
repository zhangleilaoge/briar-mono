import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { IPageInfo, IRoleDTO, ISortInfo, RoleEnum } from 'briar-shared';
import { omit } from 'lodash';

import { SafeReturn } from '@/decorators/SafeReturn';
import { UserModel } from '@/model/UserModel';

const SENSITIVE_FIELDS = ['password'];

@Injectable()
export class UserDalService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  @SafeReturn(SENSITIVE_FIELDS)
  async create({
    name = '匿名用户',
    profileImg = '',
    email = '',
    googleId = '',
    roles = [RoleEnum.Traveler],
  }) {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        name,
        profileImg,
        email,
        googleId,
        roles,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async delete(id: number) {
    const { error } = await this.supabase.from('users').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  @SafeReturn(SENSITIVE_FIELDS)
  async getUser({
    userId,
    googleId,
    password,
    username,
    email,
  }: {
    userId?: number;
    googleId?: string;
    password?: string;
    username?: string;
    email?: string;
  }) {
    const query = this.supabase.from('users').select('*');

    if (userId) query.eq('id', userId);
    if (googleId) query.eq('googleId', googleId);
    if (password) query.eq('password', password);
    if (username) query.eq('username', username);
    if (email) query.eq('email', email);

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 是未找到记录的错误码
      throw new Error(error.message);
    }

    return data;
  }

  @SafeReturn(SENSITIVE_FIELDS)
  async getUsers(ids: number[]) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .in('id', ids);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  async update(data: Partial<UserModel>) {
    const { email, mobile, username, id } = data;

    // 检查邮箱是否已被使用
    if (email) {
      const { data: existingEmailUser } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .neq('id', id)
        .single();

      if (existingEmailUser) {
        throw new ForbiddenException('当前 email 已经被使用');
      }
    }

    // 检查手机号是否已被使用
    if (mobile) {
      const { data: existingMobileUser } = await this.supabase
        .from('users')
        .select('id')
        .eq('mobile', mobile)
        .neq('id', id)
        .single();

      if (existingMobileUser) {
        throw new ForbiddenException('当前 mobile 已经被使用');
      }
    }

    // 检查用户名是否已被使用
    if (username) {
      const { data: existingUsernameUser } = await this.supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .neq('id', id)
        .single();

      if (existingUsernameUser) {
        throw new ForbiddenException('当前 username 已经被使用');
      }
    }

    const { error } = await this.supabase
      .from('users')
      .update(data)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async createRole({
    name,
    desc,
    menuKeys,
  }: Pick<IRoleDTO, 'name' | 'desc' | 'menuKeys'>) {
    const { data, error } = await this.supabase
      .from('roles')
      .insert({ name, desc, menuKeys })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async updateRole({
    name,
    desc,
    menuKeys,
    id,
  }: Pick<IRoleDTO, 'name' | 'desc' | 'menuKeys' | 'id'>) {
    const { error } = await this.supabase
      .from('roles')
      .update({ name, desc, menuKeys })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getRoles(withCount = false) {
    // 1. 获取所有角色
    const { data: roles, error: rolesError } = await this.supabase
      .from('roles')
      .select('*');

    if (rolesError) {
      throw new Error(rolesError.message);
    }

    if (!withCount) return roles as IRoleDTO[];

    // 2. 获取所有用户的角色数组
    const { data: users, error: usersError } = await this.supabase
      .from('users')
      .select('roles');

    if (usersError) {
      throw new Error(usersError.message);
    }

    // 3. 计算每个角色的用户数量
    const roleCountMap = new Map<number, number>();
    users?.forEach((user) => {
      user.roles?.forEach((roleId: number) => {
        roleCountMap.set(roleId, (roleCountMap.get(roleId) || 0) + 1);
      });
    });

    // 4. 组合结果
    return roles?.map((role) => ({
      ...role,
      userCount: roleCountMap.get(role.id) || 0,
    })) as Array<IRoleDTO & { userCount: number }>;
  }

  async getUserList({
    pagination,
    sorter,
    name,
    mobile,
    email,
    id,
    roles,
  }: {
    pagination: IPageInfo;
    sorter: ISortInfo;
    roles: number[];
    name?: string;
    mobile?: string;
    email?: string;
    id?: number;
  }) {
    const page = +pagination.page;
    const pageSize = +pagination.pageSize;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    console.log('roles', roles);

    let query = this.supabase.from('users').select('*', { count: 'exact' });

    // ✅ 处理 jsonb 类型的 roles 查询（检查 roles 包含任意一个传入值）
    if (roles?.length > 0) {
      query = query.filter('roles', 'cs', `[${roles.join(',')}]`); // `cs` = "contains"
    }

    if (id) query = query.eq('id', id);
    if (mobile) query = query.eq('mobile', mobile);
    if (email) query = query.eq('email', email);
    if (name) {
      query = query.or(`name.ilike.%${name}%,username.ilike.%${name}%`);
    }

    // 添加排序
    if (sorter.sortBy) {
      query = query.order(sorter.sortBy, {
        ascending: sorter.sortType === 'asc',
      });
    }

    // 添加分页
    query = query.range(start, end);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      items: (data || []).map((item) => omit(item, 'password')),
      paginator: {
        total: count || 0,
        page,
        pageSize,
      },
    };
  }
}
