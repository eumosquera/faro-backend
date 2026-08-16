import { Body, Controller, Post } from '@nestjs/common';

import { CreateAccessRoleUseCase } from '../../application/use-cases/create-access-role/create-access-role.use-case';
import { CreateAccessRoleRequest } from './create-access-role.request';
import { AccessRoleResponse } from './access-role.response';

@Controller({
  path: 'access-roles',
  version: '1',
})
export class AccessRoleController {
  constructor(private readonly createAccessRoleUseCase: CreateAccessRoleUseCase) {}

  @Post()
  async create(@Body() request: CreateAccessRoleRequest): Promise<AccessRoleResponse> {
    const accessRole = await this.createAccessRoleUseCase.execute(request);

    return new AccessRoleResponse(accessRole);
  }
}
