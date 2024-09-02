import { Module } from '@nestjs/common';
import { AiModule } from './AiModule';
import { UserModule } from './UserModule';

@Module({
  imports: [AiModule, UserModule,],
})
export class MainModule {}
