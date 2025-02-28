import { Module } from '@nestjs/common';

import { ScheduleService } from '@/services/common/ScheduleService';
import { LogDalService } from '@/services/dal/LogDalService';
import { ShortUrlDalService } from '@/services/dal/ShortUrlDalService';
import { VerifyDalService } from '@/services/dal/VerifyDalService';
import { SystemLogService } from '@/services/LogService';

import { DatabaseModule } from './DataBaseModule';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    ShortUrlDalService,
    ScheduleService,
    VerifyDalService,
    SystemLogService,
    LogDalService,
  ],
})
export class ScheduleTaskModule {}
