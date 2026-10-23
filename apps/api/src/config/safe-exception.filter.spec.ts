import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import type { Response } from 'express';
import { SafeExceptionFilter } from './safe-exception.filter';

describe('SafeExceptionFilter', () => {
  let filter: SafeExceptionFilter;
  let response: Pick<Response, 'status' | 'json'>;
  let logger: jest.SpyInstance;

  beforeEach(() => {
    filter = new SafeExceptionFilter();
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    logger = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    logger.mockRestore();
  });

  it('preserves HTTP status codes and uses a safe message', () => {
    const secret = 'password-or-token-value';

    filter.catch(
      new HttpException(secret, HttpStatus.UNAUTHORIZED),
      createHttpArgumentsHost(response),
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
    });
    expect(logger).not.toHaveBeenCalled();
  });

  it('returns a generic 500 and logs no exception details', () => {
    const secret = 'database-url-password';

    filter.catch(new Error(secret), createHttpArgumentsHost(response));

    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
    expect(logger).toHaveBeenCalledWith('Unhandled server exception');
    expect(logger).not.toHaveBeenCalledWith(expect.stringContaining(secret));
  });
});

function createHttpArgumentsHost(
  response: Pick<Response, 'status' | 'json'>,
): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  } as ArgumentsHost;
}
