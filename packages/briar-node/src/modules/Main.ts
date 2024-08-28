import { Module } from '@nestjs/common';
import { AiModule } from './Ai';
// import { DatabaseModule } from './DataBase';

@Module({
  imports: [AiModule],
})
export class MainModule {}
