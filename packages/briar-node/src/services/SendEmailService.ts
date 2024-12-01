import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import * as tencentcloud from 'tencentcloud-sdk-nodejs-ses';

import { EmailTemplate } from '@/constants/email';

const SesClient = tencentcloud.ses.v20201002.Client;

const clientConfig = {
  credential: {
    secretId: process.env.BRIAR_TX_SEC_ID,
    secretKey: process.env.BRIAR_TX_SEC_KEY,
  },
  region: 'ap-hongkong',
  profile: {
    httpProfile: {
      endpoint: 'ses.tencentcloudapi.com',
    },
  },
};

const client = new SesClient(clientConfig);

@Injectable()
export class SendEmailService {
  constructor() {}

  async sendEmail(
    targetEmail: string,
    template: {
      TemplateID: EmailTemplate;
      TemplateData: Record<string, any>;
      subject: string;
    },
  ) {
    return new Promise((resolve, reject) => {
      const params = {
        FromEmailAddress: 'zhangleilaoge <zhangleilaoge@stardew.site>',
        Destination: [targetEmail],
        Template: {
          TemplateID: template.TemplateID,
          TemplateData: JSON.stringify(template.TemplateData),
        },
        Subject: template.subject,
      };

      client.SendEmail(params).then(
        () => {
          resolve(true);
        },
        (err) => {
          console.error('error', err);
          reject(false);
        },
      );
    });
  }
}
