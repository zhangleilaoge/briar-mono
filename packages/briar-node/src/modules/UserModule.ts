import { Module } from '@nestjs/common';

import { UserAbilityDalService } from '@/services/dal/UserAbilityDalService';
import { UserDalService } from '@/services/dal/UserDalService';
import { UserAbilityService } from '@/services/UserAbilityService';

import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserAbilityService,
    UserDalService,
    UserAbilityDalService,
  ],
})
export class UserModule {}
