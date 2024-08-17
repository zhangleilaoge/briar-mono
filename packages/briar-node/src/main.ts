import { NestFactory } from '@nestjs/core';
import { MainModule } from './modules/Main';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin:
      /(http:\/\/(www\.)?restrained-hunter\.website|http:\/\/localhost:5173|http:\/\/127\.0\.0\.1:5173)/,
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

  await app.listen(8922);

  console.log(`\nApplication is running on: ${await app.getUrl()}`);
}
bootstrap();
