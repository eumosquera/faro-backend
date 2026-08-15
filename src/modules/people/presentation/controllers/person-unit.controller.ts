import { Body, Controller, Post } from '@nestjs/common';

import { CreatePersonUnitUseCase } from '../../application/use-cases/create-person-unit/create-person-unit.use-case';
import { CreatePersonUnitRequest } from './create-person-unit.request';
import { PersonUnitResponse, toPersonUnitResponse } from './person-unit.response';

@Controller('person-units')
export class PersonUnitController {
  constructor(private readonly createPersonUnitUseCase: CreatePersonUnitUseCase) {}

  @Post()
  async create(@Body() request: CreatePersonUnitRequest): Promise<PersonUnitResponse> {
    const personUnit = await this.createPersonUnitUseCase.execute({
      personId: request.personId,
      privateUnitId: request.privateUnitId,
      rolePersonaId: request.rolePersonaId,
      startDate: new Date(request.startDate),
      endDate: request.endDate ? new Date(request.endDate) : null,
      observations: request.observations ?? null,
    });

    return toPersonUnitResponse(personUnit);
  }
}
