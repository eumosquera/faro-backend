import { Injectable } from '@nestjs/common';

import { AccessAccount } from '../../../domain/entities/access-account.entity';
import { AccessAccountRepository } from '../../../domain/repositories/access-account.repository';
import { PersonRepository } from '../../../../people/domain/repositories/person.repository';

import { AccessAccountAlreadyExistsForPersonError } from '../../errors/access-account-already-exists-for-person.error';
import { ExternalAuthIdentityAlreadyLinkedError } from '../../errors/external-auth-identity-already-linked.error';
import { PersonNotFoundError } from '../../errors/person-not-found.error';

import { IdGenerator } from '../../../../../shared/identity/id-generator';
import type { CreateAccessAccountDto } from './create-access-account.dto';

@Injectable()
export class CreateAccessAccountUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly accessAccountRepository: AccessAccountRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(dto: CreateAccessAccountDto): Promise<AccessAccount> {
    const person = await this.personRepository.findById(dto.personId);

    if (!person) {
      throw new PersonNotFoundError(dto.personId);
    }

    const existingAccountForPerson = await this.accessAccountRepository.findByPersonId(
      dto.personId,
    );

    if (existingAccountForPerson) {
      throw new AccessAccountAlreadyExistsForPersonError(dto.personId);
    }

    const existingAccountForExternalAuth = await this.accessAccountRepository.findByExternalAuthId(
      dto.externalAuthId,
    );

    if (existingAccountForExternalAuth) {
      throw new ExternalAuthIdentityAlreadyLinkedError(dto.externalAuthId);
    }

    const now = new Date();

    const accessAccount = AccessAccount.create({
      id: this.idGenerator.generate(),
      personId: dto.personId,
      externalAuthId: dto.externalAuthId,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    });

    await this.accessAccountRepository.save(accessAccount);

    return accessAccount;
  }
}
