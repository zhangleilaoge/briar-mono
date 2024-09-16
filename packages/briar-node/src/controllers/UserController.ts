import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/UserService';
import { Public } from '@/decorators/Public';
import { IUserAccess } from 'briar-shared';

@Controller('api/user')
export class AppController {
  constructor(private readonly UserService: UserService) {}

  @Public()
  @Post('createAnonymousUser')
  async createAnonymousUser(): Promise<IUserAccess> {
    const data = await this.UserService.createAnonymousUser();
    const accessToken = await this.UserService.createJwt(data.id);

    return {
      userInfo: data,
      accessToken,
    };
  }

  @Get('getUserInfo')
  async getUserInfo(@Request() req): Promise<IUserAccess> {
    const data = await this.UserService.getUserByJwt(req);
    const accessToken = data ? await this.UserService.createJwt(data.id) : null;

    return {
      userInfo: data,
      accessToken,
    };
  }

  @Get('checkUsername')
  async checkUsername(@Query('username') username: string) {
    const result = await this.UserService.checkUsername(username);
    return result;
  }

  @Post('authenticateUserByGoogle')
  @HttpCode(200)
  async authenticateUserByGoogle(
    @Body('tokenId') tokenId: string,
    @Request() req,
  ) {
    const userId = await this.UserService.authenticateUserByGoogle(
      tokenId,
      req.user.sub,
    );

    if (userId) {
      const accessToken = await this.UserService.createJwt(userId);
      return accessToken;
    }

    return false;
  }

  @Post('signUp')
  async signUp(
    @Body('username') username: string,
    @Body('password') password: string,
    @Request() req,
  ): Promise<IUserAccess> {
    await this.UserService.signUp({
      username,
      password,
      id: req.user.sub,
      name: username,
    });
    const data = await this.UserService.getUserByJwt(req);

    const accessToken = await this.UserService.createJwt(data.id);

    return {
      userInfo: data,
      accessToken,
    };
  }

  @Post('signIn')
  async signIn(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<IUserAccess> {
    if (!password) {
      throw new ForbiddenException('请输入密码');
    }

    const data = await this.UserService.getLoginUser(username, password);

    if (!data) {
      throw new ForbiddenException('用户不存在或密码错误');
    }

    const accessToken = await this.UserService.createJwt(data.id);

    return {
      userInfo: data,
      accessToken,
    };
  }
}
