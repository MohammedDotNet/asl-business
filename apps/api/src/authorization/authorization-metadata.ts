import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';
import type { Phase1PermissionKey } from './permission-catalog';

export const PUBLIC_ROUTE_METADATA = 'authorization:public';
export const REQUIRED_PERMISSIONS_METADATA = 'authorization:permissions';

export function Public(): CustomDecorator<typeof PUBLIC_ROUTE_METADATA> {
  return SetMetadata(PUBLIC_ROUTE_METADATA, true);
}

export function RequirePermissions(
  ...permissions: [Phase1PermissionKey, ...Phase1PermissionKey[]]
): CustomDecorator<typeof REQUIRED_PERMISSIONS_METADATA> {
  return SetMetadata(REQUIRED_PERMISSIONS_METADATA, permissions);
}
