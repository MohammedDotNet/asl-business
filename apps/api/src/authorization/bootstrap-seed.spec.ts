import { PrismaService } from '../database/prisma.service';
import { phase1PermissionCatalog } from './permission-catalog';
import { roleTemplates } from './role-templates';
import { seedInitialAdministrator } from './bootstrap-seed';

const adminRole = roleTemplates.find((role) => role.code === 'SYSTEM_ADMIN')!;
const env = {
  BOOTSTRAP_ADMIN_USERNAME: 'bootstrap-owner',
  BOOTSTRAP_ADMIN_PASSWORD: 'test-only-password-long-enough',
};
const passwordHash = 'scrypt$test-only-hash';

function createTransaction(existingUser?: {
  id: string;
  userRoles: { role: { code: string | null } }[];
}) {
  const rolePermissions = phase1PermissionCatalog.map((permission) => ({
    permission: { code: permission.key },
  }));
  const transaction = {
    role: {
      upsert: jest.fn().mockResolvedValue({ id: 'system-admin-role-id' }),
      findUnique: jest.fn().mockResolvedValue({ rolePermissions }),
    },
    permission: {
      upsert: jest
        .fn()
        .mockImplementation(({ where }: { where: { code: string } }) =>
          Promise.resolve({ id: where.code, code: where.code }),
        ),
    },
    rolePermission: {
      upsert: jest.fn().mockResolvedValue({}),
    },
    user: {
      findUnique: jest
        .fn()
        .mockResolvedValueOnce(existingUser ?? null)
        .mockResolvedValueOnce(
          existingUser ?? {
            id: 'bootstrap-user-id',
            userRoles: [{ role: { code: adminRole.code } }],
          },
        ),
      create: jest.fn().mockResolvedValue({ id: 'bootstrap-user-id' }),
    },
    userRole: {
      count: jest.fn().mockResolvedValue(0),
    },
  };

  return transaction;
}

function createPrismaMock(
  transaction: ReturnType<typeof createTransaction>,
  transactionFailures: unknown[] = [],
) {
  const prisma = {
    $transaction: jest.fn(
      async (
        callback: (value: typeof transaction) => Promise<void>,
      ): Promise<void> => {
        if (transactionFailures.length > 0) {
          throw transactionFailures.shift();
        }
        return callback(transaction);
      },
    ),
  };
  return prisma as unknown as Pick<PrismaService, '$transaction'>;
}

describe('initial authorization seed', () => {
  it('seeds Phase 1 permissions, grants SYSTEM_ADMIN, and creates one hashed-password account', async () => {
    const transaction = createTransaction();
    const prisma = createPrismaMock(transaction);
    const hashPassword = jest.fn().mockResolvedValue(passwordHash);

    await seedInitialAdministrator(prisma, env, hashPassword);

    expect(transaction.permission.upsert).toHaveBeenCalledTimes(
      phase1PermissionCatalog.length,
    );
    expect(
      transaction.permission.upsert.mock.calls.map(([args]) => args.where.code),
    ).toEqual(phase1PermissionCatalog.map((permission) => permission.key));
    expect(transaction.rolePermission.upsert).toHaveBeenCalledTimes(
      adminRole.permissions.length,
    );
    expect(
      transaction.rolePermission.upsert.mock.calls.map(
        ([args]) => args.where.roleId_permissionId.permissionId,
      ),
    ).toEqual(adminRole.permissions);
    expect(transaction.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          username: env.BOOTSTRAP_ADMIN_USERNAME,
          passwordHash,
          userRoles: {
            create: { roleId: 'system-admin-role-id' },
          },
        }),
        select: { id: true },
      }),
    );
    expect(hashPassword).toHaveBeenCalledWith(env.BOOTSTRAP_ADMIN_PASSWORD);
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: 'Serializable',
    });
  });

  it('preserves an existing system administrator account and password on rerun', async () => {
    const existingUser = {
      id: 'existing-user-id',
      userRoles: [{ role: { code: adminRole.code } }],
    };
    const transaction = createTransaction(existingUser);
    const hashPassword = jest.fn().mockResolvedValue(passwordHash);

    await seedInitialAdministrator(
      createPrismaMock(transaction),
      env,
      hashPassword,
    );

    expect(transaction.user.create).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
  });

  it('refuses to attach system administrator privileges to an existing unrelated account', async () => {
    const existingUser = {
      id: 'existing-user-id',
      userRoles: [{ role: { code: 'ACCOUNTANT' } }],
    };
    const transaction = createTransaction(existingUser);

    await expect(
      seedInitialAdministrator(
        createPrismaMock(transaction),
        env,
        async () => passwordHash,
      ),
    ).rejects.toThrow(
      'Bootstrap username must belong to a user with only the SYSTEM_ADMIN role.',
    );

    expect(transaction.user.create).not.toHaveBeenCalled();
  });

  it('refuses to preserve a system administrator with additional roles', async () => {
    const existingUser = {
      id: 'existing-user-id',
      userRoles: [
        { role: { code: adminRole.code } },
        { role: { code: 'ACCOUNTANT' } },
      ],
    };
    const transaction = createTransaction(existingUser);

    await expect(
      seedInitialAdministrator(
        createPrismaMock(transaction),
        env,
        async () => passwordHash,
      ),
    ).rejects.toThrow(
      'Bootstrap username must belong to a user with only the SYSTEM_ADMIN role.',
    );

    expect(transaction.user.create).not.toHaveBeenCalled();
  });

  it('refuses to create another bootstrap administrator account', async () => {
    const transaction = createTransaction();
    transaction.user.findUnique.mockReset().mockResolvedValueOnce(null);
    transaction.userRole.count.mockResolvedValue(1);
    const hashPassword = jest.fn().mockResolvedValue(passwordHash);

    await expect(
      seedInitialAdministrator(
        createPrismaMock(transaction),
        env,
        hashPassword,
      ),
    ).rejects.toThrow(
      'A SYSTEM_ADMIN account already exists under a different username.',
    );

    expect(transaction.user.create).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
  });

  it('refuses to preserve unapproved permissions on SYSTEM_ADMIN', async () => {
    const transaction = createTransaction();
    transaction.role.findUnique.mockResolvedValue({
      rolePermissions: [
        ...phase1PermissionCatalog.map((permission) => ({
          permission: { code: permission.key },
        })),
        { permission: { code: 'customers.view' } },
      ],
    });

    await expect(
      seedInitialAdministrator(
        createPrismaMock(transaction),
        env,
        async () => passwordHash,
      ),
    ).rejects.toThrow(
      'SYSTEM_ADMIN permission assignments do not match the approved mapping.',
    );
  });

  it.each(['P2034', 'P2002'])(
    'retries a serializable transaction after %s',
    async (code) => {
      const transaction = createTransaction();
      const prisma = createPrismaMock(transaction, [{ code }]);

      await seedInitialAdministrator(prisma, env, async () => passwordHash);

      expect(prisma.$transaction).toHaveBeenCalledTimes(2);
    },
  );

  it('stops after the bounded retry limit', async () => {
    const transaction = createTransaction();
    const prisma = createPrismaMock(transaction, [
      { code: 'P2034' },
      { code: 'P2034' },
      { code: 'P2034' },
    ]);

    await expect(
      seedInitialAdministrator(prisma, env, async () => passwordHash),
    ).rejects.toEqual({ code: 'P2034' });

    expect(prisma.$transaction).toHaveBeenCalledTimes(3);
  });
});
