import { Body, Controller, Post } from '@nestjs/common';

import { CreateSubscriptionUseCase } from '../../application/use-cases/create-subscription/create-subscription.use-case';
import { CreateSubscriptionRequest } from './create-subscription.request';
import { toSubscriptionResponse, SubscriptionResponse } from './subscription.response';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly createSubscriptionUseCase: CreateSubscriptionUseCase) {}

  @Post()
  async create(@Body() request: CreateSubscriptionRequest): Promise<SubscriptionResponse> {
    const subscription = await this.createSubscriptionUseCase.execute({
      personId: request.personId,
      planId: request.planId,
      billingCycle: request.billingCycle,
      startDate: new Date(request.startDate),
    });

    return toSubscriptionResponse(subscription);
  }
}
