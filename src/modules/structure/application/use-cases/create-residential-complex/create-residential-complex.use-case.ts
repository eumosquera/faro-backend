import { Injectable } from '@nestjs/common';

import { IdGenerator } from '../../../../../shared/identity/id-generator';
import { ResidentialComplex } from '../../../domain/entities/residential-complex.entity';
import { ResidentialComplexRepository } from '../../../domain/repositories/residential-complex.repository';
import type { CreateResidentialComplexInput } from './create-residential-complex.dto';

@Injectable()
export class CreateResidentialComplexUseCase {
  constructor(
    private readonly residentialComplexRepository: ResidentialComplexRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CreateResidentialComplexInput): Promise<ResidentialComplex> {
    const residentialComplex = ResidentialComplex.create({
      id: this.idGenerator.generate(),
      name: input.name,
      address: input.address,
      city: input.city,
      status: 'ACTIVE',
    });

    await this.residentialComplexRepository.save(residentialComplex);

    return residentialComplex;
  }
}
