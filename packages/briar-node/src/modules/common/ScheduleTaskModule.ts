import { Module } from '@nestjs/common';

import { ScheduleService } from '@/services/common/ScheduleService';

@Module({
  imports: [],
  controllers: [],
  providers: [ScheduleService],
})
export class ScheduleTaskModule {}
