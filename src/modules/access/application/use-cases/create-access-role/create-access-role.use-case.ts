import { Injectable } from '@nestjs/common';

import { AccessRole } from '../../../domain/entities/access-role.entity';
import { AccessRoleRepository } from '../../../domain/repositories/access-role.repository';
import { IdGenerator } from '../../../../../shared/identity/id-generator';
import type { CreateAccessRoleDto } from './create-access-role.dto';
import { AccessRoleCodeAlreadyExistsError } from '../../errors/access-role-code-already-exists.error';
import { AccessRoleNameAlreadyExistsError } from '../../errors/access-role-name-already-exists.error';

@Injectable()
export class CreateAccessRoleUseCase {
  constructor(
    private readonly accessRoleRepository: AccessRoleRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreateAccessRoleDto): Promise<AccessRole> {
    const existingRoleByCode = await this.accessRoleRepository.findByCode(dto.code);

    if (existingRoleByCode) {
      throw new AccessRoleCodeAlreadyExistsError(dto.code);
    }

    const existingRoleByName = await this.accessRoleRepository.findByName(dto.name);

    if (existingRoleByName) {
      throw new AccessRoleNameAlreadyExistsError(dto.name);
    }

    const accessRole = AccessRole.create({
      id: this.idGenerator.generate(),
      code: dto.code,
      name: dto.name,
      description: dto.description,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.accessRoleRepository.save(accessRole);

    return accessRole;
  }
}
