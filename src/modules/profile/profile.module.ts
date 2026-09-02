import { Module } from '@nestjs/common';

import { AccessModule } from '../access/access.module';
import { PeopleModule } from '../people/people.module';
import { MembershipModule } from '../membership/membership.module';
import { StructureModule } from '../structure/structure.module';

import { SupabaseModule } from '../../core/auth/supabase.module';
import { GetMyProfileUseCase } from './application/use-cases/get-my-profile/get-my-profile.use-case';
import { ProfileController } from './presentation/controllers/profile.controller';

import { GetMyApplicationAccessUseCase } from './application/use-cases/get-my-application-access/get-my-application-access.use-case';

@Module({
  imports: [AccessModule, PeopleModule, MembershipModule, StructureModule, SupabaseModule],
  controllers: [ProfileController],
  providers: [GetMyProfileUseCase, GetMyApplicationAccessUseCase],
})
export class ProfileModule {}
