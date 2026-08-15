import { Injectable } from '@nestjs/common';

import { PersonUnit } from '../../../domain/entities/person-unit.entity';
import { PersonRepository } from '../../../domain/repositories/person.repository';
import { PrivateUnitRepository } from '../../../../structure/domain/repositories/private-unit.repository';
import { RolePersonaRepository } from '../../../domain/repositories/role-persona.repository';
import { PersonUnitRepository } from '../../../domain/repositories/person-unit.repository';
import { IdGenerator } from '../../../../../shared/identity/id-generator';

import { PersonNotFoundError } from '../../errors/person-not-found.error';
import { PrivateUnitNotFoundError } from '../../errors/private-unit-not-found.error';
import { RolePersonaNotFoundError } from '../../errors/role-persona-not-found.error';
import { RolePersonaInactiveError } from '../../errors/role-persona-inactive.error';
import { InvalidPersonUnitDateRangeError } from '../../errors/invalid-person-unit-date-range.error';

import type { CreatePersonUnitDto } from './create-person-unit.dto';

@Injectable()
export class CreatePersonUnitUseCase {
  constructor(
    private readonly personUnitRepository: PersonUnitRepository,
    private readonly personRepository: PersonRepository,
    private readonly privateUnitRepository: PrivateUnitRepository,
    private readonly rolePersonaRepository: RolePersonaRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreatePersonUnitDto): Promise<PersonUnit> {
    const person = await this.personRepository.findById(dto.personId);

    if (!person) {
      throw new PersonNotFoundError(dto.personId);
    }

    const privateUnit = await this.privateUnitRepository.findById(dto.privateUnitId);

    if (!privateUnit) {
      throw new PrivateUnitNotFoundError(dto.privateUnitId);
    }

    const rolePersona = await this.rolePersonaRepository.findById(dto.rolePersonaId);

    if (!rolePersona) {
      throw new RolePersonaNotFoundError(dto.rolePersonaId);
    }

    if (rolePersona.status !== 'ACTIVE') {
      throw new RolePersonaInactiveError(dto.rolePersonaId);
    }

    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new InvalidPersonUnitDateRangeError();
    }

    const personUnit = PersonUnit.create({
      id: this.idGenerator.generate(),
      personId: person.id,
      privateUnitId: privateUnit.id,
      rolePersonaId: rolePersona.id,
      startDate: dto.startDate,
      endDate: dto.endDate ?? null,
      status: 'ACTIVE',
      observations: dto.observations ?? null,
    });

    await this.personUnitRepository.save(personUnit);

    return personUnit;
  }
}
