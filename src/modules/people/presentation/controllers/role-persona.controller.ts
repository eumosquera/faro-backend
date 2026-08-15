import { Body, Controller, Post } from '@nestjs/common';

import { CreateRolePersonaUseCase } from '../../application/use-cases/create-role-persona/create-role-persona.use-case';
import { CreateRolePersonaRequest } from './create-role-persona.request';
import { RolePersonaResponse, toRolePersonaResponse } from './role-persona.response';

@Controller('role-personas')
export class RolePersonaController {
  constructor(private readonly createRolePersonaUseCase: CreateRolePersonaUseCase) {}

  @Post()
  async create(@Body() request: CreateRolePersonaRequest): Promise<RolePersonaResponse> {
    const rolePersona = await this.createRolePersonaUseCase.execute({
      code: request.code,
      name: request.name,
      description: request.description,
    });

    return toRolePersonaResponse(rolePersona);
  }
}
