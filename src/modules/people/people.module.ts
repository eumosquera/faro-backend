import { Module } from '@nestjs/common';

import { CreatePersonUseCase } from './application/use-cases/create-person/create-person.use-case';
import { PersonRepository } from './domain/repositories/person.repository';
import { PrismaPersonRepository } from './infrastructure/persistence/repositories/prisma-person.repository';
import { PersonController } from './presentation/controllers/person.controller';

import { CreateRolePersonaUseCase } from './application/use-cases/create-role-persona/create-role-persona.use-case';
import { RolePersonaRepository } from './domain/repositories/role-persona.repository';
import { PrismaRolePersonaRepository } from './infrastructure/persistence/repositories/prisma-role-persona.repository';
import { RolePersonaController } from './presentation/controllers/role-persona.controller';

@Module({
  controllers: [PersonController, RolePersonaController],
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
  ],
  exports: [CreatePersonUseCase, PersonRepository, CreateRolePersonaUseCase, RolePersonaRepository],
})
export class PeopleModule {}
