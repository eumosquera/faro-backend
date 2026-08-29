import { Injectable } from '@nestjs/common';

import { AccessAccountRepository } from '../../../../access/domain/repositories/access-account.repository';
import { AccessAccountNotFoundError } from '../../../../access/application/errors/access-account-not-found.error';
import { AccessRoleRepository } from '../../../../access/domain/repositories/access-role.repository';
import { PersonRepository } from '../../../../people/domain/repositories/person.repository';
import { PersonNotFoundError } from '../../../../access/application/errors/person-not-found.error';
import { MembershipRepository } from '../../../../membership/domain/repositories/membership.repository';
import { ResidentialComplexRepository } from '../../../../structure/domain/repositories/residential-complex.repository';

import type { GetMyProfileResult } from './get-my-profile.result';

@Injectable()
export class GetMyProfileUseCase {
  constructor(
    private readonly accessAccountRepository: AccessAccountRepository,
    private readonly personRepository: PersonRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly residentialComplexRepository: ResidentialComplexRepository,
    private readonly accessRoleRepository: AccessRoleRepository,
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

    const memberships = await this.membershipRepository.findActiveByPersonId(person.id);
    const primary = memberships[0] ?? null;

    let primaryMembership: GetMyProfileResult['primaryMembership'] = null;

    if (primary) {
      const [residentialComplex, role] = await Promise.all([
        this.residentialComplexRepository.findById(primary.residentialComplexId),
        this.accessRoleRepository.findById(primary.accessRoleId),
      ]);

      // Si por alguna razón la copropiedad o el rol referenciados ya no
      // existen, se omite el membership en vez de reventar el perfil entero.
      if (residentialComplex && role) {
        primaryMembership = {
          residentialComplex: { id: residentialComplex.id, name: residentialComplex.name },
          role: { code: role.code, name: role.name },
        };
      }
    }

    return {
      person: { id: person.id, fullName: person.fullName, email: person.email },
      primaryMembership,
    };
  }
}
