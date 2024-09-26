import { Module } from '@nestjs/common';

import { CosService } from '@/services/CosService';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
import { MessageDalService } from '@/services/dal/MessageDalService';

import { AppController } from '../controllers/AiController';
import { AiService } from '../services/AiService';
import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [AiService, CosService, ConversationDalService, MessageDalService],
})
export class AiModule {}
