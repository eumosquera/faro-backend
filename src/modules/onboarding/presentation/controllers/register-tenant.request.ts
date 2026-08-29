import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { PersonDataRequest } from './person-data.request';
import { ResidentialComplexDataRequest } from './residential-complex-data.request';

const BILLING_CYCLES = ['MONTHLY', 'QUARTERLY', 'YEARLY'] as const;

export class RegisterTenantRequest {
  @IsString()
  @IsNotEmpty()
  externalAuthId!: string;

  @ValidateNested()
  @Type(() => PersonDataRequest)
  person!: PersonDataRequest;

  @ValidateNested()
  @Type(() => ResidentialComplexDataRequest)
  residentialComplex!: ResidentialComplexDataRequest;

  @IsString()
  @IsNotEmpty()
  planCode!: string;

  @IsEnum(BILLING_CYCLES)
  billingCycle!: (typeof BILLING_CYCLES)[number];
}
