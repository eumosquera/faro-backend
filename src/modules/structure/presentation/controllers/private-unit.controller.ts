import { Body, Controller, Post } from '@nestjs/common';

import type { CreatePrivateUnitInput } from '../../application/use-cases/create-private-unit/create-private-unit.dto';
import { CreatePrivateUnitUseCase } from '../../application/use-cases/create-private-unit/create-private-unit.use-case';
import { CreatePrivateUnitRequest } from './create-private-unit.request';
import { PrivateUnitResponse } from './private-unit.response';

@Controller('private-units')
export class PrivateUnitController {
  constructor(private readonly createPrivateUnitUseCase: CreatePrivateUnitUseCase) {}

  @Post()
  async create(@Body() request: CreatePrivateUnitRequest): Promise<PrivateUnitResponse> {
    const input: CreatePrivateUnitInput = {
      residentialComplexId: request.residentialComplexId,
      physicalGroupId: request.physicalGroupId,
      identifier: request.identifier,
      type: request.type,
    };

    const privateUnit = await this.createPrivateUnitUseCase.execute(input);

    return PrivateUnitResponse.fromDomain(privateUnit);
  }
}
