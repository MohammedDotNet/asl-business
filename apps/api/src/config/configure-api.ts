import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { ApiEnvironmentConfig } from './environment';
import { SafeExceptionFilter } from './safe-exception.filter';

export function configureApi(
  app: INestApplication,
  config: ApiEnvironmentConfig,
): void {
  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: () => new BadRequestException(),
    }),
  );
  app.useGlobalFilters(new SafeExceptionFilter());
}
