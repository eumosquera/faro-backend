import { AccessRolePermission } from '../../../domain/entities/access-role-permission.entity';
import type { AccessRolePermissionRepository } from '../../../domain/repositories/access-role-permission.repository';
import type { AccessRoleRepository } from '../../../domain/repositories/access-role.repository';
import type { PermissionRepository } from '../../../domain/repositories/permission.repository';

import { AccessRoleInactiveError } from '../../errors/access-role-inactive.error';
import { AccessRoleNotFoundError } from '../../errors/access-role-not-found.error';
import { AccessRolePermissionAlreadyExistsError } from '../../errors/access-role-permission-already-exists.error';
import { PermissionInactiveError } from '../../errors/permission-inactive.error';
import { PermissionNotFoundError } from '../../errors/permission-not-found.error';

import { AssignPermissionToAccessRoleUseCase } from './assign-permission-to-access-role.use-case';

describe('AssignPermissionToAccessRoleUseCase', () => {
  const accessRoleRepository = {
    findById: jest.fn(),
  };

  const permissionRepository = {
    findById: jest.fn(),
  };

  const accessRolePermissionRepository = {
    findByRoleAndPermission: jest.fn(),
    save: jest.fn(),
  };

  const idGenerator = {
    generate: jest.fn(),
  };

  let useCase: AssignPermissionToAccessRoleUseCase;

  const accessRole = {
    id: 'access-role-1',
    status: 'ACTIVE' as const,
  };

  const permission = {
    id: 'permission-1',
    status: 'ACTIVE' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    idGenerator.generate.mockReturnValue('access-role-permission-1');

    useCase = new AssignPermissionToAccessRoleUseCase(
      accessRoleRepository as unknown as AccessRoleRepository,
      permissionRepository as unknown as PermissionRepository,
      accessRolePermissionRepository as unknown as AccessRolePermissionRepository,
      idGenerator,
    );
  });

  it('should assign an active permission to an active access role', async () => {
    accessRoleRepository.findById.mockResolvedValue(accessRole);
    permissionRepository.findById.mockResolvedValue(permission);
    accessRolePermissionRepository.findByRoleAndPermission.mockResolvedValue(null);

    const result = await useCase.execute({
      accessRoleId: 'access-role-1',
      permissionId: 'permission-1',
    });

    expect(result).toBeInstanceOf(AccessRolePermission);
    expect(result.id).toBe('access-role-permission-1');
    expect(result.accessRoleId).toBe('access-role-1');
    expect(result.permissionId).toBe('permission-1');

    expect(accessRolePermissionRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should reject when the access role does not exist', async () => {
    accessRoleRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        accessRoleId: 'access-role-1',
        permissionId: 'permission-1',
      }),
    ).rejects.toBeInstanceOf(AccessRoleNotFoundError);

    expect(permissionRepository.findById).not.toHaveBeenCalled();
    expect(accessRolePermissionRepository.save).not.toHaveBeenCalled();
  });

  it('should reject when the access role is inactive', async () => {
    accessRoleRepository.findById.mockResolvedValue({
      ...accessRole,
      status: 'INACTIVE' as const,
    });

    await expect(
      useCase.execute({
        accessRoleId: 'access-role-1',
        permissionId: 'permission-1',
      }),
    ).rejects.toBeInstanceOf(AccessRoleInactiveError);

    expect(permissionRepository.findById).not.toHaveBeenCalled();
    expect(accessRolePermissionRepository.save).not.toHaveBeenCalled();
  });

  it('should reject when the permission does not exist', async () => {
    accessRoleRepository.findById.mockResolvedValue(accessRole);
    permissionRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        accessRoleId: 'access-role-1',
        permissionId: 'permission-1',
      }),
    ).rejects.toBeInstanceOf(PermissionNotFoundError);

    expect(accessRolePermissionRepository.findByRoleAndPermission).not.toHaveBeenCalled();

    expect(accessRolePermissionRepository.save).not.toHaveBeenCalled();
  });

  it('should reject when the permission is inactive', async () => {
    accessRoleRepository.findById.mockResolvedValue(accessRole);
    permissionRepository.findById.mockResolvedValue({
      ...permission,
      status: 'INACTIVE' as const,
    });

    await expect(
      useCase.execute({
        accessRoleId: 'access-role-1',
        permissionId: 'permission-1',
      }),
    ).rejects.toBeInstanceOf(PermissionInactiveError);

    expect(accessRolePermissionRepository.findByRoleAndPermission).not.toHaveBeenCalled();

    expect(accessRolePermissionRepository.save).not.toHaveBeenCalled();
  });

  it('should reject when the permission is already assigned to the access role', async () => {
    accessRoleRepository.findById.mockResolvedValue(accessRole);
    permissionRepository.findById.mockResolvedValue(permission);

    accessRolePermissionRepository.findByRoleAndPermission.mockResolvedValue({
      id: 'existing-assignment',
    });

    await expect(
      useCase.execute({
        accessRoleId: 'access-role-1',
        permissionId: 'permission-1',
      }),
    ).rejects.toBeInstanceOf(AccessRolePermissionAlreadyExistsError);

    expect(accessRolePermissionRepository.save).not.toHaveBeenCalled();
  });
});
