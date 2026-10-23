import {
  phase1PermissionCatalog,
  type Phase1PermissionKey,
} from './permission-catalog';

const systemAdminPermissions = phase1PermissionCatalog.map(
  (permission) => permission.key,
);

export const roleTemplates = [
  {
    code: 'SYSTEM_ADMIN',
    name: 'System Administrator',
    description:
      'Technical administration role; does not imply financial approval.',
    protected: true,
    permissions: systemAdminPermissions,
  },
  {
    code: 'ACCOUNTANT',
    name: 'Accountant',
    description: 'Proposed accounting role template.',
    permissions: [],
  },
  {
    code: 'SALES_MANAGER',
    name: 'Sales Manager',
    description: 'Proposed sales management role template.',
    permissions: [],
  },
  {
    code: 'WAREHOUSE_KEEPER',
    name: 'Warehouse Keeper',
    description: 'Proposed warehouse operations role template.',
    permissions: [],
  },
  {
    code: 'PURCHASING_OFFICER',
    name: 'Purchasing Officer',
    description: 'Proposed purchasing role template.',
    permissions: [],
  },
  {
    code: 'CASHIER',
    name: 'Cashier',
    description: 'Proposed cashier role template.',
    permissions: [],
  },
  {
    code: 'SALES_REPRESENTATIVE',
    name: 'Sales Representative',
    description: 'Proposed sales representative role template.',
    permissions: [],
  },
  {
    code: 'AUDITOR',
    name: 'Read-Only Auditor',
    description: 'Proposed read-only audit role template.',
    permissions: [],
  },
] as const satisfies readonly {
  code: string;
  name: string;
  description: string;
  protected?: true;
  permissions: readonly Phase1PermissionKey[];
}[];

export type RoleTemplateCode = (typeof roleTemplates)[number]['code'];
