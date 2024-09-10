import { NestFactory } from '@nestjs/core';
import { MainModule } from './modules/MainModule';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { localHost } from './constants/env';

const origins = [
  /http(s)?:\/\/(www\.)?restrained-hunter\.website/,
  /http(s)?:\/\/localhost:5173/,
  /http(s)?:\/\/127\.0\.0\.1:5173/,
  /http(s)?:\/\/122\.51\.158\.41:5173/,
];

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: origins,
    methods: 'GET,PUT,POST',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: [
      'Content-Length',
      'Content-Type',
      'X-Content-Range',
      'Content-Range',
    ], // 可以公开的响应头
    credentials: true,
    maxAge: 20000,
  });

  // 生产环境在 docker 环境运行，所以 ip 地址为 0.0.0.0
  await app.listen(8922, localHost);

  console.log(`\nApplication is running on: ${await app.getUrl()}`);
}
bootstrap();
