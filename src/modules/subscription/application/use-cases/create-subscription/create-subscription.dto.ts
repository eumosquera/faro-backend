import type { BillingCycle } from '../../../domain/entities/subscription.entity';

export interface CreateSubscriptionDto {
  personId: string;
  planId: string;
  billingCycle: BillingCycle;
  startDate: Date;
}
