import { Module } from '@nestjs/common';
import { AiModule } from './Ai';
import { TemplateModule } from './tempalte';

@Module({
  imports: [AiModule, TemplateModule],
})
export class MainModule {}
