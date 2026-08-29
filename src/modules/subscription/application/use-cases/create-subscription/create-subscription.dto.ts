import type {
  BillingCycle,
  SubscriptionStatus,
} from '../../../domain/entities/subscription.entity';

export interface CreateSubscriptionDto {
  personId: string;
  planId: string;
  billingCycle: BillingCycle;
  startDate: Date;
  status?: SubscriptionStatus;
}
