export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export type SubscriptionStatus =
  'PENDING_PAYMENT' | 'ACTIVE' | 'GRACE_PERIOD' | 'EXPIRED' | 'CANCELLED';

export interface SubscriptionProps {
  id: string;
  personId: string;
  planId: string;
  billingCycle: BillingCycle;
  price: number;
  startDate: Date;
  endDate: Date | null;
  nextBillingDate: Date | null;
  status: SubscriptionStatus;
}

export class Subscription {
  private constructor(private readonly props: SubscriptionProps) {}

  static create(props: SubscriptionProps): Subscription {
    return new Subscription(props);
  }

  static calculateNextBillingDate(startDate: Date, billingCycle: BillingCycle): Date {
    const nextBillingDate = new Date(startDate);

    switch (billingCycle) {
      case 'MONTHLY':
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        break;

      case 'QUARTERLY':
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
        break;

      case 'YEARLY':
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        break;
    }

    return nextBillingDate;
  }

  get id(): string {
    return this.props.id;
  }

  get personId(): string {
    return this.props.personId;
  }

  get planId(): string {
    return this.props.planId;
  }

  get billingCycle(): BillingCycle {
    return this.props.billingCycle;
  }

  get price(): number {
    return this.props.price;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date | null {
    return this.props.endDate;
  }

  get nextBillingDate(): Date | null {
    return this.props.nextBillingDate;
  }

  get status(): SubscriptionStatus {
    return this.props.status;
  }
}
