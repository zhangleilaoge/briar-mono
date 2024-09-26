import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common';
import { IUserAccess } from 'briar-shared';

import { Public } from '@/decorators/Public';
import { ContextService } from '@/services/common/ContextService';

import { UserService } from '../services/UserService';

@Controller('api/user')
export class AppController {
  constructor(
    private readonly UserService: UserService,
    private contextService: ContextService,
  ) {}

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
  async getUserInfo(): Promise<IUserAccess> {
    const data = await this.UserService.getUserByJwt();

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
  async authenticateUserByGoogle(@Body('tokenId') tokenId: string) {
    const userId = await this.UserService.authenticateUserByGoogle(
      tokenId,
      this.contextService.get().userId,
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
  ): Promise<IUserAccess> {
    const userId = this.contextService.get().userId;
    await this.UserService.signUp({
      username,
      password,
      id: userId,
      name: username,
    });
    const data = await this.UserService.getUserByJwt();

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

    if (!data?.id) {
      throw new ForbiddenException('用户不存在或密码错误');
    }

    const accessToken = await this.UserService.createJwt(data.id);

    return {
      userInfo: data,
      accessToken,
    };
  }
}
