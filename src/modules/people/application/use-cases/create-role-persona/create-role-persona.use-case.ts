import { Injectable } from '@nestjs/common';

import { RolePersona } from '../../../domain/entities/role-persona.entity';
import { RolePersonaRepository } from '../../../domain/repositories/role-persona.repository';
import { IdGenerator } from '../../../../../shared/identity/id-generator';
import { RolePersonaCodeAlreadyExistsError } from '../../errors/role-persona-code-already-exists.error';
import { RolePersonaNameAlreadyExistsError } from '../../errors/role-persona-name-already-exists.error';
import type { CreateRolePersonaDto } from './create-role-persona.dto';

@Injectable()
export class CreateRolePersonaUseCase {
  constructor(
    private readonly rolePersonaRepository: RolePersonaRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreateRolePersonaDto): Promise<RolePersona> {
    const existingByCode = await this.rolePersonaRepository.findByCode(dto.code);

    if (existingByCode) {
      throw new RolePersonaCodeAlreadyExistsError(dto.code);
    }

    const existingByName = await this.rolePersonaRepository.findByName(dto.name);

    if (existingByName) {
      throw new RolePersonaNameAlreadyExistsError(dto.name);
    }

    const now = new Date();

    const rolePersona = RolePersona.create({
      id: this.idGenerator.generate(),
      code: dto.code,
      name: dto.name,
      description: dto.description,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    });

    await this.rolePersonaRepository.save(rolePersona);

    return rolePersona;
  }
}
