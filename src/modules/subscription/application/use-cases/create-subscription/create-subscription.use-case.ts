import { Injectable } from '@nestjs/common';

import { IdGenerator } from '../../../../../shared/identity/id-generator';
import { PersonRepository } from '../../../../people/domain/repositories/person.repository';
import { Plan } from '../../../domain/entities/plan.entity';
import { Subscription } from '../../../domain/entities/subscription.entity';
import { PlanRepository } from '../../../domain/repositories/plan.repository';
import { SubscriptionRepository } from '../../../domain/repositories/subscription.repository';
import { PersonNotFoundError } from '../../errors/person-not-found.error';
import { PlanInactiveError } from '../../errors/plan-inactive.error';
import { PlanNotFoundError } from '../../errors/plan-not-found.error';
import { ActiveSubscriptionAlreadyExistsError } from '../../errors/active-subscription-already-exists.error';
import type { CreateSubscriptionDto } from './create-subscription.dto';

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly planRepository: PlanRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreateSubscriptionDto): Promise<Subscription> {
    const person = await this.personRepository.findById(dto.personId);

    if (!person) {
      throw new PersonNotFoundError(dto.personId);
    }

    const plan = await this.planRepository.findById(dto.planId);

    if (!plan) {
      throw new PlanNotFoundError(dto.planId);
    }

    if (plan.status !== 'ACTIVE') {
      throw new PlanInactiveError(dto.planId);
    }

    const activeSubscription = await this.subscriptionRepository.findActiveByPersonId(dto.personId);

    if (activeSubscription) {
      throw new ActiveSubscriptionAlreadyExistsError(dto.personId);
    }

    const price = this.getPrice(plan, dto.billingCycle);

    const nextBillingDate = Subscription.calculateNextBillingDate(dto.startDate, dto.billingCycle);

    const subscription = Subscription.create({
      id: this.idGenerator.generate(),
      personId: dto.personId,
      planId: dto.planId,
      billingCycle: dto.billingCycle,
      price,
      startDate: dto.startDate,
      endDate: null,
      nextBillingDate,
      status: 'ACTIVE',
    });

    await this.subscriptionRepository.save(subscription);

    return subscription;
  }

  private getPrice(plan: Plan, billingCycle: CreateSubscriptionDto['billingCycle']): number {
    switch (billingCycle) {
      case 'MONTHLY':
        return plan.monthlyPrice;

      case 'QUARTERLY':
        return plan.quarterlyPrice;

      case 'YEARLY':
        return plan.yearlyPrice;
    }
  }
}
