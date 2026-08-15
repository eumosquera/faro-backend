import type { RolePersona } from '../../domain/entities/role-persona.entity';

export interface RolePersonaResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  status: RolePersona['status'];
  createdAt: Date;
  updatedAt: Date;
}

export function toRolePersonaResponse(rolePersona: RolePersona): RolePersonaResponse {
  return {
    id: rolePersona.id,
    code: rolePersona.code,
    name: rolePersona.name,
    description: rolePersona.description,
    status: rolePersona.status,
    createdAt: rolePersona.createdAt,
    updatedAt: rolePersona.updatedAt,
  };
}
