import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from '../controllers/AiController';
import { AiService } from '../services/AiService';
import { LogMiddleware } from '../middleware/log';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AiService],
})
export class AiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
