import { Injectable } from '@nestjs/common';

import { AccessRolePermission } from '../../../domain/entities/access-role-permission.entity';
import { AccessRolePermissionRepository } from '../../../domain/repositories/access-role-permission.repository';
import { AccessRoleRepository } from '../../../domain/repositories/access-role.repository';
import { PermissionRepository } from '../../../domain/repositories/permission.repository';

import { AccessRoleInactiveError } from '../../errors/access-role-inactive.error';
import { AccessRoleNotFoundError } from '../../errors/access-role-not-found.error';
import { AccessRolePermissionAlreadyExistsError } from '../../errors/access-role-permission-already-exists.error';
import { PermissionInactiveError } from '../../errors/permission-inactive.error';
import { PermissionNotFoundError } from '../../errors/permission-not-found.error';

import { IdGenerator } from '../../../../../shared/identity/id-generator';
import type { AssignPermissionToAccessRoleDto } from './assign-permission-to-access-role.dto';

@Injectable()
export class AssignPermissionToAccessRoleUseCase {
  constructor(
    private readonly accessRoleRepository: AccessRoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly accessRolePermissionRepository: AccessRolePermissionRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: AssignPermissionToAccessRoleDto): Promise<AccessRolePermission> {
    const accessRole = await this.accessRoleRepository.findById(dto.accessRoleId);

    if (!accessRole) {
      throw new AccessRoleNotFoundError(dto.accessRoleId);
    }

    if (accessRole.status !== 'ACTIVE') {
      throw new AccessRoleInactiveError(dto.accessRoleId);
    }

    const permission = await this.permissionRepository.findById(dto.permissionId);

    if (!permission) {
      throw new PermissionNotFoundError(dto.permissionId);
    }

    if (permission.status !== 'ACTIVE') {
      throw new PermissionInactiveError(dto.permissionId);
    }

    const existing = await this.accessRolePermissionRepository.findByRoleAndPermission(
      dto.accessRoleId,
      dto.permissionId,
    );

    if (existing) {
      throw new AccessRolePermissionAlreadyExistsError(dto.accessRoleId, dto.permissionId);
    }

    const accessRolePermission = AccessRolePermission.create({
      id: this.idGenerator.generate(),
      accessRoleId: dto.accessRoleId,
      permissionId: dto.permissionId,
      createdAt: new Date(),
    });

    await this.accessRolePermissionRepository.save(accessRolePermission);

    return accessRolePermission;
  }
}
