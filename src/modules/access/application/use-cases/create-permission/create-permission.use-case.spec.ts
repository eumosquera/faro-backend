import { Permission } from '../../../domain/entities/permission.entity';
import type { PermissionRepository } from '../../../domain/repositories/permission.repository';
import type { IdGenerator } from '../../../../../shared/identity/id-generator';
import { PermissionCodeAlreadyExistsError } from '../../errors/permission-code-already-exists.error';
import { PermissionNameAlreadyExistsError } from '../../errors/permission-name-already-exists.error';
import { CreatePermissionUseCase } from './create-permission.use-case';

describe('CreatePermissionUseCase', () => {
  let useCase: CreatePermissionUseCase;
  let permissionRepository: jest.Mocked<PermissionRepository>;
  let idGenerator: jest.Mocked<IdGenerator>;

  let saveSpy: jest.SpiedFunction<PermissionRepository['save']>;
  let generateSpy: jest.SpiedFunction<IdGenerator['generate']>;

  beforeEach(() => {
    permissionRepository = {
      findById: jest.fn(),
      findByCode: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue('role-persona-1'),
    };

    saveSpy = jest.spyOn(permissionRepository, 'save');
    generateSpy = jest.spyOn(idGenerator, 'generate');

    useCase = new CreatePermissionUseCase(permissionRepository, idGenerator);
  });

  it('should create and save a permission', async () => {
    permissionRepository.findByCode.mockResolvedValue(null);
    permissionRepository.findByName.mockResolvedValue(null);

    const result = await useCase.execute({
      code: 'VIEW_ACCESS_LOGS',
      name: 'Ver registros de acceso',
      description:
        'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
    });

    expect(result).toBeInstanceOf(Permission);
    expect(result.id).toBe('role-persona-1');
    expect(result.code).toBe('VIEW_ACCESS_LOGS');
    expect(result.name).toBe('Ver registros de acceso');
    expect(result.description).toBe(
      'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
    );
    expect(result.status).toBe('ACTIVE');

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw when the permission code already exists', async () => {
    const existingPermission = Permission.create({
      id: 'existing-permission',
      code: 'VIEW_ACCESS_LOGS',
      name: 'Ver registros de acceso',
      description:
        'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    permissionRepository.findByCode.mockResolvedValue(existingPermission);

    await expect(
      useCase.execute({
        code: 'VIEW_ACCESS_LOGS',
        name: 'Another Permission',
        description: 'Another permission.',
      }),
    ).rejects.toBeInstanceOf(PermissionCodeAlreadyExistsError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when the permission name already exists', async () => {
    const existingPermission = Permission.create({
      id: 'existing-permission',
      code: 'ANOTHER_CODE',
      name: 'Ver registros de acceso',
      description:
        'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    permissionRepository.findByCode.mockResolvedValue(null);
    permissionRepository.findByName.mockResolvedValue(existingPermission);

    await expect(
      useCase.execute({
        code: 'ANOTHER_CODE',
        name: 'Ver registros de acceso',
        description:
          'Permite consultar los registros históricos de entrada y salida de la copropiedad.',
      }),
    ).rejects.toBeInstanceOf(PermissionNameAlreadyExistsError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });
});
