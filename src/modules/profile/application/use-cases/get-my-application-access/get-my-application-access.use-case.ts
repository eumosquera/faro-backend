import { Injectable } from '@nestjs/common';

import { AccessAccountRepository } from '../../../../access/domain/repositories/access-account.repository';
import { AccessRoleRepository } from '../../../../access/domain/repositories/access-role.repository';
import { MembershipRepository } from '../../../../membership/domain/repositories/membership.repository';

import { ResidentialComplexRepository } from '../../../../structure/domain/repositories/residential-complex.repository';
import type {
  GetMyApplicationAccessResult,
  ApplicationAccessMembership,
} from './get-my-application-access.result';

@Injectable()
export class GetMyApplicationAccessUseCase {
  constructor(
    private readonly accessAccountRepository: AccessAccountRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly residentialComplexRepository: ResidentialComplexRepository,
    private readonly accessRoleRepository: AccessRoleRepository,
  ) {}

  async execute(externalAuthId: string): Promise<GetMyApplicationAccessResult> {
    const accessAccount = await this.accessAccountRepository.findByExternalAuthId(externalAuthId);

    if (!accessAccount || accessAccount.status !== 'ACTIVE') {
      return {
        hasApplicationAccess: false,
        memberships: [],
      };
    }

    const memberships = await this.membershipRepository.findActiveByPersonId(
      accessAccount.personId,
    );

    if (memberships.length === 0) {
      return {
        hasApplicationAccess: false,
        memberships: [],
      };
    }

    const applicationMemberships = (
      await Promise.all(
        memberships.map(async (membership): Promise<ApplicationAccessMembership | null> => {
          const [residentialComplex, accessRole] = await Promise.all([
            this.residentialComplexRepository.findById(membership.residentialComplexId),
            this.accessRoleRepository.findById(membership.accessRoleId),
          ]);

          if (!residentialComplex || !accessRole) {
            return null;
          }

          if (residentialComplex.status !== 'ACTIVE' || !accessRole.isActive()) {
            return null;
          }

          return {
            membershipId: membership.id,

            residentialComplex: {
              id: residentialComplex.id,
              name: residentialComplex.name,
            },

            accessRole: {
              id: accessRole.id,
              code: accessRole.code,
              name: accessRole.name,
            },
          };
        }),
      )
    ).filter((membership): membership is ApplicationAccessMembership => membership !== null);

    return {
      hasApplicationAccess: applicationMemberships.length > 0,
      memberships: applicationMemberships,
    };
  }
}
