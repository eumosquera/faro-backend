import { Injectable } from '@nestjs/common';

import { IdGenerator } from '../../../../../shared/identity/id-generator';
import { AccessAccountRepository } from '../../../../access/domain/repositories/access-account.repository';
import { AccessRoleRepository } from '../../../../access/domain/repositories/access-role.repository';
import { PersonRepository } from '../../../../people/domain/repositories/person.repository';
import { ResidentialComplexRepository } from '../../../../structure/domain/repositories/residential-complex.repository';

import { Membership } from '../../../domain/entities/membership.entity';
import { MembershipRepository } from '../../../domain/repositories/membership.repository';

import { CreateMembershipDto } from './create-membership.dto';

import { PersonNotFoundError } from '../../errors/person-not-found.error';
import { ResidentialComplexNotFoundError } from '../../errors/residential-complex-not-found.error';
import { AccessRoleNotFoundError } from '../../errors/access-role-not-found.error';
import { AccessRoleInactiveError } from '../../errors/access-role-inactive.error';
import { AccessAccountNotFoundError } from '../../errors/access-account-not-found.error';
import { AccessAccountBelongsToAnotherPersonError } from '../../errors/access-account-belongs-to-another-person.error';
import { InvalidMembershipDateRangeError } from '../../errors/invalid-membership-date-range.error';
import { PersonAlreadyHasActiveMembershipError } from '../../errors/person-already-has-active-membership.error';

@Injectable()
export class CreateMembershipUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly residentialComplexRepository: ResidentialComplexRepository,
    private readonly accessRoleRepository: AccessRoleRepository,
    private readonly accessAccountRepository: AccessAccountRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreateMembershipDto): Promise<Membership> {
    const person = await this.personRepository.findById(dto.personId);

    if (!person) {
      throw new PersonNotFoundError(dto.personId);
    }

    const residentialComplex = await this.residentialComplexRepository.findById(
      dto.residentialComplexId,
    );

    if (!residentialComplex) {
      throw new ResidentialComplexNotFoundError(dto.residentialComplexId);
    }

    const accessRole = await this.accessRoleRepository.findById(dto.accessRoleId);

    if (!accessRole) {
      throw new AccessRoleNotFoundError(dto.accessRoleId);
    }

    if (!accessRole.isActive()) {
      throw new AccessRoleInactiveError(dto.accessRoleId);
    }

    if (dto.endDate && dto.endDate < dto.startDate) {
      throw new InvalidMembershipDateRangeError();
    }

    if (dto.accessAccountId) {
      const accessAccount = await this.accessAccountRepository.findById(dto.accessAccountId);

      if (!accessAccount) {
        throw new AccessAccountNotFoundError(dto.accessAccountId);
      }

      if (accessAccount.personId !== dto.personId) {
        throw new AccessAccountBelongsToAnotherPersonError(dto.accessAccountId, dto.personId);
      }
    }

    const existingMembership =
      await this.membershipRepository.findActiveByPersonAndResidentialComplex(
        dto.personId,
        dto.residentialComplexId,
      );

    if (existingMembership) {
      throw new PersonAlreadyHasActiveMembershipError(dto.personId, dto.residentialComplexId);
    }

    const now = new Date();

    const membership = Membership.create({
      id: this.idGenerator.generate(),
      personId: dto.personId,
      accessAccountId: dto.accessAccountId ?? null,
      residentialComplexId: dto.residentialComplexId,
      accessRoleId: dto.accessRoleId,
      status: 'ACTIVE',
      startDate: dto.startDate,
      endDate: dto.endDate ?? null,
      createdAt: now,
      updatedAt: now,
    });

    return this.membershipRepository.save(membership);
  }
}
