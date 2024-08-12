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

  await app.listen(3000);

  console.log(`\nApplication is running on: ${await app.getUrl()}`);
}
bootstrap();
