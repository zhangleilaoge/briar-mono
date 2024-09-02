import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { LogMiddleware } from '../middleware/log';
import { DatabaseModule } from './DataBaseModule';
import { UserDalService } from '@/services/dal/UserDalService';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [UserService, UserDalService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
