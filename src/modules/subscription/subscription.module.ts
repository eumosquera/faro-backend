import { Module } from '@nestjs/common';

import { PeopleModule } from '../people/people.module';

import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription/create-subscription.use-case';
import { SubscriptionRepository } from './domain/repositories/subscription.repository';
import { PrismaSubscriptionRepository } from './infrastructure/persistence/repositories/prisma-subscription.repository';
import { SubscriptionController } from './presentation/controllers/subscription.controller';

import { PlanRepository } from './domain/repositories/plan.repository';
import { PrismaPlanRepository } from './infrastructure/persistence/repositories/prisma-plan.repository';
import { PlanController } from './presentation/controllers/plan.controller';
import { CreatePlanUseCase } from './application/use-cases/create-plan/create-plan.use-case';
import { ListPlansUseCase } from './application/use-cases/list-plans/list-plans.use-case';

@Module({
  imports: [PeopleModule],
  controllers: [SubscriptionController, PlanController],
  providers: [
    PrismaPlanRepository,
    {
      provide: PlanRepository,
      useExisting: PrismaPlanRepository,
    },
    CreatePlanUseCase,
    ListPlansUseCase,

    PrismaSubscriptionRepository,
    {
      provide: SubscriptionRepository,
      useExisting: PrismaSubscriptionRepository,
    },

    CreateSubscriptionUseCase,
  ],
  exports: [CreateSubscriptionUseCase, PlanRepository],
})
export class SubscriptionModule {}
