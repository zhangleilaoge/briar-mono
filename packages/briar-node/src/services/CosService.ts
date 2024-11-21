import 'dotenv/config';

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RUNTIME_PREFIX } from 'briar-shared';
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

  clearRuntimeImgs(keys: string[]) {
    const clear = (keys: string[]) => {
      return new Promise((resolve, reject) => {
        cos.deleteMultipleObject(
          {
            Bucket: process.env.BRIAR_TX_BUCKET_NAME,
            Region: process.env.BRIAR_TX_BUCKET_REGION,
            Objects: keys.map((key) => ({ Key: RUNTIME_PREFIX + key })),
          },
          function (err, data) {
            if (err) {
              reject(err);
            } else {
              console.log(data);
              resolve(data);
            }
          },
        );
      });
    };

    return clear(keys);
  }
}
