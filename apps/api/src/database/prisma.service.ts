import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

function createAdapter(): PrismaPg {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL must be configured before PrismaService.');
  }

  return new PrismaPg({ connectionString });
}

function getSafeErrorCode(error: unknown): string | undefined {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('code' in error) ||
    typeof error.code !== 'string' ||
    !/^[A-Z0-9_]+$/.test(error.code)
  ) {
    return undefined;
  }

  return error.code;
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ adapter: createAdapter() });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`;
    } catch (error) {
      const code = getSafeErrorCode(error);
      this.logger.error(
        `Database connection failed${code ? ` (${code})` : ''}. Check PostgreSQL availability and configuration.`,
      );
      throw new Error('Database connection failed.');
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
    } catch (error) {
      const code = getSafeErrorCode(error);
      this.logger.error(
        `Database disconnection failed${code ? ` (${code})` : ''}.`,
      );
      throw new Error('Database disconnection failed.');
    }
  }
}
