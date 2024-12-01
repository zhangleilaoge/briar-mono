import { Injectable } from '@nestjs/common';
import { generateRandomCode, VerifyScene } from 'briar-shared';

import { UserDalService } from '@/services/dal/UserDalService';

import { ContextService } from './common/ContextService';
import { VerifyDalService } from './dal/VerifyDalService';

@Injectable()
export class VerifyService {
  constructor(
    private verifyDalService: VerifyDalService,
    private userDalService: UserDalService,
    private contextService: ContextService,
  ) {}

  async createVerifyCode(scene: VerifyScene, email: string) {
    const validDuration = 60 * 30 * 1000; // 30 minutes
    const code = generateRandomCode(6);
    const { id: consumer } = await this.userDalService.getUser({ email });

    await this.verifyDalService.createVerifyCode({
      creator: this.contextService.get().userId,
      validDuration,
      code,
      scene,
      consumer,
    });

    return code;
  }

  async checkVerifyCode(scene: VerifyScene, code: string, email: string) {
    const { id: consumer } = await this.userDalService.getUser({ email });
    return await this.verifyDalService.checkVerifyCode({
      creator: this.contextService.get().userId,
      code,
      scene,
      consumer,
    });
  }
}
