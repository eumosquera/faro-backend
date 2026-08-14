import { IsDateString, IsIn, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubscriptionRequest {
  @IsUUID()
  personId!: string;

  @IsUUID()
  planId!: string;

  @IsIn(['MONTHLY', 'QUARTERLY', 'YEARLY'])
  billingCycle!: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;
}
