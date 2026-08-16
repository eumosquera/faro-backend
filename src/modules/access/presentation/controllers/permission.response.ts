import type { Permission } from '../../domain/entities/permission.entity';

export class PermissionResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(permission: Permission) {
    this.id = permission.id;
    this.code = permission.code;
    this.name = permission.name;
    this.description = permission.description;
    this.status = permission.status;
    this.createdAt = permission.createdAt;
    this.updatedAt = permission.updatedAt;
  }
}
