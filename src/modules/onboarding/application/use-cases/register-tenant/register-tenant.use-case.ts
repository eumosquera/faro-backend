import { Injectable, Logger } from '@nestjs/common';

import { CreatePersonUseCase } from '../../../../people/application/use-cases/create-person/create-person.use-case';
import { CreateResidentialComplexUseCase } from '../../../../structure/application/use-cases/create-residential-complex/create-residential-complex.use-case';
import { CreateAccessAccountUseCase } from '../../../../access/application/use-cases/create-access-account/create-access-account.use-case';
import { CreateSubscriptionUseCase } from '../../../../subscription/application/use-cases/create-subscription/create-subscription.use-case';
import { CreateMembershipUseCase } from '../../../../membership/application/use-cases/create-membership/create-membership.use-case';
import { AccessRoleRepository } from '../../../../access/domain/repositories/access-role.repository';
import { PlanRepository } from '../../../../subscription/domain/repositories/plan.repository';

import { PlanCodeNotFoundError } from '../../errors/plan-code-not-found.error';
import { AdministradorRoleNotConfiguredError } from '../../errors/administrador-role-not-configured.error';

import type { RegisterTenantDto } from './register-tenant.dto';
import type { RegisterTenantResult } from './register-tenant.result';

const ADMINISTRADOR_ROLE_CODE = 'ADMINISTRADOR';

@Injectable()
export class RegisterTenantUseCase {
  private readonly logger = new Logger(RegisterTenantUseCase.name);

  constructor(
    private readonly createPersonUseCase: CreatePersonUseCase,
    private readonly createResidentialComplexUseCase: CreateResidentialComplexUseCase,
    private readonly createAccessAccountUseCase: CreateAccessAccountUseCase,
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly createMembershipUseCase: CreateMembershipUseCase,
    private readonly accessRoleRepository: AccessRoleRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(dto: RegisterTenantDto): Promise<RegisterTenantResult> {
    // Se validan ANTES de crear nada, para no dejar registros huérfanos si
    // el plan o el rol no existen (los pasos que sí escriben no tienen
    // rollback automático entre sí — ver nota en onboarding.module.ts).
    const plan = await this.planRepository.findByCode(dto.planCode);

    if (!plan || plan.status !== 'ACTIVE') {
      throw new PlanCodeNotFoundError(dto.planCode);
    }

    const administradorRole = await this.accessRoleRepository.findByCode(ADMINISTRADOR_ROLE_CODE);

    if (!administradorRole) {
      throw new AdministradorRoleNotConfiguredError();
    }

    const now = new Date();

    const person = await this.createPersonUseCase.execute({
      identificationType: dto.person.identificationType,
      identificationNumber: dto.person.identificationNumber,
      fullName: dto.person.fullName,
      email: dto.person.email,
      phone: dto.person.phone,
    });

    const residentialComplex = await this.createResidentialComplexUseCase.execute({
      name: dto.residentialComplex.name,
      address: dto.residentialComplex.address,
      city: dto.residentialComplex.city,
    });

    const accessAccount = await this.createAccessAccountUseCase.execute({
      personId: person.id,
      externalAuthId: dto.externalAuthId,
    });

    const subscription = await this.createSubscriptionUseCase.execute({
      personId: person.id,
      planId: plan.id,
      billingCycle: dto.billingCycle,
      startDate: now,
      status: 'PENDING_PAYMENT',
    });

    const membership = await this.createMembershipUseCase.execute({
      personId: person.id,
      accessAccountId: accessAccount.id,
      residentialComplexId: residentialComplex.id,
      accessRoleId: administradorRole.id,
      startDate: now,
    });

    this.logger.log(
      `Tenant registrado: person=${person.id} complex=${residentialComplex.id} plan=${plan.code}`,
    );

    return {
      personId: person.id,
      residentialComplexId: residentialComplex.id,
      accessAccountId: accessAccount.id,
      subscriptionId: subscription.id,
      membershipId: membership.id,
    };
  }
}
