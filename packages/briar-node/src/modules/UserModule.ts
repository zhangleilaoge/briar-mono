import { Module } from '@nestjs/common';

import { AuthController } from '@/controllers/AuthController';
import { AuthService } from '@/services/AuthService';
import { UserAbilityDalService } from '@/services/dal/UserAbilityDalService';
import { UserDalService } from '@/services/dal/UserDalService';
import { VerifyDalService } from '@/services/dal/VerifyDalService';
import { SendEmailService } from '@/services/SendEmailService';
import { UserAbilityService } from '@/services/UserAbilityService';
import { VerifyService } from '@/services/VerifyService';
import { LocalStrategy } from '@/strategy/auth.strategy';

import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [UserController, AuthController, AuthController],
  providers: [
    UserService,
    UserAbilityService,
    UserDalService,
    UserAbilityDalService,
    VerifyService,
    VerifyDalService,
    SendEmailService,
    AuthService,
    LocalStrategy,
  ],
})
export class UserModule {}
