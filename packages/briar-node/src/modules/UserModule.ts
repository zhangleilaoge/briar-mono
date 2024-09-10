import { Module } from '@nestjs/common';
import { AppController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { DatabaseModule } from './DataBaseModule';
import { UserDalService } from '@/services/dal/UserDalService';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [UserService, UserDalService],
})
export class UserModule {}
