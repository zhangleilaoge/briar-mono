import { Module } from '@nestjs/common';
import { AppController } from '../controllers/AiController';
import { AiService } from '../services/AiService';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
import { DatabaseModule } from './DataBaseModule';
import { MessageDalService } from '@/services/dal/MessageDalService';
import { CosService } from '@/services/CosService';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AiService, ConversationDalService, MessageDalService, CosService],
})
export class AiModule {}
