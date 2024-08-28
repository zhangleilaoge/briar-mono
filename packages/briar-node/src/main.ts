import { NestFactory } from '@nestjs/core';
import { MainModule } from './modules/Main';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { isDev } from './constants/env';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: [
      /http:\/\/(www\.)?restrained-hunter\.website/,
      /https:\/\/(www\.)?restrained-hunter\.website/,
      /http:\/\/localhost:5173/,
      /https:\/\/localhost:5173/,
      /http:\/\/127\.0\.0\.1:5173/,
      /https:\/\/127\.0\.0\.1:5173/,
      /http:\/\/122\.51\.158\.41/,
      /https:\/\/122\.51\.158\.41/,
    ],
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

  // 生产环境请在 docker 环境运行，所以 ip 地址为 0.0.0.0
  await app.listen(8922, isDev ? '127.0.0.1' : '0.0.0.0');

  console.log(`\nApplication is running on: ${await app.getUrl()}`);
}
bootstrap();
