import type { AccessRolePermission } from '../entities/access-role-permission.entity';

export abstract class AccessRolePermissionRepository {
  abstract findById(id: string): Promise<AccessRolePermission | null>;

  abstract findByRoleAndPermission(
    accessRoleId: string,
    permissionId: string,
  ): Promise<AccessRolePermission | null>;

  abstract save(accessRolePermission: AccessRolePermission): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
