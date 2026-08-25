import { Membership } from '../../../domain/entities/membership.entity';
import type { MembershipRepository } from '../../../domain/repositories/membership.repository';
import { MembershipNotFoundError } from '../../errors/membership-not-found.error';
import { DeactivateMembershipUseCase } from './deactivate-membership.use-case';

describe('DeactivateMembershipUseCase', () => {
  let useCase: DeactivateMembershipUseCase;
  let membershipRepository: jest.Mocked<MembershipRepository>;

  let findByIdSpy: jest.SpiedFunction<MembershipRepository['findById']>;
  let saveSpy: jest.SpiedFunction<MembershipRepository['save']>;

  beforeEach(() => {
    membershipRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findActiveByPersonAndResidentialComplex: jest.fn(),
      findActiveByAccessAccountAndResidentialComplex: jest.fn(),
    };

    findByIdSpy = jest.spyOn(membershipRepository, 'findById');
    saveSpy = jest.spyOn(membershipRepository, 'save');

    useCase = new DeactivateMembershipUseCase(membershipRepository);
  });

  it('should deactivate an active membership', async () => {
    const startDate = new Date('2026-08-01T10:00:00.000Z');
    const createdAt = new Date('2026-08-01T10:00:00.000Z');
    const updatedAt = new Date('2026-08-01T10:00:00.000Z');
    const endDate = new Date('2026-08-23T16:00:00.000Z');

    const membership = Membership.create({
      id: 'membership-1',
      personId: 'person-1',
      accessAccountId: 'account-1',
      residentialComplexId: 'complex-1',
      accessRoleId: 'role-1',
      status: 'ACTIVE',
      startDate,
      endDate: null,
      createdAt,
      updatedAt,
    });

    findByIdSpy.mockResolvedValue(membership);
    findByIdSpy.mockResolvedValue(membership);
    saveSpy.mockImplementation((value) => Promise.resolve(value));
    const result = await useCase.execute({
      membershipId: membership.id,
      endDate,
    });

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenCalledWith(membership.id);

    expect(result.status).toBe('INACTIVE');
    expect(result.endDate).toBe(endDate);

    expect(result).not.toBe(membership);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(result);
  });

  it('should use the current date when end date is not provided', async () => {
    const membership = Membership.create({
      id: 'membership-2',
      personId: 'person-2',
      accessAccountId: 'account-2',
      residentialComplexId: 'complex-2',
      accessRoleId: 'role-2',
      status: 'ACTIVE',
      startDate: new Date('2026-08-01T10:00:00.000Z'),
      endDate: null,
      createdAt: new Date('2026-08-01T10:00:00.000Z'),
      updatedAt: new Date('2026-08-01T10:00:00.000Z'),
    });

    findByIdSpy.mockResolvedValue(membership);
    findByIdSpy.mockResolvedValue(membership);
    saveSpy.mockImplementation((value) => Promise.resolve(value));
    const before = new Date();

    const result = await useCase.execute({
      membershipId: membership.id,
    });

    const after = new Date();

    expect(result.status).toBe('INACTIVE');
    expect(result.endDate).not.toBeNull();
    expect(result.endDate!.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(result.endDate!.getTime()).toBeLessThanOrEqual(after.getTime());

    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw when the membership does not exist', async () => {
    findByIdSpy.mockResolvedValue(null);

    await expect(
      useCase.execute({
        membershipId: 'non-existent-membership',
      }),
    ).rejects.toBeInstanceOf(MembershipNotFoundError);

    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).not.toHaveBeenCalled();
  });
});
