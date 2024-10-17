import { Module } from '@nestjs/common';

import { ScheduleService } from '@/services/common/ScheduleService';
import { ShortUrlDalService } from '@/services/dal/ShortUrlDalService';

import { DatabaseModule } from './DataBaseModule';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [ShortUrlDalService, ScheduleService],
})
export class ScheduleTaskModule {}
