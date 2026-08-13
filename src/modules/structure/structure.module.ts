import { Module } from '@nestjs/common';

import { CreateResidentialComplexUseCase } from './application/use-cases/create-residential-complex/create-residential-complex.use-case';
import { ResidentialComplexRepository } from './domain/repositories/residential-complex.repository';
import { PrismaResidentialComplexRepository } from './infrastructure/persistence/repositories/prisma-residential-complex.repository';
import { ResidentialComplexController } from './presentation/controllers/residential-complex.controller';

import { CreatePhysicalGroupUseCase } from './application/use-cases/create-physical-group/create-physical-group.use-case';
import { PhysicalGroupRepository } from './domain/repositories/physical-group.repository';
import { PrismaPhysicalGroupRepository } from './infrastructure/persistence/repositories/prisma-physical-group.repository';
import { PhysicalGroupController } from './presentation/controllers/physical-group.controller';

@Module({
  controllers: [ResidentialComplexController, PhysicalGroupController],
  providers: [
    PrismaResidentialComplexRepository,
    {
      provide: ResidentialComplexRepository,
      useExisting: PrismaResidentialComplexRepository,
    },
    CreateResidentialComplexUseCase,

    PrismaPhysicalGroupRepository,
    {
      provide: PhysicalGroupRepository,
      useExisting: PrismaPhysicalGroupRepository,
    },
    CreatePhysicalGroupUseCase,
  ],
  exports: [CreateResidentialComplexUseCase, CreatePhysicalGroupUseCase],
})
export class StructureModule {}
