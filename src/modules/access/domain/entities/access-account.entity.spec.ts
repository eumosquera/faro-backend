import { AccessAccount } from './access-account.entity';

describe('AccessAccount', () => {
  it('should create an access account with the provided properties', () => {
    const createdAt = new Date('2026-08-15T00:00:00.000Z');
    const updatedAt = new Date('2026-08-15T00:00:00.000Z');

    const accessAccount = AccessAccount.create({
      id: 'access-account-1',
      personId: 'person-1',
      externalAuthId: 'supabase-user-1',
      status: 'ACTIVE',
      createdAt,
      updatedAt,
    });

    expect(accessAccount.id).toBe('access-account-1');
    expect(accessAccount.personId).toBe('person-1');
    expect(accessAccount.externalAuthId).toBe('supabase-user-1');
    expect(accessAccount.status).toBe('ACTIVE');
    expect(accessAccount.createdAt).toBe(createdAt);
    expect(accessAccount.updatedAt).toBe(updatedAt);
  });

  it('should create an inactive access account', () => {
    const createdAt = new Date('2026-08-15T00:00:00.000Z');
    const updatedAt = new Date('2026-08-15T00:00:00.000Z');

    const accessAccount = AccessAccount.create({
      id: 'access-account-2',
      personId: 'person-2',
      externalAuthId: 'supabase-user-2',
      status: 'INACTIVE',
      createdAt,
      updatedAt,
    });

    expect(accessAccount.status).toBe('INACTIVE');
  });
});
