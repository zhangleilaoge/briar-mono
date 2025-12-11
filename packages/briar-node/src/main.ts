import compression from '@fastify/compress';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { localHost, origins } from './constants/env';
import { MainModule } from './modules/MainModule';

process.on('uncaughtException', (err) => {
  console.error('[FATAL] uncaughtException', err);
  // 不写 process.exit(1) 就不会退出
});

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter({ bodyLimit: 10048576 }),
    { abortOnError: false },
  );

  // @ts-ignore
  await app.register(compression, { encodings: ['gzip', 'deflate'] });

  app.enableCors({
    origin: origins,
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,x-trace-id',
    exposedHeaders: [
      'Content-Length',
      'Content-Type',
      'X-Content-Range',
      'Content-Range',
    ], // 可以公开的响应头
    credentials: true,
    maxAge: 30000,
  });

  // 生产环境在 docker 环境运行，所以 ip 地址为 0.0.0.0
  await app.listen(8922, localHost);

  console.log(`\nApplication is running on: ${await app.getUrl()}`);
}
bootstrap();
