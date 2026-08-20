import type { IdGenerator } from '../../../../../shared/identity/id-generator';

import type { AccessAccountRepository } from '../../../../access/domain/repositories/access-account.repository';
import type { AccessRoleRepository } from '../../../../access/domain/repositories/access-role.repository';

import type { PersonRepository } from '../../../../people/domain/repositories/person.repository';

import type { ResidentialComplexRepository } from '../../../../structure/domain/repositories/residential-complex.repository';

import { Membership } from '../../../domain/entities/membership.entity';
import type { MembershipRepository } from '../../../domain/repositories/membership.repository';

import { AccessAccountBelongsToAnotherPersonError } from '../../errors/access-account-belongs-to-another-person.error';
import { AccessAccountNotFoundError } from '../../errors/access-account-not-found.error';
import { AccessRoleInactiveError } from '../../errors/access-role-inactive.error';
import { AccessRoleNotFoundError } from '../../errors/access-role-not-found.error';
import { PersonAlreadyHasActiveMembershipError } from '../../errors/person-already-has-active-membership.error';
import { PersonNotFoundError } from '../../errors/person-not-found.error';
import { ResidentialComplexNotFoundError } from '../../errors/residential-complex-not-found.error';

import { CreateMembershipUseCase } from './create-membership.use-case';

describe('CreateMembershipUseCase', () => {
  let useCase: CreateMembershipUseCase;

  let personRepository: jest.Mocked<PersonRepository>;
  let residentialComplexRepository: jest.Mocked<ResidentialComplexRepository>;
  let accessRoleRepository: jest.Mocked<AccessRoleRepository>;
  let accessAccountRepository: jest.Mocked<AccessAccountRepository>;
  let membershipRepository: jest.Mocked<MembershipRepository>;
  let idGenerator: jest.Mocked<IdGenerator>;

  const person = {
    id: 'person-1',
  } as Awaited<ReturnType<PersonRepository['findById']>>;

  const residentialComplex = {
    id: 'complex-1',
  } as Awaited<ReturnType<ResidentialComplexRepository['findById']>>;

  const accessRole = {
    id: 'role-1',
    isActive: () => true,
  } as Awaited<ReturnType<AccessRoleRepository['findById']>>;

  const accessAccount = {
    id: 'account-1',
    personId: 'person-1',
  } as Awaited<ReturnType<AccessAccountRepository['findById']>>;

  const input = {
    personId: 'person-1',
    accessAccountId: 'account-1',
    residentialComplexId: 'complex-1',
    accessRoleId: 'role-1',
    startDate: new Date('2026-08-17'),
  };

  beforeEach(() => {
    personRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<PersonRepository>;

    residentialComplexRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ResidentialComplexRepository>;

    accessRoleRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<AccessRoleRepository>;

    accessAccountRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<AccessAccountRepository>;

    membershipRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findActiveByPersonAndResidentialComplex: jest.fn(),
      findActiveByAccessAccountAndResidentialComplex: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn(),
    };

    useCase = new CreateMembershipUseCase(
      personRepository,
      residentialComplexRepository,
      accessRoleRepository,
      accessAccountRepository,
      membershipRepository,
      idGenerator,
    );

    idGenerator.generate.mockReturnValue('membership-1');

    personRepository.findById.mockResolvedValue(person);
    residentialComplexRepository.findById.mockResolvedValue(residentialComplex);
    accessRoleRepository.findById.mockResolvedValue(accessRole);
    accessAccountRepository.findById.mockResolvedValue(accessAccount);
    membershipRepository.findActiveByPersonAndResidentialComplex.mockResolvedValue(null);
    membershipRepository.save.mockImplementation((membership) => Promise.resolve(membership));
  });

  it('creates a membership', async () => {
    const result = await useCase.execute(input);

    expect(result).toBeInstanceOf(Membership);

    expect(result.id).toBe('membership-1');
    expect(result.personId).toBe('person-1');
    expect(result.accessAccountId).toBe('account-1');
    expect(result.residentialComplexId).toBe('complex-1');
    expect(result.accessRoleId).toBe('role-1');
    expect(result.status).toBe('ACTIVE');
    expect(result.startDate).toEqual(input.startDate);
    expect(result.endDate).toBeNull();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects when the person does not exist', async () => {
    personRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(PersonNotFoundError);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(residentialComplexRepository.findById).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).not.toHaveBeenCalled();
  });

  it('rejects when the residential complex does not exist', async () => {
    residentialComplexRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(ResidentialComplexNotFoundError);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(accessRoleRepository.findById).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).not.toHaveBeenCalled();
  });

  it('rejects when the access role does not exist', async () => {
    accessRoleRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(AccessRoleNotFoundError);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(accessAccountRepository.findById).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).not.toHaveBeenCalled();
  });

  it('rejects when the access role is inactive', async () => {
    accessRoleRepository.findById.mockResolvedValue({
      ...accessRole,
      isActive: () => false,
    } as Awaited<ReturnType<AccessRoleRepository['findById']>>);

    await expect(useCase.execute(input)).rejects.toThrow(AccessRoleInactiveError);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(accessAccountRepository.findById).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).not.toHaveBeenCalled();
  });

  it('rejects when the access account does not exist', async () => {
    accessAccountRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(AccessAccountNotFoundError);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).not.toHaveBeenCalled();
  });

  it('rejects when the access account belongs to another person', async () => {
    accessAccountRepository.findById.mockResolvedValue({
      ...accessAccount,
      personId: 'person-2',
    } as Awaited<ReturnType<AccessAccountRepository['findById']>>);

    await expect(useCase.execute(input)).rejects.toThrow(AccessAccountBelongsToAnotherPersonError);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).not.toHaveBeenCalled();
  });

  it('allows a membership without an access account', async () => {
    const result = await useCase.execute({
      ...input,
      accessAccountId: null,
    });

    expect(result.accessAccountId).toBeNull();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(accessAccountRepository.findById).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects when the person already has an active membership in the residential complex', async () => {
    const existingMembership = Membership.create({
      id: 'existing-membership',
      personId: 'person-1',
      accessAccountId: 'account-1',
      residentialComplexId: 'complex-1',
      accessRoleId: 'role-1',
      status: 'ACTIVE',
      startDate: new Date('2026-01-01'),
      endDate: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    });

    membershipRepository.findActiveByPersonAndResidentialComplex.mockResolvedValue(
      existingMembership,
    );

    await expect(useCase.execute(input)).rejects.toThrow(PersonAlreadyHasActiveMembershipError);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).not.toHaveBeenCalled();
  });

  it('allows a new membership when there is no active membership', async () => {
    membershipRepository.findActiveByPersonAndResidentialComplex.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result.id).toBe('membership-1');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).toHaveBeenCalledTimes(1);
  });

  it('creates a membership with an end date', async () => {
    const endDate = new Date('2026-12-31');

    const result = await useCase.execute({
      ...input,
      endDate,
    });

    expect(result.endDate).toEqual(endDate);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects when the end date is before the start date', async () => {
    const endDate = new Date('2026-08-16');

    await expect(
      useCase.execute({
        ...input,
        endDate,
      }),
    ).rejects.toThrow('Membership end date cannot be before start date');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(membershipRepository.save).not.toHaveBeenCalled();
  });
});
