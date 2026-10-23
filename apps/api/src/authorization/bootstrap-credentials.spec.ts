import {
  hashBootstrapPassword,
  readBootstrapCredentials,
} from './bootstrap-credentials';

describe('bootstrap credentials', () => {
  it('accepts environment-provided credentials without echoing their values', () => {
    const username = 'bootstrap-owner';
    const password = 'very-long-bootstrap-secret';

    expect(
      readBootstrapCredentials({
        BOOTSTRAP_ADMIN_USERNAME: username,
        BOOTSTRAP_ADMIN_PASSWORD: password,
      }),
    ).toEqual({ username, password });

    let invalidMessage = '';
    try {
      readBootstrapCredentials({
        BOOTSTRAP_ADMIN_USERNAME: username,
        BOOTSTRAP_ADMIN_PASSWORD: 'short',
      });
    } catch (error) {
      invalidMessage =
        error instanceof Error ? error.message : 'Unexpected validation error.';
    }

    expect(invalidMessage).toBe(
      'Bootstrap administrator credentials are missing or invalid. Provide a username and a password of 16 to 1024 characters.',
    );
    expect(invalidMessage).not.toContain(username);
    expect(invalidMessage).not.toContain('short');
  });

  it('rejects missing, padded, and out-of-range credentials', () => {
    expect(() => readBootstrapCredentials({})).toThrow(
      'Bootstrap administrator credentials are missing or invalid.',
    );
    expect(() =>
      readBootstrapCredentials({
        BOOTSTRAP_ADMIN_USERNAME: ' padded ',
        BOOTSTRAP_ADMIN_PASSWORD: 'a'.repeat(16),
      }),
    ).toThrow();
    expect(() =>
      readBootstrapCredentials({
        BOOTSTRAP_ADMIN_USERNAME: 'bootstrap-owner',
        BOOTSTRAP_ADMIN_PASSWORD: 'a'.repeat(1025),
      }),
    ).toThrow();
  });

  it('stores a salted scrypt hash instead of the plaintext password', async () => {
    const password = 'very-long-bootstrap-secret';
    const firstHash = await hashBootstrapPassword(password);
    const secondHash = await hashBootstrapPassword(password);

    expect(firstHash).toMatch(
      /^scrypt\$16384\$8\$1\$[A-Za-z0-9_-]{22}\$[A-Za-z0-9_-]{86}$/,
    );
    expect(firstHash).not.toContain(password);
    expect(secondHash).not.toBe(firstHash);
  });
});
