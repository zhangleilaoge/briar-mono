import { Module } from '@nestjs/common';

import { MaterialController } from '@/controllers/MaterialController';
import { CosService } from '@/services/CosService';
import { MaterialDalService } from '@/services/dal/materialDalService';
import { MaterialService } from '@/services/materialService';

import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [MaterialController],
  providers: [CosService, MaterialService, MaterialDalService],
})
export class MaterialModule {}
