import { Injectable } from '@nestjs/common';

import { Membership } from '../../../domain/entities/membership.entity';
import { MembershipRepository } from '../../../domain/repositories/membership.repository';
import { MembershipNotFoundError } from '../../errors/membership-not-found.error';
import { MembershipBelongsToAnotherResidentialComplex } from '../../errors/membership-belongs-to-another-residential-complex.error';

import type { DeactivateMembershipDto } from './deactivate-membership.dto';

@Injectable()
export class DeactivateMembershipUseCase {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async execute(dto: DeactivateMembershipDto): Promise<Membership> {
    const membership = await this.membershipRepository.findById(dto.membershipId);

    if (!membership) {
      throw new MembershipNotFoundError();
    }

    if (membership.residentialComplexId !== dto.residentialComplexId) {
      throw new MembershipBelongsToAnotherResidentialComplex();
    }

    const deactivatedMembership = membership.deactivate(dto.endDate ?? new Date());

    return this.membershipRepository.save(deactivatedMembership);
  }
}
