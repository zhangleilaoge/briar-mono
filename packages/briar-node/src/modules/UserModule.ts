import { Module } from '@nestjs/common';

import { UserDalService } from '@/services/dal/UserDalService';

import { AppController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [
    // 业务逻辑
    UserService,
    UserDalService,
  ],
})
export class UserModule {}
