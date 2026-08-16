import { AccessRolePermission } from './access-role-permission.entity';

describe('AccessRolePermission', () => {
  it('should create an access role permission with the provided properties', () => {
    const createdAt = new Date('2026-08-15T00:00:00.000Z');

    const accessRolePermission = AccessRolePermission.create({
      id: 'access-role-permission-1',
      accessRoleId: 'access-role-1',
      permissionId: 'permission-1',
      createdAt,
    });

    expect(accessRolePermission.id).toBe('access-role-permission-1');
    expect(accessRolePermission.accessRoleId).toBe('access-role-1');
    expect(accessRolePermission.permissionId).toBe('permission-1');
    expect(accessRolePermission.createdAt).toBe(createdAt);
  });
});
