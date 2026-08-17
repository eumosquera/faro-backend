import type { AccessAccountRepository } from '../../../domain/repositories/access-account.repository';

import { AccessAccountNotFoundError } from '../../errors/access-account-not-found.error';

import { ActivateAccessAccountUseCase } from './activate-access-account.use-case';

describe('ActivateAccessAccountUseCase', () => {
  const accessAccountRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  let useCase: ActivateAccessAccountUseCase;

  const inactiveAccessAccount = {
    id: 'access-account-1',
    personId: 'person-1',
    externalAuthId: 'supabase-user-1',
    status: 'INACTIVE' as const,
    createdAt: new Date('2026-08-15T00:00:00.000Z'),
    updatedAt: new Date('2026-08-15T00:00:00.000Z'),
  };

  const activeAccessAccount = {
    id: 'access-account-1',
    personId: 'person-1',
    externalAuthId: 'supabase-user-1',
    status: 'ACTIVE' as const,
    createdAt: new Date('2026-08-15T00:00:00.000Z'),
    updatedAt: new Date('2026-08-15T00:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new ActivateAccessAccountUseCase(
      accessAccountRepository as unknown as AccessAccountRepository,
    );
  });

  it('should activate an inactive access account', async () => {
    const accessAccount = {
      ...inactiveAccessAccount,
      updateStatus: jest.fn().mockReturnValue({
        ...inactiveAccessAccount,
        status: 'ACTIVE',
      }),
    };

    accessAccountRepository.findById.mockResolvedValue(accessAccount);

    await expect(
      useCase.execute({
        accessAccountId: 'access-account-1',
      }),
    ).resolves.toBeUndefined();

    expect(accessAccount.updateStatus).toHaveBeenCalledWith('ACTIVE');
    expect(accessAccountRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should reject when the access account does not exist', async () => {
    accessAccountRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        accessAccountId: 'access-account-1',
      }),
    ).rejects.toBeInstanceOf(AccessAccountNotFoundError);

    expect(accessAccountRepository.save).not.toHaveBeenCalled();
  });

  it('should do nothing when the access account is already active', async () => {
    const accessAccount = {
      ...activeAccessAccount,
      updateStatus: jest.fn(),
    };

    accessAccountRepository.findById.mockResolvedValue(accessAccount);

    await expect(
      useCase.execute({
        accessAccountId: 'access-account-1',
      }),
    ).resolves.toBeUndefined();

    expect(accessAccount.updateStatus).not.toHaveBeenCalled();
    expect(accessAccountRepository.save).not.toHaveBeenCalled();
  });
});
