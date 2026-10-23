import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import type { ScryptOptions } from 'node:crypto';

const PASSWORD_MIN_LENGTH = 16;
const PASSWORD_MAX_LENGTH = 1024;
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_OPTIONS: ScryptOptions = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};

export interface BootstrapCredentials {
  username: string;
  password: string;
}

export function readBootstrapCredentials(
  env: NodeJS.ProcessEnv,
): BootstrapCredentials {
  const username = env.BOOTSTRAP_ADMIN_USERNAME;
  const password = env.BOOTSTRAP_ADMIN_PASSWORD;

  if (
    !username ||
    username.trim() !== username ||
    username.length > 100 ||
    !password ||
    password.trim().length === 0 ||
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    throw new Error(
      'Bootstrap administrator credentials are missing or invalid. Provide a username and a password of 16 to 1024 characters.',
    );
  }

  return { username, password };
}

function derivePasswordHash(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      SCRYPT_KEY_LENGTH,
      SCRYPT_OPTIONS,
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(derivedKey);
      },
    );
  });
}

export async function hashBootstrapPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = await derivePasswordHash(password, salt);
  return [
    'scrypt',
    String(SCRYPT_OPTIONS.N),
    String(SCRYPT_OPTIONS.r),
    String(SCRYPT_OPTIONS.p),
    salt.toString('base64url'),
    derivedKey.toString('base64url'),
  ].join('$');
}
