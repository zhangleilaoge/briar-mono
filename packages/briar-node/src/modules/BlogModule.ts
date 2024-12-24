import { Module } from '@nestjs/common';

import { BlogController } from '@/controllers/BlogController';
import { BlogService } from '@/services/BlogService';
import { BlogDalService } from '@/services/dal/BlogDalService';
import { UserAbilityDalService } from '@/services/dal/UserAbilityDalService';
import { UserDalService } from '@/services/dal/UserDalService';
import { UserAbilityService } from '@/services/UserAbilityService';
import { UserService } from '@/services/UserService';

import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [BlogController],
  providers: [
    BlogService,
    BlogDalService,
    UserDalService,
    UserService,
    UserAbilityService,
    UserAbilityDalService,
  ],
})
export class BlogModule {}
