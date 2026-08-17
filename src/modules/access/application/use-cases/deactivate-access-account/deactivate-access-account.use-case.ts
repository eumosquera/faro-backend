import { Injectable } from '@nestjs/common';

import { AccessAccountRepository } from '../../../domain/repositories/access-account.repository';

import { AccessAccountNotFoundError } from '../../errors/access-account-not-found.error';

import type { DeactivateAccessAccountDto } from './deactivate-access-account.dto';

@Injectable()
export class DeactivateAccessAccountUseCase {
  constructor(private readonly accessAccountRepository: AccessAccountRepository) {}

  async execute(dto: DeactivateAccessAccountDto): Promise<void> {
    const accessAccount = await this.accessAccountRepository.findById(dto.accessAccountId);

    if (!accessAccount) {
      throw new AccessAccountNotFoundError(dto.accessAccountId);
    }

    if (accessAccount.status === 'INACTIVE') {
      return;
    }

    const updatedAccessAccount = accessAccount.updateStatus('INACTIVE');

    await this.accessAccountRepository.save(updatedAccessAccount);
  }
}
