import { Module } from '@nestjs/common';

import { CosService } from '@/services/CosService';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
import { MaterialDalService } from '@/services/dal/materialDalService';
import { MessageDalService } from '@/services/dal/MessageDalService';
import { UserAbilityDalService } from '@/services/dal/UserAbilityDalService';
import { MaterialService } from '@/services/materialService';
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
    MaterialService,
    UserAbilityDalService,
    ConversationDalService,
    MessageDalService,
    MaterialDalService,
  ],
})
export class AiModule {}
