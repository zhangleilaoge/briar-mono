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
    origin: isDev
      ? 'http://127.0.0.1:5173'
      : /http:\/\/(www\.)?restrained-hunter\.website/,
    methods: 'GET,PUT,POST',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true,
    maxAge: 10000,
  });

  await app.listen(8922);

  console.log(`\nApplication is running on: ${await app.getUrl()}`);
}
bootstrap();
