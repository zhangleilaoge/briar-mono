import COS from 'cos-nodejs-sdk-v5';
import axios from 'axios';

const cos = new COS({
  SecretId: process.env.SecretId,
  SecretKey: process.env.SecretKey,
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
          Bucket: 'briar-shanghai-1309736035',
          Region: 'ap-shanghai',
          Key: key,
          StorageClass: 'STANDARD',
          Body: imgData.data, // 被上传的文件对象
        },
        function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data.Location);
          }
        },
      );
    });
  }
}
