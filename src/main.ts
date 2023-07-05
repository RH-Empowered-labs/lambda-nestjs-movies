import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  let port = process.env.PORT || 4000
  await app.listen(port);
  console.log(`Application running in port ${port}`);
}
bootstrap();
