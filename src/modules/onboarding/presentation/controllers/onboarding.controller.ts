import { Body, Controller, Post } from '@nestjs/common';

import { RegisterTenantUseCase } from '../../application/use-cases/register-tenant/register-tenant.use-case';
import type { RegisterTenantResult } from '../../application/use-cases/register-tenant/register-tenant.result';
import { RegisterTenantRequest } from './register-tenant.request';

// Público a propósito: es el registro self-service desde la landing.
// Cuando se agregue el guard de autorización global (@Public()), esta
// ruta debe marcarse explícitamente como pública.
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly registerTenantUseCase: RegisterTenantUseCase) {}

  @Post('register-tenant')
  async registerTenant(@Body() request: RegisterTenantRequest): Promise<RegisterTenantResult> {
    return this.registerTenantUseCase.execute({
      externalAuthId: request.externalAuthId,
      person: request.person,
      residentialComplex: request.residentialComplex,
      planCode: request.planCode,
      billingCycle: request.billingCycle,
    });
  }
}
