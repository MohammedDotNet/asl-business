import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export type ApiEnvironment = 'development' | 'test' | 'production';

export interface ApiEnvironmentConfig {
  environment: ApiEnvironment;
  port: number;
  corsOrigins: string[];
}

const DEVELOPMENT_ORIGIN = 'http://localhost:3000';

export function loadApiEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): ApiEnvironmentConfig {
  const envFile = resolve(__dirname, '..', '..', '.env');

  if (existsSync(envFile)) {
    try {
      process.loadEnvFile(envFile);
    } catch {
      throw new Error(
        'Unable to load API environment file. Check its syntax without sharing secret values.',
      );
    }
  }

  return validateApiEnvironment(env);
}

export function validateApiEnvironment(
  env: NodeJS.ProcessEnv,
): ApiEnvironmentConfig {
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required.');
  }

  try {
    const parsedDatabaseUrl = new URL(databaseUrl);
    if (
      !['postgres:', 'postgresql:'].includes(parsedDatabaseUrl.protocol) ||
      !parsedDatabaseUrl.hostname
    ) {
      throw new Error();
    }
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }

  const environment = env.NODE_ENV ?? 'development';
  if (
    environment !== 'development' &&
    environment !== 'test' &&
    environment !== 'production'
  ) {
    throw new Error('NODE_ENV must be development, test, or production.');
  }

  const portValue = env.PORT ?? '3001';
  if (!/^\d+$/.test(portValue)) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  const port = Number(portValue);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  const configuredOrigins = parseCorsOrigins(env.CORS_ORIGINS, environment);

  return {
    environment,
    port,
    corsOrigins:
      environment === 'production'
        ? configuredOrigins
        : [...new Set([DEVELOPMENT_ORIGIN, ...configuredOrigins])],
  };
}

function parseCorsOrigins(
  value: string | undefined,
  environment: ApiEnvironment,
): string[] {
  if (!value?.trim()) {
    if (environment === 'production') {
      throw new Error(
        'CORS_ORIGINS is required in production and must list allowed HTTPS origins.',
      );
    }
    return [];
  }

  const origins = value.split(',').map((origin) => origin.trim());
  if (origins.some((origin) => !origin)) {
    throw new Error('CORS_ORIGINS must be a comma-separated origin list.');
  }

  for (const origin of origins) {
    try {
      const parsedOrigin = new URL(origin);
      if (
        origin.includes('*') ||
        parsedOrigin.origin !== origin ||
        !['http:', 'https:'].includes(parsedOrigin.protocol) ||
        (environment === 'production' && parsedOrigin.protocol !== 'https:')
      ) {
        throw new Error();
      }
    } catch {
      throw new Error(
        environment === 'production'
          ? 'CORS_ORIGINS must contain only explicit HTTPS origins.'
          : 'CORS_ORIGINS must contain explicit HTTP or HTTPS origins.',
      );
    }
  }

  return [...new Set(origins)];
}
