import { Body, Controller, Delete, Param, Post } from '@nestjs/common';

import { AssignPermissionToAccessRoleUseCase } from '../../application/use-cases/assign-permission-to-access-role/assign-permission-to-access-role.use-case';
import { RemovePermissionFromAccessRoleUseCase } from '../../application/use-cases/remove-permission-from-access-role/remove-permission-from-access-role.use-case';
import { AssignPermissionToAccessRoleRequest } from './assign-permission-to-access-role.request';
import { AccessRolePermissionResponse } from './access-role-permission.response';

@Controller({
  path: 'access-roles/:accessRoleId/permissions',
  version: '1',
})
export class AccessRolePermissionController {
  constructor(
    private readonly assignPermissionToAccessRoleUseCase: AssignPermissionToAccessRoleUseCase,
    private readonly removePermissionFromAccessRoleUseCase: RemovePermissionFromAccessRoleUseCase,
  ) {}

  @Post()
  async assign(
    @Param('accessRoleId') accessRoleId: string,
    @Body() request: AssignPermissionToAccessRoleRequest,
  ): Promise<AccessRolePermissionResponse> {
    const accessRolePermission = await this.assignPermissionToAccessRoleUseCase.execute({
      accessRoleId,
      permissionId: request.permissionId,
    });

    return new AccessRolePermissionResponse(accessRolePermission);
  }

  @Delete(':permissionId')
  async remove(
    @Param('accessRoleId') accessRoleId: string,
    @Param('permissionId') permissionId: string,
  ): Promise<void> {
    await this.removePermissionFromAccessRoleUseCase.execute({
      accessRoleId,
      permissionId,
    });
  }
}
