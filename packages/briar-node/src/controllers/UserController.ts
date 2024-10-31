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
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private contextService: ContextService,
  ) {}

  @Public()
  @Post('createAnonymousUser')
  async createAnonymousUser(): Promise<IUserAccess> {
    const data = await this.UserService.createAnonymousUser();
    const accessToken = await this.UserService.createJwt(data.id);
    const availablePage = await this.UserService.getAvailablePage(data.roles);

    return {
      userInfo: data,
      accessToken,
      availablePage,
    };
  }

  @Get('getUserInfo')
  async getUserInfo(): Promise<IUserAccess> {
    const data = await this.UserService.getUserByJwt();
    let accessToken = '';
    let availablePage = [];

    if (data) {
      accessToken = await this.UserService.createJwt(data.id);
      availablePage = await this.UserService.getAvailablePage(data.roles);
    }

    return {
      userInfo: data,
      accessToken,
      availablePage,
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

  @Post('addRole')
  async addRole(
    @Body('name') name: string,
    @Body('desc') desc: string,
    @Body('menuKeys') menuKeys: string[],
  ) {
    // 只有超管能调用 todo
    const result = await this.UserService.createRole({ name, desc, menuKeys });

    return {
      result,
    };
  }

  @Post('updateRole')
  async updateRole(
    @Body('name') name: string,
    @Body('desc') desc: string,
    @Body('menuKeys') menuKeys: string[],
    @Body('id') id: number,
  ) {
    const result = await this.UserService.updateRole({
      name,
      desc,
      menuKeys,
      id,
    });

    return {
      result,
    };
  }

  @Post('updateUser')
  async updateUser(@Body('roles') roles: number[], @Body('id') id: number) {
    const result = await this.UserService.updateUser({
      roles,
      id,
    });

    return {
      result,
    };
  }

  @Get('getRoleList')
  async getRoleList() {
    // 只有超管能调用 todo
    const data = await this.UserService.getRoleList();

    return data;
  }

  @Get('getUserList')
  async getUserList(
    @Query('keyword') keyword: string = '',
    @Query('roles') roles: string = '',
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    // 只有超管能调用 todo
    const data = await this.UserService.getUserList(
      {
        page,
        pageSize,
      },
      keyword,
      roles ? roles.split(',').map(Number) : [],
    );

    return data;
  }
}
