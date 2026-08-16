import { Injectable } from '@nestjs/common';

import { AccessRolePermissionRepository } from '../../../domain/repositories/access-role-permission.repository';

import { AccessRolePermissionNotFoundError } from '../../errors/access-role-permission-not-found.error';

import type { RemovePermissionFromAccessRoleDto } from './remove-permission-from-access-role.dto';

@Injectable()
export class RemovePermissionFromAccessRoleUseCase {
  constructor(private readonly accessRolePermissionRepository: AccessRolePermissionRepository) {}

  async execute(dto: RemovePermissionFromAccessRoleDto): Promise<void> {
    const existing = await this.accessRolePermissionRepository.findByRoleAndPermission(
      dto.accessRoleId,
      dto.permissionId,
    );

    if (!existing) {
      throw new AccessRolePermissionNotFoundError(dto.accessRoleId, dto.permissionId);
    }

    await this.accessRolePermissionRepository.delete(existing.id);
  }
}
