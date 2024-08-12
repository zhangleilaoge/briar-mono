import { Module } from '@nestjs/common';
import { AiModule } from './ai';

@Module({
  imports: [AiModule],
})
export class MainModule {}
