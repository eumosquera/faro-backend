import { Subscription } from './subscription.entity';

describe('Subscription', () => {
  it('should create a subscription with the provided properties', () => {
    const startDate = new Date('2026-08-13T00:00:00.000Z');
    const endDate = new Date('2027-08-13T00:00:00.000Z');
    const nextBillingDate = new Date('2026-09-13T00:00:00.000Z');

    const subscription = Subscription.create({
      id: 'subscription-1',
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'MONTHLY',
      price: 50000,
      startDate,
      endDate,
      nextBillingDate,
      status: 'ACTIVE',
    });

    expect(subscription.id).toBe('subscription-1');
    expect(subscription.personId).toBe('person-1');
    expect(subscription.planId).toBe('plan-1');
    expect(subscription.billingCycle).toBe('MONTHLY');
    expect(subscription.price).toBe(50000);
    expect(subscription.startDate).toBe(startDate);
    expect(subscription.endDate).toBe(endDate);
    expect(subscription.nextBillingDate).toBe(nextBillingDate);
    expect(subscription.status).toBe('ACTIVE');
  });

  it('should create a yearly subscription', () => {
    const startDate = new Date('2026-08-13T00:00:00.000Z');

    const subscription = Subscription.create({
      id: 'subscription-2',
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'YEARLY',
      price: 500000,
      startDate,
      endDate: null,
      nextBillingDate: null,
      status: 'ACTIVE',
    });

    expect(subscription.billingCycle).toBe('YEARLY');
    expect(subscription.price).toBe(500000);
    expect(subscription.endDate).toBeNull();
    expect(subscription.nextBillingDate).toBeNull();
  });

  it('should create a subscription with grace period status', () => {
    const subscription = Subscription.create({
      id: 'subscription-3',
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'MONTHLY',
      price: 50000,
      startDate: new Date('2026-08-13T00:00:00.000Z'),
      endDate: null,
      nextBillingDate: new Date('2026-09-13T00:00:00.000Z'),
      status: 'GRACE_PERIOD',
    });

    expect(subscription.status).toBe('GRACE_PERIOD');
  });

  it('should create an expired subscription', () => {
    const subscription = Subscription.create({
      id: 'subscription-4',
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'YEARLY',
      price: 500000,
      startDate: new Date('2025-08-13T00:00:00.000Z'),
      endDate: new Date('2026-08-13T00:00:00.000Z'),
      nextBillingDate: null,
      status: 'EXPIRED',
    });

    expect(subscription.status).toBe('EXPIRED');
  });

  it('should create a cancelled subscription', () => {
    const subscription = Subscription.create({
      id: 'subscription-5',
      personId: 'person-1',
      planId: 'plan-1',
      billingCycle: 'MONTHLY',
      price: 50000,
      startDate: new Date('2026-08-13T00:00:00.000Z'),
      endDate: new Date('2026-08-20T00:00:00.000Z'),
      nextBillingDate: null,
      status: 'CANCELLED',
    });

    expect(subscription.status).toBe('CANCELLED');
  });
});
