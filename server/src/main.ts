import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.PROD ? process.env.CLIENT_URL : '*',
    },
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
