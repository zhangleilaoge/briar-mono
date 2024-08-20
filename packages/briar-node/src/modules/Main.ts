import { Module } from '@nestjs/common';
import { AiModule } from './Ai';

@Module({
  imports: [AiModule],
})
export class MainModule {}
