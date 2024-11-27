import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

function generateRandomNumber(digits: number): string {
  if (digits <= 0) {
    throw new Error('Digits must be a positive integer');
  }

  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber.toString();
}

@Injectable()
export class WxService {
  constructor() {}

  access_token = '';

  @Cron(CronExpression.EVERY_2_HOURS)
  async createAccessToken() {
    const data = await axios({
      method: 'post',
      url: `https://api.weixin.qq.com/cgi-bin/stable_token`,
      data: {
        grant_type: 'client_credential',
        appid: process.env.BRIAR_WX_APPID,
        secret: process.env.BRIAR_WX_SECRET,
      },
    });

    this.access_token = data?.data?.access_token;

    return this.access_token;
  }

  async getAccessToken() {
    if (this.access_token) return this.access_token;

    return await this.createAccessToken();
  }

  async getMiniprogramCode() {
    // 后续可以用 redis 处理
    const scene = generateRandomNumber(6);
    const accessToken = await this.getAccessToken();

    const buffer: { data: Buffer } = await axios({
      method: 'post',
      url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`,
      data: {
        scene,
      },
      responseType: 'arraybuffer',
    });

    const base64 = buffer.data.toString('base64');
    const imgBase64 = `data:image/png;base64,${base64}`;

    return { imgBase64, code: scene };
  }

  async getMiniprogramCodeStatus(_imgCode: string) {
    // const data = await axios({
    //   method: 'post',
    //   url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`,
    //   data: {
    //     scene,
    //   },
    //   responseType: 'arraybuffer',
    // });
  }
}
