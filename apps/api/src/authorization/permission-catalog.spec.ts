import {
  permissionCatalog,
  phase1PermissionCatalog,
} from './permission-catalog';
import { roleTemplates } from './role-templates';

describe('permission catalog', () => {
  it('contains unique, stable resource.action keys with separate labels', () => {
    const keys = permissionCatalog.map((permission) => permission.key);

    expect(new Set(keys).size).toBe(keys.length);
    for (const permission of permissionCatalog) {
      expect(permission.key).toMatch(/^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/);
      expect(permission.label).not.toBe(permission.key);
      expect(permission.description.trim()).not.toBe('');
    }
  });

  it('keeps future-module permissions marked as proposed', () => {
    const phase1Keys = new Set<string>(
      phase1PermissionCatalog.map((permission) => permission.key),
    );
    const proposedPermissions = permissionCatalog.filter(
      (permission) => permission.scope === 'proposed',
    );

    expect(
      proposedPermissions.every(
        (permission) => !phase1Keys.has(permission.key),
      ),
    ).toBe(true);
  });

  it('uses unique role template codes and only catalogued Phase 1 grants', () => {
    const codes = roleTemplates.map((role) => role.code);
    const phase1Keys = new Set(
      phase1PermissionCatalog.map((permission) => permission.key),
    );

    expect(new Set(codes).size).toBe(codes.length);
    for (const role of roleTemplates) {
      expect(role.permissions.every((key) => phase1Keys.has(key))).toBe(true);
    }
  });

  it('grants only Phase 1 permissions to SYSTEM_ADMIN', () => {
    const systemAdmin = roleTemplates.find(
      (role) => role.code === 'SYSTEM_ADMIN',
    );

    expect(systemAdmin?.permissions).toEqual(
      phase1PermissionCatalog.map((permission) => permission.key),
    );
    expect(
      roleTemplates
        .filter((role) => role.code !== 'SYSTEM_ADMIN')
        .every((role) => role.permissions.length === 0),
    ).toBe(true);
    expect(roleTemplates.map((role) => role.code)).not.toContain('OWNER');
    expect(
      roleTemplates.find((role) => role.code === 'SYSTEM_ADMIN')?.protected,
    ).toBe(true);
  });
});
