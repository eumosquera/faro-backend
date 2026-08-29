import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './core/config/env.validation';
import { HealthController } from './core/health/health.controller';
import { PrismaModule } from './core/database/prisma.module';
import { createLoggerModule } from './core/logging/logger.config';
import { StructureModule } from './modules/structure/structure.module';
import { SharedModule } from './shared/shared.module';
import { SupabaseModule } from './core/auth/supabase.module';
import { PeopleModule } from './modules/people/people.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AccessModule } from './modules/access/access.module';
import { MembershipModule } from './modules/membership/membership.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    createLoggerModule(),
    PrismaModule,
    StructureModule,
    SharedModule,
    SupabaseModule,
    PeopleModule,
    SubscriptionModule,
    AccessModule,
    MembershipModule,
    OnboardingModule,
    ProfileModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
