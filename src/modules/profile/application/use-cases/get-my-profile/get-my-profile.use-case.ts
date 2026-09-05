import { Injectable } from '@nestjs/common';

import { AccessAccountRepository } from '../../../../access/domain/repositories/access-account.repository';
import { AccessAccountNotFoundError } from '../../../../access/application/errors/access-account-not-found.error';
import { AccessRoleRepository } from '../../../../access/domain/repositories/access-role.repository';
import { PersonRepository } from '../../../../people/domain/repositories/person.repository';
import { PersonNotFoundError } from '../../../../access/application/errors/person-not-found.error';
import { MembershipRepository } from '../../../../membership/domain/repositories/membership.repository';
import { ResidentialComplexRepository } from '../../../../structure/domain/repositories/residential-complex.repository';
import { SubscriptionRepository } from '../../../../subscription/domain/repositories/subscription.repository';
import { PlanRepository } from '../../../../subscription/domain/repositories/plan.repository';

import type { GetMyProfileResult } from './get-my-profile.result';

@Injectable()
export class GetMyProfileUseCase {
  constructor(
    private readonly accessAccountRepository: AccessAccountRepository,
    private readonly personRepository: PersonRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly residentialComplexRepository: ResidentialComplexRepository,
    private readonly accessRoleRepository: AccessRoleRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly planRepository: PlanRepository,
  ) {}

  async execute(externalAuthId: string): Promise<GetMyProfileResult> {
    const accessAccount = await this.accessAccountRepository.findByExternalAuthId(externalAuthId);

    if (!accessAccount) {
      throw new AccessAccountNotFoundError(externalAuthId);
    }

    const person = await this.personRepository.findById(accessAccount.personId);

    if (!person) {
      throw new PersonNotFoundError(accessAccount.personId);
    }

    const membershipEntities = await this.membershipRepository.findActiveByPersonId(person.id);

    const memberships: GetMyProfileResult['memberships'] = [];

    for (const membership of membershipEntities) {
      const [residentialComplex, role] = await Promise.all([
        this.residentialComplexRepository.findById(membership.residentialComplexId),
        this.accessRoleRepository.findById(membership.accessRoleId),
      ]);

      // Si por alguna razón la copropiedad o el rol referenciados ya no
      // existen, se omite ese membership en vez de reventar el perfil entero.
      if (residentialComplex && role) {
        memberships.push({
          residentialComplex: { id: residentialComplex.id, name: residentialComplex.name },
          role: { code: role.code, name: role.name },
        });
      }
    }

    const primaryMembership = memberships[0] ?? null;

    const subscriptionEntity = await this.subscriptionRepository.findActiveByPersonId(person.id);

    let subscription: GetMyProfileResult['subscription'] = null;

    if (subscriptionEntity) {
      const plan = await this.planRepository.findById(subscriptionEntity.planId);

      // Si el plan referenciado ya no existe, se omite la suscripción del
      // perfil en vez de reventar toda la respuesta.
      if (plan) {
        subscription = {
          id: subscriptionEntity.id,
          billingCycle: subscriptionEntity.billingCycle,
          price: subscriptionEntity.price,
          status: subscriptionEntity.status,
          startDate: subscriptionEntity.startDate,
          nextBillingDate: subscriptionEntity.nextBillingDate,
          plan: {
            code: plan.code,
            name: plan.name,
            maxComplexes: plan.maxComplexes,
            maxUnits: plan.maxUnits,
          },
        };
      }
    }

    return {
      person: { id: person.id, fullName: person.fullName, email: person.email },
      primaryMembership,
      memberships,
      subscription,
    };
  }
}
