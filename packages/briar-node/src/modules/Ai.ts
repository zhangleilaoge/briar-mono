import { Module } from '@nestjs/common';
import { AppController } from '../controllers/AiController';
import { AiService } from '../services/AiService';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AiService],
})
export class AiModule {}
