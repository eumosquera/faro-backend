import type { AccessRolePermission } from '../../domain/entities/access-role-permission.entity';

export class AccessRolePermissionResponse {
  id: string;
  accessRoleId: string;
  permissionId: string;
  createdAt: Date;

  constructor(accessRolePermission: AccessRolePermission) {
    this.id = accessRolePermission.id;
    this.accessRoleId = accessRolePermission.accessRoleId;
    this.permissionId = accessRolePermission.permissionId;
    this.createdAt = accessRolePermission.createdAt;
  }
}
