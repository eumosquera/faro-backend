import { Injectable } from '@nestjs/common';

import { AccessAccountRepository } from '../../../domain/repositories/access-account.repository';

import { AccessAccountNotFoundError } from '../../errors/access-account-not-found.error';

import type { ActivateAccessAccountDto } from './activate-access-account.dto';

@Injectable()
export class ActivateAccessAccountUseCase {
  constructor(private readonly accessAccountRepository: AccessAccountRepository) {}

  async execute(dto: ActivateAccessAccountDto): Promise<void> {
    const accessAccount = await this.accessAccountRepository.findById(dto.accessAccountId);

    if (!accessAccount) {
      throw new AccessAccountNotFoundError(dto.accessAccountId);
    }

    if (accessAccount.status === 'ACTIVE') {
      return;
    }

    const updatedAccessAccount = accessAccount.updateStatus('ACTIVE');

    await this.accessAccountRepository.save(updatedAccessAccount);
  }
}
