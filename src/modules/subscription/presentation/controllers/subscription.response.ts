import type { Subscription } from '../../domain/entities/subscription.entity';

export interface SubscriptionResponse {
  id: string;
  personId: string;
  planId: string;
  billingCycle: Subscription['billingCycle'];
  price: number;
  startDate: Date;
  endDate: Date | null;
  nextBillingDate: Date | null;
  status: Subscription['status'];
}

export function toSubscriptionResponse(subscription: Subscription): SubscriptionResponse {
  return {
    id: subscription.id,
    personId: subscription.personId,
    planId: subscription.planId,
    billingCycle: subscription.billingCycle,
    price: subscription.price,
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    nextBillingDate: subscription.nextBillingDate,
    status: subscription.status,
  };
}
