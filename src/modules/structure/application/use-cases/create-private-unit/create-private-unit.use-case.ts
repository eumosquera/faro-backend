import { Injectable } from '@nestjs/common';

import { IdGenerator } from '../../../../../shared/identity/id-generator';
import { PrivateUnit } from '../../../domain/entities/private-unit.entity';
import { PhysicalGroupRepository } from '../../../domain/repositories/physical-group.repository';
import { PrivateUnitRepository } from '../../../domain/repositories/private-unit.repository';
import { ResidentialComplexRepository } from '../../../domain/repositories/residential-complex.repository';
import type { CreatePrivateUnitInput } from './create-private-unit.dto';
import { ResidentialComplexNotFoundError } from '../../errors/residential-complex-not-found.error';
import { PhysicalGroupResidentialComplexMismatchError } from '../../errors/physical-group-residential-complex-mismatch.error';
import { PhysicalGroupNotFoundError } from '../../errors/physical-group-not-found.error';

@Injectable()
export class CreatePrivateUnitUseCase {
  constructor(
    private readonly privateUnitRepository: PrivateUnitRepository,
    private readonly residentialComplexRepository: ResidentialComplexRepository,
    private readonly physicalGroupRepository: PhysicalGroupRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CreatePrivateUnitInput): Promise<PrivateUnit> {
    const residentialComplex = await this.residentialComplexRepository.findById(
      input.residentialComplexId,
    );

    if (!residentialComplex) {
      throw new ResidentialComplexNotFoundError(input.residentialComplexId);
    }

    let physicalGroupId: string | null = null;

    if (input.physicalGroupId) {
      const physicalGroup = await this.physicalGroupRepository.findById(input.physicalGroupId);

      if (!physicalGroup) {
        throw new PhysicalGroupNotFoundError(input.physicalGroupId);
      }

      if (physicalGroup.residentialComplexId !== input.residentialComplexId) {
        throw new PhysicalGroupResidentialComplexMismatchError();
      }

      physicalGroupId = physicalGroup.id;
    }

    const privateUnit = PrivateUnit.create({
      id: this.idGenerator.generate(),
      residentialComplexId: input.residentialComplexId,
      physicalGroupId,
      identifier: input.identifier,
      type: input.type,
      status: 'ACTIVE',
    });

    await this.privateUnitRepository.save(privateUnit);

    return privateUnit;
  }
}
