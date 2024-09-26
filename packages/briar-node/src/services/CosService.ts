import 'dotenv/config';

import axios from 'axios';
import * as COS from 'cos-nodejs-sdk-v5';

const cos = new COS({
  SecretId: process.env.BRIAR_TX_SEC_ID,
  SecretKey: process.env.BRIAR_TX_SEC_KEY,
});

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { differenceInMonths } from 'date-fns';

import { LogService } from './LogService';

@Injectable()
export class CosService {
  constructor(private readonly logger: LogService) {}

  async uploadImg2Cos(key, imgUrl) {
    return await new Promise(async (resolve, reject) => {
      const imgData = await axios({
        method: 'get',
        url: imgUrl,
        responseType: 'stream',
      });

      cos.putObject(
        {
          Bucket: process.env.BRIAR_TX_BUCKET_NAME,
          Region: process.env.BRIAR_TX_BUCKET_REGION,
          Key: key,
          StorageClass: 'STANDARD',
          Body: imgData.data, // 被上传的文件对象
        },
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve('https://' + data.Location);
          }
        },
      );
    });
  }

  @Cron(CronExpression.EVERY_WEEK)
  clearRuntimeImgs() {
    const clear = (keys: string[]) => {
      const logger = this.logger;
      logger.log(`start clear: ${JSON.stringify(keys)}`);

      cos.deleteMultipleObject(
        {
          Bucket: process.env.BRIAR_TX_BUCKET_NAME,
          Region: process.env.BRIAR_TX_BUCKET_REGION,
          Objects: keys.map((key) => ({ Key: key })),
        },
        function (err) {
          if (err) {
            logger.error(err);
          } else {
            logger.log(`clear success, total: ${keys.length}`);
          }
        },
      );
    };

    cos.getBucket(
      {
        Bucket: process.env.BRIAR_TX_BUCKET_NAME,
        Region: process.env.BRIAR_TX_BUCKET_REGION,
        Prefix: 'runtime-images/', // Prefix表示列出的object的key以prefix开始，非必须
        Delimiter: '/',
      },
      function (err, data) {
        const logger = this.logger;
        if (err) {
          logger.error(err);
        } else {
          const imgsToBeClear = data.Contents.filter(({ LastModified }) => {
            const existMonth = differenceInMonths(new Date(), LastModified);

            return existMonth > 0;
          }).map((item) => item.Key);

          imgsToBeClear.length && clear(imgsToBeClear);
        }
      },
    );
  }
}
