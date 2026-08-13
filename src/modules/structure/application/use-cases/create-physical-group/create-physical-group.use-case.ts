import { Injectable } from '@nestjs/common';

import { IdGenerator } from '../../../../../shared/identity/id-generator';
import { PhysicalGroup } from '../../../domain/entities/physical-group.entity';
import { PhysicalGroupRepository } from '../../../domain/repositories/physical-group.repository';
import { ResidentialComplexRepository } from '../../../domain/repositories/residential-complex.repository';
import type { CreatePhysicalGroupInput } from './create-physical-group.dto';
import { ResidentialComplexNotFoundError } from '../../errors/residential-complex-not-found.error';

@Injectable()
export class CreatePhysicalGroupUseCase {
  constructor(
    private readonly physicalGroupRepository: PhysicalGroupRepository,
    private readonly residentialComplexRepository: ResidentialComplexRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CreatePhysicalGroupInput): Promise<PhysicalGroup> {
    const residentialComplex = await this.residentialComplexRepository.findById(
      input.residentialComplexId,
    );

    if (!residentialComplex) {
      throw new ResidentialComplexNotFoundError(input.residentialComplexId);
    }

    const physicalGroup = PhysicalGroup.create({
      id: this.idGenerator.generate(),
      residentialComplexId: input.residentialComplexId,
      name: input.name,
      type: input.type,
    });

    await this.physicalGroupRepository.save(physicalGroup);

    return physicalGroup;
  }
}
