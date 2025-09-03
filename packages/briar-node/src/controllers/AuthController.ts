import {
  Bind,
  Controller,
  ForbiddenException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { LocalAuthGuard } from '@/guards/local-auth.guard';
import { AuthService } from '@/services/AuthService';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Bind(Request())
  async login(req) {
    if (!req?.user?.id) {
      throw new ForbiddenException('用户不存在或密码错误');
    }
    return this.authService.login(req.user);
  }
}
