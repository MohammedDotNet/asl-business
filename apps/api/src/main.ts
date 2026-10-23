import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApi } from './config/configure-api';
import { loadApiEnvironment } from './config/environment';
import type { ApiEnvironmentConfig } from './config/environment';

async function bootstrap() {
  let config: ApiEnvironmentConfig;
  try {
    config = loadApiEnvironment();
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : 'Invalid API environment configuration.',
    );
    process.exitCode = 1;
    return;
  }

  const app = await NestFactory.create(AppModule);
  configureApi(app, config);
  await app.listen(config.port);
}

void bootstrap();
