import { Membership } from './membership.entity';

describe('Membership', () => {
  it('should create an active membership', () => {
    const startDate = new Date('2026-01-01T00:00:00.000Z');

    const membership = Membership.create({
      id: 'membership-1',
      personId: 'person-1',
      accessAccountId: 'access-account-1',
      residentialComplexId: 'complex-1',
      accessRoleId: 'access-role-1',
      status: 'ACTIVE',
      startDate,
      endDate: null,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-12-31T00:00:00.000Z'),
    });

    expect(membership.id).toBe('membership-1');
    expect(membership.personId).toBe('person-1');
    expect(membership.accessAccountId).toBe('access-account-1');
    expect(membership.residentialComplexId).toBe('complex-1');
    expect(membership.accessRoleId).toBe('access-role-1');
    expect(membership.status).toBe('ACTIVE');
    expect(membership.startDate).toBe(startDate);
    expect(membership.endDate).toBeNull();
  });

  it('should create a membership without an access account', () => {
    const startDate = new Date('2026-01-01T00:00:00.000Z');

    const membership = Membership.create({
      id: 'membership-2',
      personId: 'person-2',
      accessAccountId: null,
      residentialComplexId: 'complex-1',
      accessRoleId: 'access-role-1',
      status: 'ACTIVE',
      startDate,
      endDate: null,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-12-31T00:00:00.000Z'),
    });

    expect(membership.accessAccountId).toBeNull();
  });

  it('should create a finished membership', () => {
    const startDate = new Date('2024-01-01T00:00:00.000Z');
    const endDate = new Date('2024-12-31T00:00:00.000Z');

    const membership = Membership.create({
      id: 'membership-3',
      personId: 'person-3',
      accessAccountId: 'access-account-1',
      residentialComplexId: 'complex-1',
      accessRoleId: 'access-role-1',
      status: 'INACTIVE',
      startDate,
      endDate,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-12-31T00:00:00.000Z'),
    });

    expect(membership.status).toBe('INACTIVE');
    expect(membership.startDate).toBe(startDate);
    expect(membership.endDate).toBe(endDate);
  });

  it('should allow an end date equal to the start date', () => {
    const date = new Date('2026-02-01T00:00:00.000Z');

    const membership = Membership.create({
      id: 'membership-4',
      personId: 'person-4',
      accessAccountId: 'access-account-1',
      residentialComplexId: 'complex-1',
      accessRoleId: 'access-role-1',
      status: 'ACTIVE',
      startDate: date,
      endDate: date,
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
      updatedAt: new Date('2026-02-01T00:00:00.000Z'),
    });

    expect(membership.endDate).toBe(date);
  });

  it('should update the membership status', () => {
    const startDate = new Date('2026-01-01T00:00:00.000Z');

    const membership = Membership.create({
      id: 'membership-6',
      personId: 'person-6',
      accessAccountId: 'access-account-1',
      residentialComplexId: 'complex-1',
      accessRoleId: 'access-role-1',
      status: 'ACTIVE',
      startDate,
      endDate: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    const updated = membership.updateStatus('INACTIVE');

    expect(updated.status).toBe('INACTIVE');
    expect(updated.id).toBe(membership.id);
    expect(updated.personId).toBe(membership.personId);
    expect(updated.residentialComplexId).toBe(membership.residentialComplexId);
    expect(updated.accessRoleId).toBe(membership.accessRoleId);
  });

  describe('deactivate', () => {
    it('should create an inactive membership with the given end date', () => {
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
        startDate: new Date('2026-08-01T09:00:00.000Z'),
        endDate: null,
        createdAt,
        updatedAt,
      });

      const deactivatedMembership = membership.deactivate(endDate);

      expect(deactivatedMembership).not.toBe(membership);
      expect(deactivatedMembership.id).toBe(membership.id);
      expect(deactivatedMembership.personId).toBe(membership.personId);
      expect(deactivatedMembership.residentialComplexId).toBe(membership.residentialComplexId);
      expect(deactivatedMembership.accessRoleId).toBe(membership.accessRoleId);
      expect(deactivatedMembership.status).toBe('INACTIVE');
      expect(deactivatedMembership.endDate).toBe(endDate);
      expect(deactivatedMembership.createdAt).toBe(createdAt);
    });
  });
});
