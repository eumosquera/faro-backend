import { Module } from '@nestjs/common';

import { CreatePersonUseCase } from './application/use-cases/create-person/create-person.use-case';
import { PersonRepository } from './domain/repositories/person.repository';
import { PrismaPersonRepository } from './infrastructure/persistence/repositories/prisma-person.repository';
import { PersonController } from './presentation/controllers/person.controller';

import { CreateRolePersonaUseCase } from './application/use-cases/create-role-persona/create-role-persona.use-case';
import { RolePersonaRepository } from './domain/repositories/role-persona.repository';
import { PrismaRolePersonaRepository } from './infrastructure/persistence/repositories/prisma-role-persona.repository';
import { RolePersonaController } from './presentation/controllers/role-persona.controller';

import { CreatePersonUnitUseCase } from './application/use-cases/create-person-unit/create-person-unit.use-case';
import { PersonUnitRepository } from './domain/repositories/person-unit.repository';
import { PrismaPersonUnitRepository } from './infrastructure/persistence/repositories/prisma-person-unit.repository';
import { PersonUnitController } from './presentation/controllers/person-unit.controller';

import { StructureModule } from '../structure/structure.module';

@Module({
  imports: [StructureModule],
  controllers: [PersonController, RolePersonaController, PersonUnitController],
  providers: [
    PrismaPersonRepository,
    {
      provide: PersonRepository,
      useExisting: PrismaPersonRepository,
    },
    CreatePersonUseCase,

    PrismaRolePersonaRepository,
    {
      provide: RolePersonaRepository,
      useExisting: PrismaRolePersonaRepository,
    },
    CreateRolePersonaUseCase,

    PrismaPersonUnitRepository,
    {
      provide: PersonUnitRepository,
      useExisting: PrismaPersonUnitRepository,
    },
    CreatePersonUnitUseCase,
  ],
  exports: [
    CreatePersonUseCase,
    PersonRepository,
    CreateRolePersonaUseCase,
    RolePersonaRepository,
    CreatePersonUnitUseCase,
    PersonUnitRepository,
  ],
})
export class PeopleModule {}
