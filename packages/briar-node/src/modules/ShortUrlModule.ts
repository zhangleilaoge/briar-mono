import { Module } from '@nestjs/common';

import { ShortUrlController } from '@/controllers/ShortUrlController';
import { ShortUrlDalService } from '@/services/dal/ShortUrlDalService';
import { ShortUrlService } from '@/services/ShortUrlService';

import { CommonModule } from './common/CommonModule';

/** 记得保持这个模块的优先级最低，因为此模块的 controller 内部有全局匹配逻辑 */
@Module({
  imports: [CommonModule],
  controllers: [ShortUrlController],
  providers: [ShortUrlService, ShortUrlDalService],
})
export class ShortUrlModule {}
