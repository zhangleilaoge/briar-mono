import * as COS from 'cos-nodejs-sdk-v5';
import axios from 'axios';
import 'dotenv/config';

const cos = new COS({
  SecretId: process.env.BRIAR_TX_SEC_ID,
  SecretKey: process.env.BRIAR_TX_SEC_KEY,
});

import { Injectable } from '@nestjs/common';

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
}
