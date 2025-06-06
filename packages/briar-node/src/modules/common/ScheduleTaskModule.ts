import { Module } from '@nestjs/common';

import { ScheduleService } from '@/services/common/ScheduleService';
import { LogDalService } from '@/services/dal/LogDalService';
import { ShortUrlDalService } from '@/services/dal/ShortUrlDalService';
import { VerifyDalService } from '@/services/dal/VerifyDalService';
import { SystemLogService } from '@/services/LogService';

import { SupabaseModule } from './SupabaseModule';

// import { DatabaseModule } from './DataBaseModule';

@Module({
  imports: [SupabaseModule],
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
