import { Module } from '@nestjs/common';

import { CreateResidentialComplexUseCase } from './application/use-cases/create-residential-complex/create-residential-complex.use-case';
import { ResidentialComplexRepository } from './domain/repositories/residential-complex.repository';
import { PrismaResidentialComplexRepository } from './infrastructure/persistence/repositories/prisma-residential-complex.repository';
import { ResidentialComplexController } from './presentation/controllers/residential-complex.controller';

@Module({
  controllers: [ResidentialComplexController],
  providers: [
    PrismaResidentialComplexRepository,
    {
      provide: ResidentialComplexRepository,
      useExisting: PrismaResidentialComplexRepository,
    },
    CreateResidentialComplexUseCase,
  ],
  exports: [CreateResidentialComplexUseCase],
})
export class StructureModule {}
