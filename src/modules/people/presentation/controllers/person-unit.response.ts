import type { PersonUnit } from '../../domain/entities/person-unit.entity';

export interface PersonUnitResponse {
  id: string;
  personId: string;
  privateUnitId: string;
  rolePersonaId: string;
  startDate: Date;
  endDate: Date | null;
  status: PersonUnit['status'];
  observations: string | null;
}

export function toPersonUnitResponse(personUnit: PersonUnit): PersonUnitResponse {
  return {
    id: personUnit.id,
    personId: personUnit.personId,
    privateUnitId: personUnit.privateUnitId,
    rolePersonaId: personUnit.rolePersonaId,
    startDate: personUnit.startDate,
    endDate: personUnit.endDate,
    status: personUnit.status,
    observations: personUnit.observations,
  };
}
