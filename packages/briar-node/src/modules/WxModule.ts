import { Module } from '@nestjs/common';

import { WxController } from '@/controllers/WxController';
import { WxService } from '@/services/WxService';

import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [WxController],
  providers: [WxService],
})
export class WxModule {}
