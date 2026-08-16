import { Injectable } from '@nestjs/common';

import { Permission } from '../../../domain/entities/permission.entity';
import { PermissionRepository } from '../../../domain/repositories/permission.repository';
import { PermissionCodeAlreadyExistsError } from '../../errors/permission-code-already-exists.error';
import { PermissionNameAlreadyExistsError } from '../../errors/permission-name-already-exists.error';
import { IdGenerator } from '../../../../../shared/identity/id-generator';
import type { CreatePermissionDto } from './create-permission.dto';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreatePermissionDto): Promise<Permission> {
    const existingPermissionByCode = await this.permissionRepository.findByCode(dto.code);

    if (existingPermissionByCode) {
      throw new PermissionCodeAlreadyExistsError(dto.code);
    }

    const existingPermissionByName = await this.permissionRepository.findByName(dto.name);

    if (existingPermissionByName) {
      throw new PermissionNameAlreadyExistsError(dto.name);
    }

    const permission = Permission.create({
      id: this.idGenerator.generate(),
      code: dto.code,
      name: dto.name,
      description: dto.description,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.permissionRepository.save(permission);

    return permission;
  }
}
