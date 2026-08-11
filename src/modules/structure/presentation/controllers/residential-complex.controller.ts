import { Body, Controller, Post } from '@nestjs/common';

import { CreateResidentialComplexUseCase } from '../../application/use-cases/create-residential-complex/create-residential-complex.use-case';
import type { CreateResidentialComplexInput } from '../../application/use-cases/create-residential-complex/create-residential-complex.dto';
import { ResidentialComplexResponse } from './residential-complex.response';
import { CreateResidentialComplexRequest } from './create-residential-complex.request';

@Controller('residential-complexes')
export class ResidentialComplexController {
  constructor(private readonly createResidentialComplexUseCase: CreateResidentialComplexUseCase) {}

  @Post()
  async create(
    @Body() request: CreateResidentialComplexRequest,
  ): Promise<ResidentialComplexResponse> {
    const input: CreateResidentialComplexInput = {
      name: request.name,
      address: request.address,
      city: request.city,
    };

    const residentialComplex = await this.createResidentialComplexUseCase.execute(input);

    return ResidentialComplexResponse.fromDomain(residentialComplex);
  }
}
