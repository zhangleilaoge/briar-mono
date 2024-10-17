import { Module } from '@nestjs/common';

import { RateLimiterGuard } from '@/guards/rate-limit';
import { ContextService } from '@/services/common/ContextService';
import { LogDalService } from '@/services/dal/LogDalService';
import { RateLimiterGuardService } from '@/services/guard/RateLimiterGuardService';
import { LogService } from '@/services/LogService';

import { DatabaseModule } from './DataBaseModule';
import { ScheduleTaskModule } from './ScheduleTaskModule';
import { TemplateModule } from './templateModule';

@Module({
  imports: [DatabaseModule, ScheduleTaskModule, TemplateModule],
  providers: [
    ContextService,
    LogService,
    LogDalService,
    RateLimiterGuard,
    RateLimiterGuardService,
  ],
  exports: [
    DatabaseModule,
    ContextService,
    LogService,
    LogDalService,
    RateLimiterGuard,
    RateLimiterGuardService,
  ],
})
export class CommonModule {}
