import { Module } from '@nestjs/common';

import { RateLimiterGuard } from '@/guards/rate-limit';
import { CosService } from '@/services/CosService';
import { ConversationDalService } from '@/services/dal/ConversationDalService';
import { MessageDalService } from '@/services/dal/MessageDalService';
import { RateLimiterGuardService } from '@/services/guard/RateLimiterGuardService';

import { AppController } from '../controllers/AiController';
import { AiService } from '../services/AiService';
import { DatabaseModule } from './DataBaseModule';

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
