import type { Subscription } from '../entities/subscription.entity';

export abstract class SubscriptionRepository {
  abstract findById(id: string): Promise<Subscription | null>;

  abstract findActiveByPersonId(personId: string): Promise<Subscription | null>;

  abstract save(subscription: Subscription): Promise<void>;
}
