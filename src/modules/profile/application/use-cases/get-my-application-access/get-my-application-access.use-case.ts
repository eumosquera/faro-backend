import { Injectable } from '@nestjs/common';

import { AccessAccountRepository } from '../../../../access/domain/repositories/access-account.repository';
import { MembershipRepository } from '../../../../membership/domain/repositories/membership.repository';

import type { GetMyApplicationAccessResult } from './get-my-application-access.result';

@Injectable()
export class GetMyApplicationAccessUseCase {
  constructor(
    private readonly accessAccountRepository: AccessAccountRepository,
    private readonly membershipRepository: MembershipRepository,
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

    return {
      hasApplicationAccess: memberships.length > 0,
      memberships: memberships.map((membership) => ({
        membershipId: membership.id,
        residentialComplexId: membership.residentialComplexId,
        accessRoleId: membership.accessRoleId,
      })),
    };
  }
}
