import { Module } from '@nestjs/common';

import { CosService } from '@/services/CosService';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
import { MessageDalService } from '@/services/dal/MessageDalService';
import { UserAbilityDalService } from '@/services/dal/UserAbilityDalService';
import { UserAbilityService } from '@/services/UserAbilityService';

import { AppController } from '../controllers/AiController';
import { AiService } from '../services/AiService';
import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [
    AiService,
    CosService,
    UserAbilityService,
    UserAbilityDalService,
    ConversationDalService,
    MessageDalService,
  ],
})
export class AiModule {}
