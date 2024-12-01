import { Module } from '@nestjs/common';

import { VerifyController } from '@/controllers/VerifyController';
import { UserDalService } from '@/services/dal/UserDalService';
import { VerifyDalService } from '@/services/dal/VerifyDalService';
import { VerifyService } from '@/services/VerifyService';

import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [VerifyController],
  providers: [VerifyService, VerifyDalService, UserDalService],
})
export class VerifyModule {}
