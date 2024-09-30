import { Module } from '@nestjs/common';

import { UserAbilityDalService } from '@/services/dal/UserAbilityDalService';
import { UserDalService } from '@/services/dal/UserDalService';
import { UserAbilityService } from '@/services/UserAbilityService';

import { AppController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [
    UserService,
    UserAbilityService,
    UserDalService,
    UserAbilityDalService,
  ],
})
export class UserModule {}
