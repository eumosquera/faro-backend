import type { AccessRolePermissionRepository } from '../../../domain/repositories/access-role-permission.repository';

import { AccessRolePermissionNotFoundError } from '../../errors/access-role-permission-not-found.error';

import { RemovePermissionFromAccessRoleUseCase } from './remove-permission-from-access-role.use-case';

describe('RemovePermissionFromAccessRoleUseCase', () => {
  const accessRolePermissionRepository = {
    findByRoleAndPermission: jest.fn(),
    delete: jest.fn(),
  };

  let useCase: RemovePermissionFromAccessRoleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new RemovePermissionFromAccessRoleUseCase(
      accessRolePermissionRepository as unknown as AccessRolePermissionRepository,
    );
  });

  it('should remove an existing permission assignment', async () => {
    accessRolePermissionRepository.findByRoleAndPermission.mockResolvedValue({
      id: 'access-role-permission-1',
    });

    await expect(
      useCase.execute({
        accessRoleId: 'access-role-1',
        permissionId: 'permission-1',
      }),
    ).resolves.toBeUndefined();

    expect(accessRolePermissionRepository.findByRoleAndPermission).toHaveBeenCalledWith(
      'access-role-1',
      'permission-1',
    );

    expect(accessRolePermissionRepository.delete).toHaveBeenCalledWith('access-role-permission-1');
  });

  it('should reject when the permission assignment does not exist', async () => {
    accessRolePermissionRepository.findByRoleAndPermission.mockResolvedValue(null);

    await expect(
      useCase.execute({
        accessRoleId: 'access-role-1',
        permissionId: 'permission-1',
      }),
    ).rejects.toBeInstanceOf(AccessRolePermissionNotFoundError);

    expect(accessRolePermissionRepository.delete).not.toHaveBeenCalled();
  });

  it('should not delete when the permission assignment does not exist', async () => {
    accessRolePermissionRepository.findByRoleAndPermission.mockResolvedValue(null);

    await expect(
      useCase.execute({
        accessRoleId: 'access-role-2',
        permissionId: 'permission-2',
      }),
    ).rejects.toBeInstanceOf(AccessRolePermissionNotFoundError);

    expect(accessRolePermissionRepository.delete).not.toHaveBeenCalled();
  });
});
