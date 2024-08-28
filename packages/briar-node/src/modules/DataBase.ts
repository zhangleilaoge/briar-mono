import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// 这里定义你的模型
import { Conversation } from '@/model/Conversation';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql', // 根据你的数据库类型设置
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test',
      models: [Conversation], // 在这里注册你的模型
      autoLoadModels: true, // 如果希望自动加载
      synchronize: true, // 在开发环境中可能使用，生产环境建议关闭
    }),
    SequelizeModule.forFeature([Conversation]), // 注册特定模型以用于DI
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
