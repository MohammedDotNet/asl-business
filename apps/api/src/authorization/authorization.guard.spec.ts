import {
  ForbiddenException,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { AuthorizationGuard } from './authorization.guard';
import { Public, RequirePermissions } from './authorization-metadata';

const ACTIVE_USER_ID = '29c7945d-5d8a-4711-bb8c-318ee5fb657e';

class AuthorizationTestController {
  @Public()
  publicRoute(this: void): void {}

  @RequirePermissions('users.view')
  viewUsers(this: void): void {}

  @RequirePermissions('users.create')
  createUsers(this: void): void {}

  @RequirePermissions('users.view', 'roles.view')
  viewUsersAndRoles(this: void): void {}

  unprotectedRoute(this: void): void {}

  @Public()
  @RequirePermissions('users.view')
  conflictingRoute(this: void): void {}
}

function createContext(
  handler: Function,
  request: { user?: unknown; body?: unknown },
): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => AuthorizationTestController,
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

describe('AuthorizationGuard', () => {
  let guard: AuthorizationGuard;
  let module: TestingModule;
  let findFirst: jest.Mock;

  beforeEach(async () => {
    findFirst = jest.fn();
    module = await Test.createTestingModule({
      providers: [
        AuthorizationGuard,
        Reflector,
        {
          provide: PrismaService,
          useValue: { user: { findFirst } },
        },
      ],
    }).compile();
    guard = module.get(AuthorizationGuard);
  });

  afterEach(async () => {
    await module.close();
  });

  it('allows explicitly public routes without a database lookup', async () => {
    const result = await guard.canActivate(
      createContext(AuthorizationTestController.prototype.publicRoute, {}),
    );

    expect(result).toBe(true);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('denies routes without an explicit policy by default', async () => {
    await expect(
      guard.canActivate(
        createContext(AuthorizationTestController.prototype.unprotectedRoute, {
          user: { userId: ACTIVE_USER_ID },
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('rejects conflicting public and permission metadata', async () => {
    await expect(
      guard.canActivate(
        createContext(
          AuthorizationTestController.prototype.conflictingRoute,
          {},
        ),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('returns unauthorized when no trusted principal is present', async () => {
    await expect(
      guard.canActivate(
        createContext(AuthorizationTestController.prototype.viewUsers, {
          body: { userId: ACTIVE_USER_ID, permissions: ['users.view'] },
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('rejects malformed principal identifiers', async () => {
    await expect(
      guard.canActivate(
        createContext(AuthorizationTestController.prototype.viewUsers, {
          user: { userId: 'not-a-uuid' },
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('allows a user with every required permission across multiple roles', async () => {
    findFirst.mockResolvedValue({
      userRoles: [
        {
          role: {
            rolePermissions: [{ permission: { code: 'users.view' } }],
          },
        },
        {
          role: {
            rolePermissions: [{ permission: { code: 'roles.view' } }],
          },
        },
      ],
    });

    await expect(
      guard.canActivate(
        createContext(AuthorizationTestController.prototype.viewUsersAndRoles, {
          user: { userId: ACTIVE_USER_ID },
        }),
      ),
    ).resolves.toBe(true);
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: ACTIVE_USER_ID, isActive: true },
      }),
    );
  });

  it('does not infer create permission from view permission', async () => {
    findFirst.mockResolvedValue({
      userRoles: [
        {
          role: {
            rolePermissions: [{ permission: { code: 'users.view' } }],
          },
        },
      ],
    });

    await expect(
      guard.canActivate(
        createContext(AuthorizationTestController.prototype.createUsers, {
          user: { userId: ACTIVE_USER_ID },
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('returns unauthorized for missing or inactive users', async () => {
    findFirst.mockResolvedValue(null);

    await expect(
      guard.canActivate(
        createContext(AuthorizationTestController.prototype.viewUsers, {
          user: { userId: ACTIVE_USER_ID },
        }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
