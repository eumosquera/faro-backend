import type { Permission } from '../entities/permission.entity';

export abstract class PermissionRepository {
  abstract findById(id: string): Promise<Permission | null>;

  abstract findByCode(code: string): Promise<Permission | null>;

  abstract findByName(name: string): Promise<Permission | null>;

  abstract save(permission: Permission): Promise<void>;
}
