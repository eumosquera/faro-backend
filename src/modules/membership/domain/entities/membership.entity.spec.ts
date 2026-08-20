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

  it('should reject an end date before the start date', () => {
    expect(() =>
      Membership.create({
        id: 'membership-5',
        personId: 'person-5',
        accessAccountId: 'access-account-1',
        residentialComplexId: 'complex-1',
        accessRoleId: 'access-role-1',
        status: 'ACTIVE',
        startDate: new Date('2026-02-01T00:00:00.000Z'),
        endDate: new Date('2026-01-31T00:00:00.000Z'),
        createdAt: new Date('2026-02-01T00:00:00.000Z'),
        updatedAt: new Date('2026-02-01T00:00:00.000Z'),
      }),
    ).toThrow('Membership end date cannot be before start date');
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
});
