import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as COS from 'cos-nodejs-sdk-v5';

const cos = new COS({
  SecretId: process.env.BRIAR_TX_SEC_ID,
  SecretKey: process.env.BRIAR_TX_SEC_KEY,
});

const runtimePath = 'runtime-images';

@Injectable()
export class CosService {
  constructor() {}

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

  async uploadBase64ToCos(key, base64Url) {
    return await new Promise(async (resolve, reject) => {
      cos.putObject(
        {
          Bucket: process.env.BRIAR_TX_BUCKET_NAME,
          Region: process.env.BRIAR_TX_BUCKET_REGION,
          Key: runtimePath + '/' + String(Date.now()) + key,
          StorageClass: 'STANDARD',
          Body: Buffer.from(base64Url.split(',')[1], 'base64'), // 被上传的文件对象
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

  // 定时任务所在的服务不能有任何请求级别的依赖，所以这个方法是无效的，后续有空迁移一下
  // @Cron(CronExpression.EVERY_WEEK)
  // clearRuntimeImgs() {
  //   const clear = (keys: string[]) => {
  //     const logger = this.logger;
  //     logger.log(`start clear: ${JSON.stringify(keys)}`);

  //     cos.deleteMultipleObject(
  //       {
  //         Bucket: process.env.BRIAR_TX_BUCKET_NAME,
  //         Region: process.env.BRIAR_TX_BUCKET_REGION,
  //         Objects: keys.map((key) => ({ Key: key })),
  //       },
  //       function (err) {
  //         if (err) {
  //           logger.error(err);
  //         } else {
  //           logger.log(`clear success, total: ${keys.length}`);
  //         }
  //       },
  //     );
  //   };

  //   cos.getBucket(
  //     {
  //       Bucket: process.env.BRIAR_TX_BUCKET_NAME,
  //       Region: process.env.BRIAR_TX_BUCKET_REGION,
  //       Prefix: 'runtime-images/', // Prefix表示列出的object的key以prefix开始，非必须
  //       Delimiter: '/',
  //     },
  //     function (err, data) {
  //       const logger = this.logger;
  //       if (err) {
  //         logger.error(err);
  //       } else {
  //         const imgsToBeClear = data.Contents.filter(({ LastModified }) => {
  //           const existMonth = differenceInMonths(new Date(), LastModified);

  //           return existMonth > 0;
  //         }).map((item) => item.Key);

  //         imgsToBeClear.length && clear(imgsToBeClear);
  //       }
  //     },
  //   );
  // }
}
