import { Injectable, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaModule } from './prisma.module';

@Injectable()
class PrismaServiceConsumer {
  constructor(readonly prisma: PrismaService) {}
}

describe('PrismaService', () => {
  let service: PrismaService;
  let originalDatabaseUrl: string | undefined;

  beforeAll(() => {
    originalDatabaseUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL =
      'postgresql://test:test@localhost:5432/asl_business';
  });

  afterAll(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  beforeEach(() => {
    service = new PrismaService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('connects when the Nest module initializes', async () => {
    const connect = jest
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined);
    const query = jest
      .spyOn(service, '$queryRaw')
      .mockResolvedValue([]);

    await service.onModuleInit();

    expect(connect).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('logs only a safe database error code and rejects with a safe error on connection failure', async () => {
    const secret = 'postgresql://user:secret@database.internal/private';
    const connectionError = Object.assign(new Error(secret), {
      code: 'ECONNREFUSED',
    });
    const connect = jest
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined);
    const query = jest
      .spyOn(service, '$queryRaw')
      .mockRejectedValue(connectionError);
    const log = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    await expect(service.onModuleInit()).rejects.toThrow(
      'Database connection failed.',
    );

    expect(connect).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith(
      'Database connection failed (ECONNREFUSED). Check PostgreSQL availability and configuration.',
    );
    expect(log.mock.calls.flat().join(' ')).not.toContain(secret);
  });

  it('disconnects when the Nest module is destroyed', async () => {
    const disconnect = jest
      .spyOn(service, '$disconnect')
      .mockResolvedValue(undefined);

    await service.onModuleDestroy();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('is registered and injectable from PrismaModule', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaServiceConsumer],
    }).compile();

    const injectedService = module.get(PrismaService);
    const consumer = module.get(PrismaServiceConsumer);
    jest.spyOn(injectedService, '$disconnect').mockResolvedValue(undefined);
    expect(consumer.prisma).toBe(injectedService);

    await module.close();
  });
});
