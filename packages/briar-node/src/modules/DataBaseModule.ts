import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ConversationModel } from '@/model/ConversationModel';
import { UserModel } from '@/model/UserModel';
import { MessageModel } from '@/model/MessageModel';
import * as dotenv from 'dotenv';

// 如若只有一个.env，直接 import 'dotenv/config' 而不用指定 .env 也可以
dotenv.config({ path: '../../.env' });

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql', // 根据你的数据库类型设置
      host: 'sh-cdb-ecumhe7a.sql.tencentcdb.com',
      port: 27200,
      username: process.env.BRIAR_DATABASE_USER,
      password: process.env.BRIAR_DATABASE_PASSWORD,
      database: 'briar',
      autoLoadModels: true, // 如果希望自动加载
      synchronize: true, // 在开发环境中可能使用，生产环境建议关闭
    }),
    SequelizeModule.forFeature([ConversationModel, UserModel, MessageModel]), // 注册特定模型以用于DI
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
