import { Module } from '@nestjs/common';

import { UserAbilityDalService } from '@/services/dal/UserAbilityDalService';
import { UserDalService } from '@/services/dal/UserDalService';
import { VerifyDalService } from '@/services/dal/VerifyDalService';
import { SendEmailService } from '@/services/SendEmailService';
import { UserAbilityService } from '@/services/UserAbilityService';
import { VerifyService } from '@/services/VerifyService';

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
    VerifyService,
    VerifyDalService,
    SendEmailService,
  ],
})
export class UserModule {}
