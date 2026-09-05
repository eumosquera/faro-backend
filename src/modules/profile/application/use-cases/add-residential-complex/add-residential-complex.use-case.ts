import { Injectable } from '@nestjs/common';

import { AccessAccountRepository } from '../../../../access/domain/repositories/access-account.repository';
import { AccessAccountNotFoundError } from '../../../../access/application/errors/access-account-not-found.error';
import { AccessRoleRepository } from '../../../../access/domain/repositories/access-role.repository';
import { PersonRepository } from '../../../../people/domain/repositories/person.repository';
import { PersonNotFoundError } from '../../../../access/application/errors/person-not-found.error';
import { MembershipRepository } from '../../../../membership/domain/repositories/membership.repository';
import { CreateMembershipUseCase } from '../../../../membership/application/use-cases/create-membership/create-membership.use-case';
import { CreateResidentialComplexUseCase } from '../../../../structure/application/use-cases/create-residential-complex/create-residential-complex.use-case';
import { SubscriptionRepository } from '../../../../subscription/domain/repositories/subscription.repository';
import { PlanRepository } from '../../../../subscription/domain/repositories/plan.repository';

import { NoActiveSubscriptionError } from '../../errors/no-active-subscription.error';
import { PlanComplexLimitReachedError } from '../../errors/plan-complex-limit-reached.error';
import { AdministradorRoleNotConfiguredError } from '../../errors/administrador-role-not-configured.error';

import type { AddResidentialComplexDto } from './add-residential-complex.dto';

const ADMINISTRADOR_ROLE_CODE = 'ADMINISTRADOR';

@Injectable()
export class AddResidentialComplexUseCase {
  constructor(
    private readonly accessAccountRepository: AccessAccountRepository,
    private readonly personRepository: PersonRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly accessRoleRepository: AccessRoleRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly planRepository: PlanRepository,
    private readonly createResidentialComplexUseCase: CreateResidentialComplexUseCase,
    private readonly createMembershipUseCase: CreateMembershipUseCase,
  ) {}

  async execute(
    dto: AddResidentialComplexDto,
  ): Promise<{ residentialComplexId: string; membershipId: string }> {
    const accessAccount = await this.accessAccountRepository.findByExternalAuthId(
      dto.externalAuthId,
    );

    if (!accessAccount) {
      throw new AccessAccountNotFoundError(dto.externalAuthId);
    }

    const person = await this.personRepository.findById(accessAccount.personId);

    if (!person) {
      throw new PersonNotFoundError(accessAccount.personId);
    }

    const subscription = await this.subscriptionRepository.findActiveByPersonId(person.id);

    if (!subscription) {
      throw new NoActiveSubscriptionError(person.id);
    }

    const plan = await this.planRepository.findById(subscription.planId);

    if (!plan) {
      throw new NoActiveSubscriptionError(person.id);
    }

    const currentMemberships = await this.membershipRepository.findActiveByPersonId(person.id);

    if (currentMemberships.length >= plan.maxComplexes) {
      throw new PlanComplexLimitReachedError(plan.name, plan.maxComplexes);
    }

    const administradorRole = await this.accessRoleRepository.findByCode(ADMINISTRADOR_ROLE_CODE);

    if (!administradorRole) {
      throw new AdministradorRoleNotConfiguredError();
    }

    const residentialComplex = await this.createResidentialComplexUseCase.execute({
      name: dto.name,
      address: dto.address,
      city: dto.city,
    });

    const membership = await this.createMembershipUseCase.execute({
      personId: person.id,
      accessAccountId: accessAccount.id,
      residentialComplexId: residentialComplex.id,
      accessRoleId: administradorRole.id,
      startDate: new Date(),
    });

    return { residentialComplexId: residentialComplex.id, membershipId: membership.id };
  }
}
