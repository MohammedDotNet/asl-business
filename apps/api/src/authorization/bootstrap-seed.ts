import type { Prisma } from '../../generated/prisma/client';
import type { PrismaService } from '../database/prisma.service';
import {
  hashBootstrapPassword,
  readBootstrapCredentials,
} from './bootstrap-credentials';
import { phase1PermissionCatalog } from './permission-catalog';
import { roleTemplates } from './role-templates';

function getSystemAdminTemplate() {
  const template = roleTemplates.find((role) => role.code === 'SYSTEM_ADMIN');
  if (!template) {
    throw new Error('SYSTEM_ADMIN role template is missing.');
  }
  return template;
}

const systemAdminTemplate = getSystemAdminTemplate();
const MAX_TRANSACTION_ATTEMPTS = 3;

type BootstrapTransaction = Pick<
  Prisma.TransactionClient,
  'permission' | 'role' | 'rolePermission' | 'user' | 'userRole'
>;

async function seedAuthorizationData(
  transaction: BootstrapTransaction,
  credentials: ReturnType<typeof readBootstrapCredentials>,
  passwordHashFactory: (password: string) => Promise<string>,
): Promise<void> {
  const role = await transaction.role.upsert({
    where: { code: systemAdminTemplate.code },
    create: {
      code: systemAdminTemplate.code,
      name: systemAdminTemplate.name,
      description: systemAdminTemplate.description,
    },
    update: {},
    select: { id: true },
  });

  const seededPermissionIds = new Map<string, string>();
  for (const permission of phase1PermissionCatalog) {
    const seededPermission = await transaction.permission.upsert({
      where: { code: permission.key },
      create: {
        code: permission.key,
        description: permission.description,
      },
      update: {},
      select: { id: true, code: true },
    });
    seededPermissionIds.set(seededPermission.code, seededPermission.id);
  }

  for (const permissionKey of systemAdminTemplate.permissions) {
    const permissionId = seededPermissionIds.get(permissionKey);
    if (!permissionId) {
      throw new Error('SYSTEM_ADMIN references an unseeded permission.');
    }

    await transaction.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId,
        },
      },
      create: {
        roleId: role.id,
        permissionId,
      },
      update: {},
    });
  }

  const existingUser = await transaction.user.findUnique({
    where: { username: credentials.username },
    select: {
      id: true,
      userRoles: {
        select: { role: { select: { code: true } } },
      },
    },
  });

  if (existingUser) {
    const hasOnlySystemAdminRole =
      existingUser.userRoles.length === 1 &&
      existingUser.userRoles[0].role.code === systemAdminTemplate.code;
    if (!hasOnlySystemAdminRole) {
      throw new Error(
        'Bootstrap username must belong to a user with only the SYSTEM_ADMIN role. No account changes were made.',
      );
    }
  } else {
    const existingSystemAdminCount = await transaction.userRole.count({
      where: { roleId: role.id },
    });
    if (existingSystemAdminCount > 0) {
      throw new Error(
        'A SYSTEM_ADMIN account already exists under a different username. No account changes were made.',
      );
    }

    const passwordHash = await passwordHashFactory(credentials.password);
    await transaction.user.create({
      data: {
        username: credentials.username,
        passwordHash,
        userRoles: {
          create: { roleId: role.id },
        },
      },
      select: { id: true },
    });
  }

  const verifiedRole = await transaction.role.findUnique({
    where: { id: role.id },
    select: {
      rolePermissions: {
        select: { permission: { select: { code: true } } },
      },
    },
  });
  const grantedPermissions = new Set(
    verifiedRole?.rolePermissions.map(({ permission }) => permission.code),
  );
  if (
    grantedPermissions.size !== systemAdminTemplate.permissions.length ||
    !systemAdminTemplate.permissions.every((permission) =>
      grantedPermissions.has(permission),
    )
  ) {
    throw new Error(
      'SYSTEM_ADMIN permission assignments do not match the approved mapping.',
    );
  }

  const verifiedUser = await transaction.user.findUnique({
    where: { username: credentials.username },
    select: {
      userRoles: {
        select: { role: { select: { code: true } } },
      },
    },
  });
  if (
    !verifiedUser?.userRoles.some(
      ({ role: assignedRole }) =>
        assignedRole.code === systemAdminTemplate.code,
    )
  ) {
    throw new Error(
      'Bootstrap administrator role assignment could not be verified.',
    );
  }
}

function isRetryableTransactionError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error.code === 'P2034' || error.code === 'P2002')
  );
}

export async function seedInitialAdministrator(
  prisma: Pick<PrismaService, '$transaction'>,
  env: NodeJS.ProcessEnv = process.env,
  passwordHashFactory: (
    password: string,
  ) => Promise<string> = hashBootstrapPassword,
): Promise<void> {
  const credentials = readBootstrapCredentials(env);
  for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt += 1) {
    try {
      await prisma.$transaction(
        (transaction) =>
          seedAuthorizationData(transaction, credentials, passwordHashFactory),
        { isolationLevel: 'Serializable' },
      );
      return;
    } catch (error) {
      if (
        attempt === MAX_TRANSACTION_ATTEMPTS ||
        !isRetryableTransactionError(error)
      ) {
        throw error;
      }
    }
  }
}
