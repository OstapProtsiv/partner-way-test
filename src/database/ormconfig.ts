import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppModule } from '../app.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const getOrmConfig = app.select(ConfigModule).get(ConfigService).getOrmConfig;
  return new DataSource(getOrmConfig);
}

export default bootstrap();
