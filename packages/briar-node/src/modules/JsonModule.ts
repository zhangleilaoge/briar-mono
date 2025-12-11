import { Module } from '@nestjs/common';

import { JsonController } from '@/controllers/JsonController';
import { UserAbilityDalService } from '@/services/dal/UserAbilityDalService';
import { UserDalService } from '@/services/dal/UserDalService';
import { JsonService } from '@/services/JsonService';
import { UserAbilityService } from '@/services/UserAbilityService';
import { UserService } from '@/services/UserService';

import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [JsonController],
  providers: [
    JsonService,
    UserDalService,
    UserService,
    UserAbilityService,
    UserAbilityDalService,
  ],
})
export class JsonModule {}
