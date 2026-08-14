import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../core/database/prisma.service';
import { Subscription } from '../../../domain/entities/subscription.entity';
import { SubscriptionRepository } from '../../../domain/repositories/subscription.repository';

@Injectable()
export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Subscription | null> {
    const record = await this.prisma.subscription.findUnique({
      where: {
        id,
      },
    });

    if (!record) {
      return null;
    }

    return Subscription.create({
      id: record.id,
      personId: record.personId,
      planId: record.planId,
      billingCycle: record.billingCycle,
      price: record.price.toNumber(),
      startDate: record.startDate,
      endDate: record.endDate,
      nextBillingDate: record.nextBillingDate,
      status: record.status,
    });
  }

  async findActiveByPersonId(personId: string): Promise<Subscription | null> {
    const record = await this.prisma.subscription.findFirst({
      where: {
        personId,
        status: 'ACTIVE',
      },
    });

    if (!record) {
      return null;
    }

    return Subscription.create({
      id: record.id,
      personId: record.personId,
      planId: record.planId,
      billingCycle: record.billingCycle,
      price: record.price.toNumber(),
      startDate: record.startDate,
      endDate: record.endDate,
      nextBillingDate: record.nextBillingDate,
      status: record.status,
    });
  }

  async save(subscription: Subscription): Promise<void> {
    await this.prisma.subscription.upsert({
      where: {
        id: subscription.id,
      },
      create: {
        id: subscription.id,
        personId: subscription.personId,
        planId: subscription.planId,
        billingCycle: subscription.billingCycle,
        price: subscription.price,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        nextBillingDate: subscription.nextBillingDate,
        status: subscription.status,
      },
      update: {
        personId: subscription.personId,
        planId: subscription.planId,
        billingCycle: subscription.billingCycle,
        price: subscription.price,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        nextBillingDate: subscription.nextBillingDate,
        status: subscription.status,
      },
    });
  }
}
