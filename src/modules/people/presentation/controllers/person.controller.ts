import { Body, Controller, Post } from '@nestjs/common';

import { CreatePersonUseCase } from '../../application/use-cases/create-person/create-person.use-case';
import { CreatePersonRequest } from './create-person.request';
import { toPersonResponse, PersonResponse } from './person.response';

@Controller('people')
export class PersonController {
  constructor(private readonly createPersonUseCase: CreatePersonUseCase) {}

  @Post()
  async create(@Body() request: CreatePersonRequest): Promise<PersonResponse> {
    const person = await this.createPersonUseCase.execute(request);

    return toPersonResponse(person);
  }
}
