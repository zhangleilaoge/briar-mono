import { Controller, Post, Res } from '@nestjs/common';
import { UserService } from '../services/UserService';
@Controller('api/user')
export class AppController {
  constructor(private readonly UserService: UserService) {}

  @Post('createAnonymousUser')
  async createAnonymousUser(@Res({ passthrough: true }) response) {
    const data = await this.UserService.createAnonymousUser();

    response.setCookie('userId', data.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });


    return data;
  }
}
