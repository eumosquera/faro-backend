import type { AccessRole } from '../entities/access-role.entity';

export abstract class AccessRoleRepository {
  abstract findById(id: string): Promise<AccessRole | null>;

  abstract findByCode(code: string): Promise<AccessRole | null>;

  abstract findByName(name: string): Promise<AccessRole | null>;

  abstract save(accessRole: AccessRole): Promise<void>;
}
