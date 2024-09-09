import { Module } from '@nestjs/common';
import { AiModule } from './AiModule';
import { UserModule } from './UserModule';
import { TemplateModule } from './templateModule';

@Module({
  imports: [AiModule, UserModule, TemplateModule],
})
export class MainModule {}
