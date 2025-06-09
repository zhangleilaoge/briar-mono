import { Module } from '@nestjs/common';

import { RateLimiterGuard } from '@/guards/rate-limit';
import { ContextService } from '@/services/common/ContextService';
import { LogDalService } from '@/services/dal/LogDalService';
import { RateLimiterGuardService } from '@/services/guard/RateLimiterGuardService';
import { IpLocationService } from '@/services/IpService';
import { UserLogService } from '@/services/LogService';

import { DatabaseModule } from './DataBaseModule';
import { ScheduleTaskModule } from './ScheduleTaskModule';
import { TemplateModule } from './templateModule';

@Module({
  imports: [DatabaseModule, ScheduleTaskModule, TemplateModule],
  providers: [
    ContextService,
    UserLogService,
    LogDalService,
    RateLimiterGuard,
    RateLimiterGuardService,
    IpLocationService,
  ],
  exports: [
    DatabaseModule,
    ContextService,
    UserLogService,
    LogDalService,
    RateLimiterGuard,
    RateLimiterGuardService,
    IpLocationService,
  ],
})
export class CommonModule {}
