import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { PeopleModule } from '../people/people.module';
import { StructureModule } from '../structure/structure.module';

import { CreateMembershipUseCase } from './application/use-cases/create-membership/create-membership.use-case';

import { MembershipRepository } from './domain/repositories/membership.repository';

import { PrismaMembershipRepository } from './infrastructure/persistence/repositories/prisma-membership.repository';

import { MembershipController } from './presentation/controllers/membership.controller';

@Module({
  imports: [PeopleModule, AccessModule, StructureModule],
  controllers: [MembershipController],
  providers: [
    PrismaMembershipRepository,
    {
      provide: MembershipRepository,
      useExisting: PrismaMembershipRepository,
    },
    CreateMembershipUseCase,
  ],
  exports: [CreateMembershipUseCase, MembershipRepository],
})
export class MembershipModule {}
