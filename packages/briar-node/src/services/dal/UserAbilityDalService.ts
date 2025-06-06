import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { AbilityEnum, CycleEnum, IAbilityUsageRule } from 'briar-shared';
import { startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';

@Injectable()
export class UserAbilityDalService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async create(
    rules: Partial<Record<AbilityEnum, Array<IAbilityUsageRule>>>,
    userId: number,
  ) {
    const promises = Object.keys(rules).map((key) =>
      this.supabase.from('ability_usage_limits').insert({
        user_id: userId,
        ability: +key as AbilityEnum,
        rules: rules[key],
      }),
    );

    await Promise.all(promises);
  }

  async findRules(ability: AbilityEnum, userId: number) {
    const { data, error } = await this.supabase
      .from('ability_usage_limits')
      .select('rules')
      .eq('user_id', userId)
      .eq('ability', ability)
      .single();

    if (error) {
      return [];
    }

    return data?.rules || [];
  }

  async createAbilityRecord(ability: AbilityEnum, userId: number) {
    const { error } = await this.supabase.from('ability_usage_records').insert({
      user_id: userId,
      ability,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async findAbilityRecords(
    {
      ability,
      relativeDuration,
      cycleDuration,
      durationType,
    }: {
      ability: AbilityEnum;
      relativeDuration?: number;
      cycleDuration?: CycleEnum;
      durationType?: 'relative' | 'cycle';
    },
    userId: number,
  ) {
    let query = this.supabase
      .from('ability_usage_records')
      .select('*')
      .eq('userId', userId)
      .eq('ability', ability);

    // 相对时间范围内的能力使用记录
    if (relativeDuration && durationType === 'relative') {
      const startTime = new Date(
        new Date().getTime() - relativeDuration * 1000,
      ).toISOString();
      query = query.gte('created_at', startTime);
    }
    // 周期时间范围内的能力使用记录
    else if (cycleDuration && durationType === 'cycle') {
      let start = new Date(0);
      switch (cycleDuration) {
        case CycleEnum.day:
          start = startOfDay(new Date());
          break;
        case CycleEnum.week:
          start = startOfWeek(new Date());
          break;
        case CycleEnum.month:
          start = startOfMonth(new Date());
          break;
        case CycleEnum.year:
          start = startOfYear(new Date());
          break;
        default:
          break;
      }
      query = query.gte('createdAt', start.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
}
