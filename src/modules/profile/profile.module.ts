import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { PeopleModule } from '../people/people.module';
import { MembershipModule } from '../membership/membership.module';
import { StructureModule } from '../structure/structure.module';

import { SubscriptionModule } from '../subscription/subscription.module';
import { SupabaseModule } from '../../core/auth/supabase.module';
import { GetMyProfileUseCase } from './application/use-cases/get-my-profile/get-my-profile.use-case';
import { ProfileController } from './presentation/controllers/profile.controller';

import { GetMyApplicationAccessUseCase } from './application/use-cases/get-my-application-access/get-my-application-access.use-case';
import { AddResidentialComplexUseCase } from './application/use-cases/add-residential-complex/add-residential-complex.use-case';

@Module({
  imports: [
    AccessModule,
    PeopleModule,
    MembershipModule,
    StructureModule,
    SupabaseModule,
    SubscriptionModule,
  ],
  controllers: [ProfileController],
  providers: [GetMyProfileUseCase, GetMyApplicationAccessUseCase, AddResidentialComplexUseCase],
})
export class ProfileModule {}
