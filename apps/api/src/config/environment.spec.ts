import { validateApiEnvironment } from './environment';

const validDatabaseUrl =
  'postgresql://user:password@localhost:5432/asl_business';

describe('validateApiEnvironment', () => {
  it('uses development defaults for the port and frontend origin', () => {
    expect(validateApiEnvironment({ DATABASE_URL: validDatabaseUrl })).toEqual({
      environment: 'development',
      port: 3001,
      corsOrigins: ['http://localhost:3000'],
    });
  });

  it('rejects a missing DATABASE_URL without revealing environment values', () => {
    expect(() => validateApiEnvironment({})).toThrow(
      'DATABASE_URL is required.',
    );
  });

  it('rejects invalid database URLs without including their value in errors', () => {
    const secret =
      'invalid://sensitive-user:sensitive-password';

    let error: Error | undefined;
    try {
      validateApiEnvironment({ DATABASE_URL: secret });
    } catch (caught) {
      error = caught instanceof Error ? caught : new Error('Unknown error');
    }

    expect(error?.message).toBe(
      'DATABASE_URL must be a valid PostgreSQL connection URL.',
    );
    expect(error?.message).not.toContain(secret);
  });

  it.each(['0', '65536', '1.5', 'not-a-port'])(
    'rejects invalid port %s',
    (port) => {
      expect(() =>
        validateApiEnvironment({
          DATABASE_URL: validDatabaseUrl,
          PORT: port,
        }),
      ).toThrow('PORT must be an integer between 1 and 65535.');
    },
  );

  it('accepts a valid custom port', () => {
    expect(
      validateApiEnvironment({
        DATABASE_URL: validDatabaseUrl,
        PORT: '3100',
      }).port,
    ).toBe(3100);
  });

  it('requires explicit HTTPS CORS origins in production', () => {
    expect(() =>
      validateApiEnvironment({
        DATABASE_URL: validDatabaseUrl,
        NODE_ENV: 'production',
      }),
    ).toThrow('CORS_ORIGINS is required in production');

    expect(
      validateApiEnvironment({
        DATABASE_URL: validDatabaseUrl,
        NODE_ENV: 'production',
        CORS_ORIGINS: 'https://app.example.com,https://admin.example.com',
      }).corsOrigins,
    ).toEqual(['https://app.example.com', 'https://admin.example.com']);
  });

  it.each([
    '*',
    'https://*.example.com',
    'https://app.example.com/path',
    'http://app.example.com',
    'https://user:password@app.example.com',
  ])('rejects unsafe production origin %s', (origin) => {
    expect(() =>
      validateApiEnvironment({
        DATABASE_URL: validDatabaseUrl,
        NODE_ENV: 'production',
        CORS_ORIGINS: origin,
      }),
    ).toThrow('CORS_ORIGINS must contain only explicit HTTPS origins.');
  });

  it('rejects unsupported NODE_ENV values', () => {
    expect(() =>
      validateApiEnvironment({
        DATABASE_URL: validDatabaseUrl,
        NODE_ENV: 'staging',
      }),
    ).toThrow('NODE_ENV must be development, test, or production.');
  });
});
