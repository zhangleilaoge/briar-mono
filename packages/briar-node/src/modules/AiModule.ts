import { Module } from '@nestjs/common';
import { AppController } from '../controllers/AiController';
import { AiService } from '../services/AiService';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
import { DatabaseModule } from './DataBaseModule';
import { MessageDalService } from '@/services/dal/MessageDalService';
import { CosService } from '@/services/CosService';
import { RateLimiterGuard } from '@/guards/rate-limit';
import { RateLimiterGuardService } from '@/services/guard/RateLimiterGuardService';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [
    AiService,
    ConversationDalService,
    MessageDalService,
    CosService,
    RateLimiterGuard,
    RateLimiterGuardService,
  ],
})
export class AiModule {}
