import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UserService } from '../services/UserService';
import { JwtService } from '@nestjs/jwt';
import { Public } from '@/decorators/Public';

@Controller('api/user')
export class AppController {
  constructor(
    private readonly UserService: UserService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Post('createAnonymousUser')
  async createAnonymousUser() {
    const data = await this.UserService.createAnonymousUser();
    // 当前只有新建匿名用户以及登录用户有 accesstoken
    const accessToken = await this.jwtService.signAsync({
      sub: data.id,
    });

    return {
      userInfo: data,
      accessToken,
    };
  }

  // @Post('logout')
  // async logout(@Res({ passthrough: true }) response) {
  //   response.cookie('userId', '', {
  //     maxAge: 0,
  //     httpOnly: true,
  //     secure: true,
  //     path: '/',
  //   });

  //   return true;
  // }

  @Get('getUserInfo')
  async getUserInfo(@Request() req) {
    const data = await this.UserService.getUserInfo(req.user.sub);

    return data;
  }

  @Post('authenticateUserByGoogle')
  async authenticateUserByGoogle(
    @Body('tokenId') tokenId: string,
    @Request() req,
  ) {
    const userId = await this.UserService.authenticateUserByGoogle(
      tokenId,
      req.user.sub,
    );

    if (userId) {
      const accessToken = await this.jwtService.signAsync({
        sub: userId,
      });
      return accessToken;
    }

    return false;
  }
}
