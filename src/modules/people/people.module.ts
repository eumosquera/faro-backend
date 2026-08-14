import { Module } from '@nestjs/common';

import { CreatePersonUseCase } from './application/use-cases/create-person/create-person.use-case';
import { PersonRepository } from './domain/repositories/person.repository';
import { PrismaPersonRepository } from './infrastructure/persistence/repositories/prisma-person.repository';
import { PersonController } from './presentation/controllers/person.controller';

@Module({
  controllers: [PersonController],
  providers: [
    PrismaPersonRepository,
    {
      provide: PersonRepository,
      useExisting: PrismaPersonRepository,
    },
    CreatePersonUseCase,
  ],
  exports: [CreatePersonUseCase, PersonRepository],
})
export class PeopleModule {}
