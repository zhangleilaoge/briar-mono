import { Module } from '@nestjs/common';

import { BlogController } from '@/controllers/BlogController';
import { BlogService } from '@/services/BlogService';
import { BlogDalService } from '@/services/dal/BlogDalService';
import { UserDalService } from '@/services/dal/UserDalService';

import { CommonModule } from './common/CommonModule';

@Module({
  imports: [CommonModule],
  controllers: [BlogController],
  providers: [BlogService, BlogDalService, UserDalService],
})
export class BlogModule {}
