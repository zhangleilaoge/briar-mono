import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';

import { BlogModel } from '@/model/BlogModel';
import { ConversationModel } from '@/model/ConversationModel';
import { LogModel } from '@/model/LogModel';
import { MaterialModel } from '@/model/MaterialModel';
import { MessageModel } from '@/model/MessageModel';
import { ShortUrlModel } from '@/model/ShortUrlModel';
import {
  AbilityUsageLimitModel,
  AbilityUsageRecordModel,
} from '@/model/UserAbilityModel';
import { RolesModel, UserModel } from '@/model/UserModel';
import { VerifyCodeModel } from '@/model/VerifyModel';

// 如若只有一个.env，直接 import 'dotenv/config' 而不用指定 .env 也可以
dotenv.config({ path: '../../.env' });

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql', // 根据你的数据库类型设置
      host: process.env.BRIAR_DATABASE_HOST,
      port: +process.env.BRIAR_DATABASE_PORT,
      username: process.env.BRIAR_DATABASE_USER,
      password: process.env.BRIAR_DATABASE_PASSWORD,
      database: 'briar',
      autoLoadModels: true, // 如果希望自动加载
      synchronize: true, // 在开发环境中可能使用，生产环境建议关闭
      timezone: '+08:00', // 设置时区为 UTC+8
      logging: false,
    }),
    SequelizeModule.forFeature([
      ConversationModel,
      ShortUrlModel,
      UserModel,
      RolesModel,
      MessageModel,
      LogModel,
      AbilityUsageLimitModel,
      AbilityUsageRecordModel,
      MaterialModel,
      VerifyCodeModel,
      BlogModel,
    ]), // 注册特定模型以用于DI
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
