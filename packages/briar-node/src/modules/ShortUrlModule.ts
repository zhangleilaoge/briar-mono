import { Module } from '@nestjs/common';

import { ShortUrlController } from '@/controllers/ShortUrlController';
import { ShortUrlDalService } from '@/services/dal/ShortUrlDalService';
import { ShortUrlService } from '@/services/ShortUrlService';

import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [ShortUrlController],
  providers: [ShortUrlService, ShortUrlDalService],
})
export class ShortUrlModule {}
