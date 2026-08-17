import { AccessAccount } from '../../../domain/entities/access-account.entity';
import type { AccessAccountRepository } from '../../../domain/repositories/access-account.repository';
import type { PersonRepository } from '../../../../people/domain/repositories/person.repository';

import { AccessAccountAlreadyExistsForPersonError } from '../../errors/access-account-already-exists-for-person.error';
import { ExternalAuthIdentityAlreadyLinkedError } from '../../errors/external-auth-identity-already-linked.error';
import { PersonNotFoundError } from '../../errors/person-not-found.error';

import { CreateAccessAccountUseCase } from './create-access-account.use-case';

describe('CreateAccessAccountUseCase', () => {
  const personRepository = {
    findById: jest.fn(),
  };

  const accessAccountRepository = {
    findByPersonId: jest.fn(),
    findByExternalAuthId: jest.fn(),
    save: jest.fn(),
  };

  const idGenerator = {
    generate: jest.fn(),
  };

  let useCase: CreateAccessAccountUseCase;

  const person = {
    id: 'person-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    idGenerator.generate.mockReturnValue('access-account-1');

    useCase = new CreateAccessAccountUseCase(
      personRepository as unknown as PersonRepository,
      accessAccountRepository as unknown as AccessAccountRepository,
      idGenerator,
    );
  });

  it('should create an active access account for an existing person', async () => {
    personRepository.findById.mockResolvedValue(person);
    accessAccountRepository.findByPersonId.mockResolvedValue(null);
    accessAccountRepository.findByExternalAuthId.mockResolvedValue(null);

    const result = await useCase.execute({
      personId: 'person-1',
      externalAuthId: 'supabase-user-1',
    });

    expect(result).toBeInstanceOf(AccessAccount);
    expect(result.id).toBe('access-account-1');
    expect(result.personId).toBe('person-1');
    expect(result.externalAuthId).toBe('supabase-user-1');
    expect(result.status).toBe('ACTIVE');

    expect(accessAccountRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should reject when the person does not exist', async () => {
    personRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        personId: 'person-1',
        externalAuthId: 'supabase-user-1',
      }),
    ).rejects.toBeInstanceOf(PersonNotFoundError);

    expect(accessAccountRepository.findByPersonId).not.toHaveBeenCalled();
    expect(accessAccountRepository.findByExternalAuthId).not.toHaveBeenCalled();
    expect(accessAccountRepository.save).not.toHaveBeenCalled();
  });

  it('should reject when the person already has an access account', async () => {
    personRepository.findById.mockResolvedValue(person);

    accessAccountRepository.findByPersonId.mockResolvedValue({
      id: 'existing-account',
    });

    await expect(
      useCase.execute({
        personId: 'person-1',
        externalAuthId: 'supabase-user-1',
      }),
    ).rejects.toBeInstanceOf(AccessAccountAlreadyExistsForPersonError);

    expect(accessAccountRepository.findByExternalAuthId).not.toHaveBeenCalled();

    expect(accessAccountRepository.save).not.toHaveBeenCalled();
  });

  it('should reject when the external auth identity is already linked', async () => {
    personRepository.findById.mockResolvedValue(person);
    accessAccountRepository.findByPersonId.mockResolvedValue(null);

    accessAccountRepository.findByExternalAuthId.mockResolvedValue({
      id: 'existing-account',
    });

    await expect(
      useCase.execute({
        personId: 'person-1',
        externalAuthId: 'supabase-user-1',
      }),
    ).rejects.toBeInstanceOf(ExternalAuthIdentityAlreadyLinkedError);

    expect(accessAccountRepository.save).not.toHaveBeenCalled();
  });

  it('should not save when the person already has an access account', async () => {
    personRepository.findById.mockResolvedValue(person);

    accessAccountRepository.findByPersonId.mockResolvedValue({
      id: 'existing-account',
    });

    await expect(
      useCase.execute({
        personId: 'person-1',
        externalAuthId: 'supabase-user-1',
      }),
    ).rejects.toBeInstanceOf(AccessAccountAlreadyExistsForPersonError);

    expect(accessAccountRepository.save).not.toHaveBeenCalled();
  });
});
