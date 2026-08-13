import { Body, Controller, Post } from '@nestjs/common';

import type { CreatePhysicalGroupInput } from '../../application/use-cases/create-physical-group/create-physical-group.dto';
import { CreatePhysicalGroupUseCase } from '../../application/use-cases/create-physical-group/create-physical-group.use-case';
import { CreatePhysicalGroupRequest } from './create-physical-group.request';
import { PhysicalGroupResponse } from './physical-group.response';

@Controller('physical-groups')
export class PhysicalGroupController {
  constructor(private readonly createPhysicalGroupUseCase: CreatePhysicalGroupUseCase) {}

  @Post()
  async create(@Body() request: CreatePhysicalGroupRequest): Promise<PhysicalGroupResponse> {
    const input: CreatePhysicalGroupInput = {
      residentialComplexId: request.residentialComplexId,
      name: request.name,
      type: request.type,
    };

    const physicalGroup = await this.createPhysicalGroupUseCase.execute(input);

    return PhysicalGroupResponse.fromDomain(physicalGroup);
  }
}
