import type { AccessRole } from '../../domain/entities/access-role.entity';

export class AccessRoleResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(accessRole: AccessRole) {
    this.id = accessRole.id;
    this.code = accessRole.code;
    this.name = accessRole.name;
    this.description = accessRole.description;
    this.status = accessRole.status;
    this.createdAt = accessRole.createdAt;
    this.updatedAt = accessRole.updatedAt;
  }
}
