import { AccessRole } from '../../../domain/entities/access-role.entity';
import type { AccessRoleRepository } from '../../../domain/repositories/access-role.repository';
import type { IdGenerator } from '../../../../../shared/identity/id-generator';
import { AccessRoleCodeAlreadyExistsError } from '../../errors/access-role-code-already-exists.error';
import { AccessRoleNameAlreadyExistsError } from '../../errors/access-role-name-already-exists.error';
import { CreateAccessRoleUseCase } from './create-access-role.use-case';

describe('CreateAccessRoleUseCase', () => {
  let useCase: CreateAccessRoleUseCase;
  let accessRoleRepository: jest.Mocked<AccessRoleRepository>;
  let idGenerator: jest.Mocked<IdGenerator>;

  let saveSpy: jest.SpiedFunction<AccessRoleRepository['save']>;
  let generateSpy: jest.SpiedFunction<IdGenerator['generate']>;

  beforeEach(() => {
    accessRoleRepository = {
      findById: jest.fn(),
      findByCode: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue('role-persona-1'),
    };

    saveSpy = jest.spyOn(accessRoleRepository, 'save');
    generateSpy = jest.spyOn(idGenerator, 'generate');

    useCase = new CreateAccessRoleUseCase(accessRoleRepository, idGenerator);
  });

  it('should create and save an access role', async () => {
    accessRoleRepository.findByCode.mockResolvedValue(null);
    accessRoleRepository.findByName.mockResolvedValue(null);

    const result = await useCase.execute({
      code: 'ADMIN',
      name: 'Administrador',
      description: 'Persona con permisos de administración.',
    });

    expect(result).toBeInstanceOf(AccessRole);
    expect(result.id).toBe('role-persona-1');
    expect(result.code).toBe('ADMIN');
    expect(result.name).toBe('Administrador');
    expect(result.description).toBe('Persona con permisos de administración.');
    expect(result.status).toBe('ACTIVE');

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw when the access role code already exists', async () => {
    const existingAccessRole = AccessRole.create({
      id: 'existing-access-role',
      code: 'ADMIN',
      name: 'Administrador',
      description: 'Existing access role.',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    accessRoleRepository.findByCode.mockResolvedValue(existingAccessRole);

    await expect(
      useCase.execute({
        code: 'ADMIN',
        name: 'Another Administrator',
        description: 'Another access role.',
      }),
    ).rejects.toBeInstanceOf(AccessRoleCodeAlreadyExistsError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when the access role name already exists', async () => {
    const existingAccessRole = AccessRole.create({
      id: 'existing-access-role',
      code: 'ADMIN',
      name: 'Administrador',
      description: 'Existing access role.',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    accessRoleRepository.findByCode.mockResolvedValue(null);
    accessRoleRepository.findByName.mockResolvedValue(existingAccessRole);

    await expect(
      useCase.execute({
        code: 'ADMIN',
        name: 'Administrador',
        description: 'Another access role.',
      }),
    ).rejects.toBeInstanceOf(AccessRoleNameAlreadyExistsError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });
});
