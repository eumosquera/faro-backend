import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { PeopleModule } from '../people/people.module';
import { StructureModule } from '../structure/structure.module';

import { CreateMembershipUseCase } from './application/use-cases/create-membership/create-membership.use-case';

import { MembershipRepository } from './domain/repositories/membership.repository';

import { PrismaMembershipRepository } from './infrastructure/persistence/repositories/prisma-membership.repository';

import { MembershipController } from './presentation/controllers/membership.controller';
import { DeactivateMembershipUseCase } from './application/use-cases/deactivate-membership/deactivate-membership.use-case';

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
    DeactivateMembershipUseCase,
  ],
  exports: [CreateMembershipUseCase, MembershipRepository, DeactivateMembershipUseCase],
})
export class MembershipModule {}
