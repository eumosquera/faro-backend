import { PersonUnit } from '../../../domain/entities/person-unit.entity';
import type { PersonRepository } from '../../../domain/repositories/person.repository';
import type { PersonUnitRepository } from '../../../domain/repositories/person-unit.repository';
import type { RolePersonaRepository } from '../../../domain/repositories/role-persona.repository';
import type { PrivateUnitRepository } from '../../../../structure/domain/repositories/private-unit.repository';
import type { IdGenerator } from '../../../../../shared/identity/id-generator';

import { InvalidPersonUnitDateRangeError } from '../../errors/invalid-person-unit-date-range.error';
import { PersonNotFoundError } from '../../errors/person-not-found.error';
import { PrivateUnitNotFoundError } from '../../errors/private-unit-not-found.error';
import { RolePersonaInactiveError } from '../../errors/role-persona-inactive.error';
import { RolePersonaNotFoundError } from '../../errors/role-persona-not-found.error';

import { CreatePersonUnitUseCase } from './create-person-unit.use-case';

describe('CreatePersonUnitUseCase', () => {
  let useCase: CreatePersonUnitUseCase;
  let personUnitRepository: jest.Mocked<PersonUnitRepository>;
  let personRepository: jest.Mocked<PersonRepository>;
  let privateUnitRepository: jest.Mocked<PrivateUnitRepository>;
  let rolePersonaRepository: jest.Mocked<RolePersonaRepository>;
  let idGenerator: jest.Mocked<IdGenerator>;

  let saveSpy: jest.SpiedFunction<PersonUnitRepository['save']>;
  let generateSpy: jest.SpiedFunction<IdGenerator['generate']>;

  beforeEach(() => {
    personUnitRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    personRepository = {
      findById: jest.fn(),
      findByIdentification: jest.fn(),
      save: jest.fn(),
    };

    privateUnitRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    rolePersonaRepository = {
      findById: jest.fn(),
      findByCode: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
    };

    idGenerator = {
      generate: jest.fn().mockReturnValue('person-unit-1'),
    };

    saveSpy = jest.spyOn(personUnitRepository, 'save');
    generateSpy = jest.spyOn(idGenerator, 'generate');

    useCase = new CreatePersonUnitUseCase(
      personUnitRepository,
      personRepository,
      privateUnitRepository,
      rolePersonaRepository,
      idGenerator,
    );
  });

  it('should create and save a person-unit relationship', async () => {
    const startDate = new Date('2024-01-15T00:00:00.000Z');

    personRepository.findById.mockResolvedValue({
      id: 'person-1',
    } as never);

    privateUnitRepository.findById.mockResolvedValue({
      id: 'private-unit-401',
    } as never);

    rolePersonaRepository.findById.mockResolvedValue({
      id: 'role-propietario',
      status: 'ACTIVE',
    } as never);

    const result = await useCase.execute({
      personId: 'person-1',
      privateUnitId: 'private-unit-401',
      rolePersonaId: 'role-propietario',
      startDate,
    });

    expect(result).toBeInstanceOf(PersonUnit);
    expect(result.id).toBe('person-unit-1');
    expect(result.personId).toBe('person-1');
    expect(result.privateUnitId).toBe('private-unit-401');
    expect(result.rolePersonaId).toBe('role-propietario');
    expect(result.startDate).toBe(startDate);
    expect(result.endDate).toBeNull();
    expect(result.status).toBe('ACTIVE');
    expect(result.observations).toBeNull();

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledTimes(1);
  });

  it('should allow multiple active relationships for the same person and unit', async () => {
    const startDate = new Date('2025-01-01T00:00:00.000Z');

    personRepository.findById.mockResolvedValue({
      id: 'person-1',
    } as never);

    privateUnitRepository.findById.mockResolvedValue({
      id: 'private-unit-401',
    } as never);

    rolePersonaRepository.findById.mockResolvedValue({
      id: 'role-residente',
      status: 'ACTIVE',
    } as never);

    const result = await useCase.execute({
      personId: 'person-1',
      privateUnitId: 'private-unit-401',
      rolePersonaId: 'role-residente',
      startDate,
    });

    expect(result.rolePersonaId).toBe('role-residente');
    expect(result.status).toBe('ACTIVE');
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw when the person does not exist', async () => {
    personRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        personId: 'person-1',
        privateUnitId: 'private-unit-401',
        rolePersonaId: 'role-propietario',
        startDate: new Date('2024-01-01T00:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(PersonNotFoundError);

    expect(generateSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should throw when the private unit does not exist', async () => {
    personRepository.findById.mockResolvedValue({
      id: 'person-1',
    } as never);

    privateUnitRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        personId: 'person-1',
        privateUnitId: 'private-unit-401',
        rolePersonaId: 'role-propietario',
        startDate: new Date('2024-01-01T00:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(PrivateUnitNotFoundError);

    expect(generateSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should throw when the role persona does not exist', async () => {
    personRepository.findById.mockResolvedValue({
      id: 'person-1',
    } as never);

    privateUnitRepository.findById.mockResolvedValue({
      id: 'private-unit-401',
    } as never);

    rolePersonaRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        personId: 'person-1',
        privateUnitId: 'private-unit-401',
        rolePersonaId: 'role-propietario',
        startDate: new Date('2024-01-01T00:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(RolePersonaNotFoundError);

    expect(generateSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should throw when the role persona is inactive', async () => {
    personRepository.findById.mockResolvedValue({
      id: 'person-1',
    } as never);

    privateUnitRepository.findById.mockResolvedValue({
      id: 'private-unit-401',
    } as never);

    rolePersonaRepository.findById.mockResolvedValue({
      id: 'role-propietario',
      status: 'INACTIVE',
    } as never);

    await expect(
      useCase.execute({
        personId: 'person-1',
        privateUnitId: 'private-unit-401',
        rolePersonaId: 'role-propietario',
        startDate: new Date('2024-01-01T00:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(RolePersonaInactiveError);

    expect(generateSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should throw when end date is earlier than start date', async () => {
    personRepository.findById.mockResolvedValue({
      id: 'person-1',
    } as never);

    privateUnitRepository.findById.mockResolvedValue({
      id: 'private-unit-401',
    } as never);

    rolePersonaRepository.findById.mockResolvedValue({
      id: 'role-propietario',
      status: 'ACTIVE',
    } as never);

    await expect(
      useCase.execute({
        personId: 'person-1',
        privateUnitId: 'private-unit-401',
        rolePersonaId: 'role-propietario',
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        endDate: new Date('2024-12-31T00:00:00.000Z'),
      }),
    ).rejects.toBeInstanceOf(InvalidPersonUnitDateRangeError);

    expect(generateSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should create a relationship with an end date', async () => {
    const startDate = new Date('2022-01-01T00:00:00.000Z');
    const endDate = new Date('2024-12-31T00:00:00.000Z');

    personRepository.findById.mockResolvedValue({
      id: 'person-1',
    } as never);

    privateUnitRepository.findById.mockResolvedValue({
      id: 'private-unit-401',
    } as never);

    rolePersonaRepository.findById.mockResolvedValue({
      id: 'role-arrendatario',
      status: 'ACTIVE',
    } as never);

    const result = await useCase.execute({
      personId: 'person-1',
      privateUnitId: 'private-unit-401',
      rolePersonaId: 'role-arrendatario',
      startDate,
      endDate,
      observations: 'Contrato finalizado.',
    });

    expect(result.startDate).toBe(startDate);
    expect(result.endDate).toBe(endDate);
    expect(result.observations).toBe('Contrato finalizado.');
    expect(result.status).toBe('ACTIVE');
  });
});
