import type { RolePersona } from '../entities/role-persona.entity';

export abstract class RolePersonaRepository {
  abstract findById(id: string): Promise<RolePersona | null>;

  abstract findByCode(code: string): Promise<RolePersona | null>;

  abstract findByName(name: string): Promise<RolePersona | null>;

  abstract save(rolePersona: RolePersona): Promise<void>;
}
