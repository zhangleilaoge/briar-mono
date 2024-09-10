import { Module } from '@nestjs/common';
import { AppController } from '../controllers/AiController';
import { AiService } from '../services/AiService';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
import { DatabaseModule } from './DataBaseModule';
import { MessageDalService } from '@/services/dal/MessageDalService';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AiService, ConversationDalService, MessageDalService],
})
export class AiModule {}
