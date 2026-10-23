import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PrismaService } from '../database/prisma.service';
import {
  PUBLIC_ROUTE_METADATA,
  REQUIRED_PERMISSIONS_METADATA,
} from './authorization-metadata';
import type { Phase1PermissionKey } from './permission-catalog';

export interface AuthenticatedPrincipal {
  userId: string;
}

interface AuthorizationRequest extends Request {
  user?: AuthenticatedPrincipal;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isAuthenticatedPrincipal(
  principal: unknown,
): principal is AuthenticatedPrincipal {
  return (
    typeof principal === 'object' &&
    principal !== null &&
    'userId' in principal &&
    typeof principal.userId === 'string' &&
    UUID_PATTERN.test(principal.userId)
  );
}

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const controller = context.getClass();
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      PUBLIC_ROUTE_METADATA,
      [handler, controller],
    );
    const requiredPermissions = this.reflector.getAllAndOverride<
      readonly Phase1PermissionKey[]
    >(REQUIRED_PERMISSIONS_METADATA, [handler, controller]);

    if (isPublic && requiredPermissions?.length) {
      throw new ForbiddenException('Conflicting authorization policy.');
    }

    if (isPublic) {
      return true;
    }

    if (!requiredPermissions?.length) {
      throw new ForbiddenException(
        'An authorization policy is required for this route.',
      );
    }

    const request = context.switchToHttp().getRequest<AuthorizationRequest>();
    if (!isAuthenticatedPrincipal(request.user)) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findFirst({
      where: { id: request.user.userId, isActive: true },
      select: {
        userRoles: {
          select: {
            role: {
              select: {
                rolePermissions: {
                  select: {
                    permission: {
                      select: { code: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const effectivePermissions = new Set(
      user.userRoles.flatMap((userRole) =>
        userRole.role.rolePermissions.map(
          (rolePermission) => rolePermission.permission.code,
        ),
      ),
    );

    if (
      !requiredPermissions.every((permission) =>
        effectivePermissions.has(permission),
      )
    ) {
      throw new ForbiddenException('Insufficient permissions.');
    }

    return true;
  }
}
