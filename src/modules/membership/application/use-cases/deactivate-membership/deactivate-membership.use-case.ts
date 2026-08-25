import { Injectable } from '@nestjs/common';

import { Membership } from '../../../domain/entities/membership.entity';
import { MembershipRepository } from '../../../domain/repositories/membership.repository';
import { MembershipNotFoundError } from '../../errors/membership-not-found.error';
import type { DeactivateMembershipInput } from './deactivate-membership.dto';

@Injectable()
export class DeactivateMembershipUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async execute(input: DeactivateMembershipInput): Promise<Membership> {
    const membership = await this.membershipRepository.findById(input.membershipId);

    if (!membership) {
      throw new MembershipNotFoundError();
    }

    const deactivatedMembership = membership.deactivate(input.endDate ?? new Date());

    return this.membershipRepository.save(deactivatedMembership);
  }
}
