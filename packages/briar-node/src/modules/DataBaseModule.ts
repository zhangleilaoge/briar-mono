import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ConversationModel } from '@/model/ConversationModel';
import { UserModel } from '@/model/UserModel';
import { MessageModel } from '@/model/MessageModel';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql', // 根据你的数据库类型设置
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'briar',
      autoLoadModels: true, // 如果希望自动加载
      synchronize: true, // 在开发环境中可能使用，生产环境建议关闭
    }),
    SequelizeModule.forFeature([ConversationModel, UserModel, MessageModel]), // 注册特定模型以用于DI
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
