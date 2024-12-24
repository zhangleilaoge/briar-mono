import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  IGetUserListParams,
  IUserAccess,
  RoleEnum,
  VerifyScene,
  VerifySceneSubject,
} from 'briar-shared';

import { EmailTemplate } from '@/constants/email';
import { Public } from '@/decorators/Public';
import { QueryToObject } from '@/decorators/Query2Obj';
import { Role } from '@/decorators/Role';
import { RoleGuard } from '@/guards/role';
import { ContextService } from '@/services/common/ContextService';
import { SendEmailService } from '@/services/SendEmailService';
import { VerifyService } from '@/services/VerifyService';

import { UserService } from '../services/UserService';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private contextService: ContextService,
    private verifyService: VerifyService,
    private sendEmailService: SendEmailService,
  ) {}

  @Public()
  @Post('createAnonymousUser')
  async createAnonymousUser(): Promise<IUserAccess> {
    const data = await this.userService.createAnonymousUser();
    const accessToken = await this.userService.createJwt(data.id);
    const availablePage = await this.userService.getAvailablePage(data.roles);

    return {
      userInfo: data,
      accessToken,
      availablePage,
    };
  }

  @Get('getUserInfo')
  async getUserInfo(): Promise<IUserAccess> {
    const data = await this.userService.getUserByJwt();
    let accessToken = '';
    let availablePage = [];

    if (data) {
      accessToken = await this.userService.createJwt(data.id);
      availablePage = await this.userService.getAvailablePage(data.roles);
    }

    return {
      userInfo: data,
      accessToken,
      availablePage,
    };
  }

  @Post('updateSelf')
  async updateSelf(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('profileImg') profileImg: string,
    @Body('mobile') mobile: string,
  ) {
    const userId = this.contextService.get().userId;
    const result = await this.userService.updateUser({
      id: userId,
      name,
      email,
      profileImg,
      mobile,
    });

    return {
      result,
    };
  }

  @Get('checkUserInfo')
  async checkUserInfo(
    @Query('key') key: string,
    @Query('value') value: string,
  ) {
    const result = await this.userService.checkUserInfo(key, value);
    return result;
  }

  @Post('authenticateUserByGoogle')
  @HttpCode(200)
  async authenticateUserByGoogle(@Body('tokenId') tokenId: string) {
    const userId = await this.userService.authenticateUserByGoogle(
      tokenId,
      this.contextService.get().userId,
    );

    if (userId) {
      const accessToken = await this.userService.createJwt(userId);
      return accessToken;
    }

    return false;
  }

  @Post('signUp')
  async signUp(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string = '',
    @Body('mobile') mobile: string = '',
  ): Promise<IUserAccess> {
    const userId = this.contextService.get().userId;
    await this.userService.signUp({
      username,
      password,
      id: userId,
      name: username,
      email,
      mobile,
    });
    const data = await this.userService.getUserByJwt();

    const accessToken = await this.userService.createJwt(data.id);

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

    const data = await this.userService.getLoginUser(username, password);

    if (!data?.id) {
      throw new ForbiddenException('用户不存在或密码错误');
    }

    const accessToken = await this.userService.createJwt(data.id);

    return {
      userInfo: data,
      accessToken,
    };
  }
  @UseGuards(RoleGuard)
  @Role([RoleEnum.Admin])
  @Post('addRole')
  async addRole(
    @Body('name') name: string,
    @Body('desc') desc: string,
    @Body('menuKeys') menuKeys: string[],
  ) {
    const result = await this.userService.createRole({ name, desc, menuKeys });

    return {
      result,
    };
  }

  @Post('updatePassword')
  async updatePassword(
    @Body('email') email: string,
    @Body('verifyCode') verifyCode: string,
    @Body('password') password: string,
  ) {
    const { id } = await this.userService.getBaseInfoByEmail(email);

    const checkResult = await this.verifyService.checkVerifyCode(
      VerifyScene.RetrievePassword,
      verifyCode,
      email,
    );

    if (!checkResult) {
      throw new ForbiddenException('验证码校验失败');
    }

    const result = await this.userService.updateUser({
      id,
      password,
    });

    return {
      result,
    };
  }

  @UseGuards(RoleGuard)
  @Role([RoleEnum.Admin])
  @Post('updateRole')
  async updateRole(
    @Body('name') name: string,
    @Body('desc') desc: string,
    @Body('menuKeys') menuKeys: string[],
    @Body('id') id: number,
  ) {
    const result = await this.userService.updateRole({
      name,
      desc,
      menuKeys,
      id,
    });

    return {
      result,
    };
  }

  @UseGuards(RoleGuard)
  @Role([RoleEnum.Admin, RoleEnum.Manager])
  @Post('updateUser')
  async updateUser(@Body('roles') roles: number[], @Body('id') id: number) {
    const result = await this.userService.updateUser({
      roles,
      id,
    });

    return {
      result,
    };
  }

  @Get('getRoleList')
  async getRoleList() {
    const data = await this.userService.getRoleList();

    return data;
  }

  @Get('getUserList')
  async getUserList(@QueryToObject() params: IGetUserListParams) {
    const { keyword, roles, page, pageSize, sortBy, sortType } = params;
    const data = await this.userService.getUserList({
      pagination: {
        page,
        pageSize,
      },
      sorter: {
        sortBy,
        sortType,
      },
      keyword,
      roles,
    });

    return data;
  }

  @Post('sendVerifyCode4RetrievePassword')
  async sendVerifyCode4RetrievePassword(@Body('email') email: string) {
    const code = await this.verifyService.createVerifyCode(
      VerifyScene.RetrievePassword,
      email,
    );
    const { name } = await this.userService.getBaseInfoByEmail(email);

    await this.sendEmailService.sendEmail(email, {
      TemplateData: {
        name,
        verificationCode: code,
      },
      TemplateID: EmailTemplate.RetrievePassword,
      subject: VerifySceneSubject[VerifyScene.RetrievePassword],
    });

    return {
      res: true,
    };
  }
}
