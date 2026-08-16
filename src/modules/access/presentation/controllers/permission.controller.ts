import { Body, Controller, Post } from '@nestjs/common';

import { CreatePermissionUseCase } from '../../application/use-cases/create-permission/create-permission.use-case';
import { CreatePermissionRequest } from './create-permission.request';
import { PermissionResponse } from './permission.response';

@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionController {
  constructor(private readonly createPermissionUseCase: CreatePermissionUseCase) {}

  @Post()
  async create(@Body() request: CreatePermissionRequest): Promise<PermissionResponse> {
    const permission = await this.createPermissionUseCase.execute(request);

    return new PermissionResponse(permission);
  }
}
