import { Module } from '@nestjs/common';

import { MaterialController } from '@/controllers/MaterialController';
import { CosService } from '@/services/CosService';

import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [MaterialController],
  providers: [CosService],
})
export class MaterialModule {}
