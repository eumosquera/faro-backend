import { RolePersona } from '../../../domain/entities/role-persona.entity';
import type { RolePersonaRepository } from '../../../domain/repositories/role-persona.repository';
import type { IdGenerator } from '../../../../../shared/identity/id-generator';
import { RolePersonaCodeAlreadyExistsError } from '../../errors/role-persona-code-already-exists.error';
import { RolePersonaNameAlreadyExistsError } from '../../errors/role-persona-name-already-exists.error';
import { CreateRolePersonaUseCase } from './create-role-persona.use-case';

describe('CreateRolePersonaUseCase', () => {
  let useCase: CreateRolePersonaUseCase;
  let rolePersonaRepository: jest.Mocked<RolePersonaRepository>;
  let idGenerator: jest.Mocked<IdGenerator>;

  let saveSpy: jest.SpiedFunction<RolePersonaRepository['save']>;
  let generateSpy: jest.SpiedFunction<IdGenerator['generate']>;

  beforeEach(() => {
    rolePersonaRepository = {
      findById: jest.fn(),
      findByCode: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue('role-persona-1'),
    };

    saveSpy = jest.spyOn(rolePersonaRepository, 'save');
    generateSpy = jest.spyOn(idGenerator, 'generate');

    useCase = new CreateRolePersonaUseCase(rolePersonaRepository, idGenerator);
  });

  it('should create and save a role persona', async () => {
    rolePersonaRepository.findByCode.mockResolvedValue(null);
    rolePersonaRepository.findByName.mockResolvedValue(null);

    const result = await useCase.execute({
      code: 'PROPIETARIO',
      name: 'Propietario',
      description: 'Persona titular de una unidad privada.',
    });

    expect(result).toBeInstanceOf(RolePersona);
    expect(result.id).toBe('role-persona-1');
    expect(result.code).toBe('PROPIETARIO');
    expect(result.name).toBe('Propietario');
    expect(result.description).toBe('Persona titular de una unidad privada.');
    expect(result.status).toBe('ACTIVE');

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw when the role persona code already exists', async () => {
    const existingRolePersona = RolePersona.create({
      id: 'existing-role-persona',
      code: 'PROPIETARIO',
      name: 'Propietario',
      description: 'Existing role persona.',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    rolePersonaRepository.findByCode.mockResolvedValue(existingRolePersona);

    await expect(
      useCase.execute({
        code: 'PROPIETARIO',
        name: 'Another Owner',
        description: 'Another role persona.',
      }),
    ).rejects.toBeInstanceOf(RolePersonaCodeAlreadyExistsError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });

  it('should throw when the role persona name already exists', async () => {
    const existingRolePersona = RolePersona.create({
      id: 'existing-role-persona',
      code: 'OWNER',
      name: 'Propietario',
      description: 'Existing role persona.',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    rolePersonaRepository.findByCode.mockResolvedValue(null);
    rolePersonaRepository.findByName.mockResolvedValue(existingRolePersona);

    await expect(
      useCase.execute({
        code: 'PROPIETARIO',
        name: 'Propietario',
        description: 'Another role persona.',
      }),
    ).rejects.toBeInstanceOf(RolePersonaNameAlreadyExistsError);

    expect(saveSpy).not.toHaveBeenCalled();
    expect(generateSpy).not.toHaveBeenCalled();
  });
});
