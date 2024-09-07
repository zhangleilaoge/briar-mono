import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UserService } from '../services/UserService';
import { COOKIE_MAX_AGE } from 'briar-shared';
import { Cookies } from '@/decorators/Cookies';
@Controller('api/user')
export class AppController {
  constructor(private readonly UserService: UserService) {}

  @Post('createAnonymousUser')
  async createAnonymousUser(@Res({ passthrough: true }) response) {
    const data = await this.UserService.createAnonymousUser();

    response.setCookie('userId', data.id, {
      httpOnly: true,
      secure: true,
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return data;
  }

  @Get('getUserInfo')
  async getUserInfo(@Cookies('userId') userId: number) {
    const data = await this.UserService.getUserInfo(userId);

    return data;
  }

  @Post('authenticateUserByGoogle')
  async authenticateUserByGoogle(
    @Body('tokenId') tokenId: string,
    @Cookies('userId') userId: number,
  ) {
    const data = await this.UserService.authenticateUserByGoogle(
      tokenId,
      userId,
    );
    return data;
  }
}
